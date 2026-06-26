const Formation = require("../models/Formation.model");
const Inscription = require("../models/Inscription.model");


exports.addFormation = async (req, res) => {
  try {
    const formation = new Formation(req.body);

    if (!req.body.creditImpot && !req.body.droitIndividuel && !req.body.droitCollectif) {
      return res.status(400).json({
        message: "Veuillez sélectionner un mode de financement."
      });
    }

    if (
      req.body.modeFormation === "Présentiel" &&
      !req.body.numSalle
    ) {
      return res.status(400).json({
        message: "Le numéro de salle est obligatoire pour une formation présentielle."
      });
    }

    const savedFormation = await formation.save();

    res.status(201).json({

      message:
      'Cycle de formation ajouté avec succès.',

      formation: savedFormation

    });
  } catch (error) {

     if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Une erreur serveur est survenue."
    });
  }
};


exports.getAllFormations = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const search = req.query.search || "";
    const mode = req.query.mode || "";

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.theme = {
        $regex: search,
        $options: "i"
      };
    }

    if (mode) {
      query.modeFormation = mode;
    }

    const totalItems = await Formation.countDocuments(query);

    const formations = await Formation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Formations récupérées avec succès",

      data: {
        formations,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des formations"
    });
  }
};


exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({
        message: "Formation not found",
      });
    }

    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getMyFormations = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const inscriptions = await Inscription.find({
      participantId,
    });

    if (!inscriptions.length) {
      return res.status(404).json({
        message: "No inscriptions found",
      });
    }

    const formationIds = [
      ...new Set(
        inscriptions.map(
          (inscription) => inscription.formationId
        )
      ),
    ];

    const formations = await Formation.find({
      _id: { $in: formationIds },
    });

    const result = inscriptions.map((inscription) => ({
      ...inscription.toObject(),
      formation:
        formations.find(
          (formation) =>
            formation._id.toString() ===
            inscription.formationId
        ) || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updateFormation = async (req, res) => {
  try {

    const updatedFormation =
      await Formation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedFormation) {
      return res.status(404).json({
        success: false,
        message: "Cycle de formation introuvable.",
      });
    }
    
    if (
      req.body.modeFormation === "Présentiel" &&
      !req.body.numSalle
    ) {
      return res.status(400).json({
        message: "Le numéro de salle est obligatoire pour une formation présentielle."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cycle de formation modifié avec succès.",
      formation: updatedFormation
    });

    } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Une erreur serveur est survenue."
    });

  }
};


exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);

    if (!formation) {
      return res.status(404).json({
        success: false,
        message: "Formation introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Formation supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !["Validée", "Refusée", "En Attente"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const formation =
      await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({
        message: "Formation not found",
      });
    }

    formation.status = status;

    formation.history.push({
      status,
    });

    await formation.save();

    res.status(200).json(formation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};