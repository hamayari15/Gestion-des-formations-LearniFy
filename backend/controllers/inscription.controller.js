const Inscription = require("../models/Inscription.model");
const Formation = require("../models/Formation.model");
const Participant = require("../models/Participant.model");

const mongoose = require("mongoose");


exports.addInscription = async (req, res) => {

  const { fullName, email, entreprise, service } = req.body;
  const { participantId, formationId } = req.params;

  if (!fullName || !email || !entreprise || !service) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires.",
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

    if (new Date() > new Date(formation.periodeA)) {
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

    res.status(201).json({
      message: "Votre inscription a été enregistrée.",
      inscription: saved,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Identifiant invalide." });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({
        message: firstError || "Certaines informations saisies sont invalides.",
      });
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


exports.getInscriptionStatsByParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: "participantId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({
        success: false,
        message: "participantId invalide",
      });
    }

    const objectId = new mongoose.Types.ObjectId(participantId);

    const statsAgg = await Inscription.aggregate([
      { $match: { participantId: objectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = { total: 0, valide: 0, refuse: 0, enAttente: 0 };

    statsAgg.forEach((item) => {
      stats.total += item.count;
      switch (item._id) {
        case "Validée": stats.valide = item.count; break;
        case "Refusée": stats.refuse = item.count; break;
        case "En Attente": stats.enAttente = item.count; break;
      }
    });

    return res.status(200).json({ success: true, data: { stats } });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


exports.getInscriptionsByParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({
        success: false,
        message: "participantId invalide",
      });
    }

    const inscriptions = await Inscription.find({ participantId })
      .populate("formationId", "theme modeFormation periodeDu periodeA horaireDu horaireA numSalle")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: inscriptions.length
        ? "Inscriptions fetched successfully"
        : "Aucune inscription trouvée",
      data: { inscriptions },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


exports.updateInscriptionStatus = async (
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