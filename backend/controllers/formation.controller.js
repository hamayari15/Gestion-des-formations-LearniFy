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
      message: "Une erreur est survenue lors de l'ajout du cycle de formation."
    });
  }
};


exports.getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.find();

    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
        message: "Formation not found",
      });
    }

    res.status(200).json(updatedFormation);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.deleteFormation = async (req, res) => {
  try {
    const deletedFormation =
      await Formation.findByIdAndDelete(
        req.params.id
      );

    if (!deletedFormation) {
      return res.status(404).json({
        message: "Formation not found",
      });
    }

    res.status(200).json({
      message: "Formation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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