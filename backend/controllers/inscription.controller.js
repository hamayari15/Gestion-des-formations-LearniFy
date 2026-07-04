const Inscription = require("../models/Inscription.model");
const Formation = require("../models/Formation.model");
const Participant = require("../models/Participant.model");


exports.addInscription = async (req, res) => {

  const { fullName, email, entreprise, service } = req.body;
  const { participantId, formationId } = req.params;

  if (!fullName || !email || !entreprise || !service) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation introuvable." });
    }

    if (new Date() > new Date(formation.periodeDu)) {
      return res.status(400).json({
        message: "La période d'inscription pour cette formation est terminée.",
      });
    }

    const inscription = new Inscription({
      fullName,
      email,
      entreprise,
      service,
      participantId,
      formationId,
    });

    const saved = await inscription.save();

    res.status(201).json(saved);

  } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Vous êtes déjà inscrit à cette formation.",
      });
    }

    res.status(500).json({
      message: "Une erreur est survenue lors de l'inscription.",
    });
  }
};


exports.getInscriptions = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const search = req.query.search || '';
    const sort = req.query.sort || 'desc';

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.theme = {
        $regex: search,
        $options: 'i'
      };
    }

    const totalItems = await Inscription.countDocuments(query);

    const inscriptions = await Inscription.find(query)
      .populate("participantId")
      .populate("formationId")
        .sort({ createdAt: sort === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
      success: true,
      data: {
        inscriptions,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getInscriptionsByParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: "participantId is required",
      });
    }

    const inscriptions = await Inscription.find({ participantId });

    if (!inscriptions.length) {
      return res.status(404).json({
        success: false,
        message: "No inscriptions found for this participant",
        data: {
          inscriptions: [],
          stats: {
            total: 0,
            valide: 0,
            refuse: 0,
            enAttente: 0,
          },
        },
      });
    }

    const stats = await Inscription.aggregate([
      { $match: { participantId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    inscriptions.forEach((insc) => {
      switch (insc.status) {
        case "Validée":
          stats.valide++;
          break;
        case "Refusée":
          stats.refuse++;
          break;
        case "En Attente":
          stats.enAttente++;
          break;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Participant inscriptions fetched successfully",
      data: {
        inscriptions,
        stats,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


exports.updateInscription = async (
  req,
  res
) => {
  try {
    const inscription =
      await Inscription.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!inscription) {
      return res.status(404).json({
        message: "Inscription not found",
      });
    }

    res.status(200).json(inscription);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};