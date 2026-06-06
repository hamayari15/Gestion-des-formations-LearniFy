const Participant = require("../models/Participant.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.Register = async (req, res) => {
  try {
    const participant = new Participant(req.body);

    const savedParticipant = await participant.save();

    res.status(201).json(savedParticipant);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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

    const validPassword = await bcrypt.compare(
      password,
      participant.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Email or password invalid",
      });
    }

    const payload = {
      id: participant._id,
      fullname: participant.fullname,
      email: participant.email,
      age: participant.age,
      gender: participant.gender,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
    const updatedParticipant =
      await Participant.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
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
    const deletedParticipant =
      await Participant.findByIdAndDelete(
        req.params.id
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
    const { participantId, actualPassword } =
      req.body;

    const participant =
      await Participant.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    const isMatch = await bcrypt.compare(
      actualPassword,
      participant.password
    );

    res.status(200).json(isMatch);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { actualPassword, newPassword } =
      req.body;

    const participant =
      await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    const isMatch = await bcrypt.compare(
      actualPassword,
      participant.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    participant.password =
      await bcrypt.hash(newPassword, 10);

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