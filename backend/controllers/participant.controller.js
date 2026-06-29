const Participant = require("../models/Participant.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.Register = async (req, res) => {
  try {
    const existingUser = await Participant.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email has been registered. Please use another email.",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const participant = new Participant({
      ...req.body,
      image: req.file ? req.file.path : null,
      password: hashedPassword,
    });

    const savedParticipant = await participant.save();

    res.status(201).json({
      message: "Your account has been created successfully.",
      data: savedParticipant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};


exports.checkEmail = async (req, res) => {
  const user = await Participant.findOne({
    email: req.body.email,
  });

  return res.json({
    exists: !!user,
  });
};


exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const participant = await Participant.findOne({ email });

    if (!participant) {
      return res.status(400).json({
        message: "Email or password invalid",
      });
    }

    const validPassword = await bcrypt.compare(password, participant.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Email or password invalid",
      });
    }

    participant.lastLogin = new Date();
    await participant.save();

    const payload = {
      id: participant._id,
      role: "User",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      token,
      role: "User",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};


exports.getParticipants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const search = req.query.search || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    let query = {};

    if (search) {
      query.fullName = {
        $regex: search,
        $options: "i",
      };
    }

    if (status === "Actif") {
      query.lastLogin = { $gte: cutoff };
    }

    if (status === "Inactif") {
      query.$or = [{ lastLogin: null }, { lastLogin: { $lt: cutoff } }];
    }

    const totalItems = await Participant.countDocuments(query);

    const participants = await Participant.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedParticipants = participants.map((p) => ({
      ...p.toObject(),

      status: p.lastLogin && p.lastLogin >= cutoff ? "Actif" : "Inactif",
    }));

    res.status(200).json({
      success: true,

      data: {
        participants: formattedParticipants,

        currentPage: page,

        totalPages: Math.ceil(totalItems / limit),

        totalItems,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getParticipantsGrowth = async (req, res) => {
  try {
    const growth = await Participant.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      message:
        growth.length > 0
          ? "Statistiques de croissance des participants récupérées avec succès."
          : "Aucun participant n'a encore été enregistré.",
      totalDays: growth.length,
      data: growth,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de la récupération des statistiques de croissance des participants.",
      error: error.message,
    });
  }
};


exports.getActiveInactiveStats = async (req, res) => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    const active = await Participant.countDocuments({
      lastLogin: { $gte: cutoff },
    });

    const inactive = await Participant.countDocuments({
      $or: [{ lastLogin: null }, { lastLogin: { $lt: cutoff } }],
    });

    const total = active + inactive;

    return res.status(200).json({
      success: true,
      total,
      active,
      inactive,
      activePercent: total ? (active / total) * 100 : 0,
      inactivePercent: total ? (inactive / total) * 100 : 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching active/inactive stats",
      error: error.message,
    });
  }
};


exports.getParticipantById = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updateParticipant = async (req, res) => {
  try {
    const updatedParticipant = await Participant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedParticipant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.status(200).json({
      message: "Participant updated successfully",
      data: updatedParticipant,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.deleteParticipant = async (req, res) => {
  try {
    const deletedParticipant = await Participant.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedParticipant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.status(200).json({
      message: "Participant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.checkPassword = async (req, res) => {
  try {
    const { participantId, actualPassword } = req.body;

    const participant = await Participant.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    const isMatch = await bcrypt.compare(actualPassword, participant.password);

    res.status(200).json(isMatch);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { actualPassword, newPassword } = req.body;

    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    const isMatch = await bcrypt.compare(actualPassword, participant.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    participant.password = await bcrypt.hash(newPassword, 10);

    await participant.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
