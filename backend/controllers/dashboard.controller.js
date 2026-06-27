const Inscription = require("../models/Inscription.model");
const Formation = require("../models/Formation.model");
const Participant = require("../models/Participant.model");


exports.getInscriptionsPerTheme = async (req, res) => {
  try {
    const data = await Inscription.aggregate([
      {
        $lookup: {
          from: "formations",
          localField: "formationId",
          foreignField: "_id",
          as: "formation",
        },
      },
      { $unwind: "$formation" },
      {
        $group: {
          _id: "$formation.theme",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getFormationModeDistribution = async (req, res) => {
  try {
    const data = await Formation.aggregate([
      {
        $group: {
          _id: "$modeFormation",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getInscriptionsOverTime = async (req, res) => {
  try {
    const data = await Inscription.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};