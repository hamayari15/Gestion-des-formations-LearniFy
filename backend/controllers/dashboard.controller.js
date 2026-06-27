const Inscription = require("../models/Inscription");
const Formation = require("../models/Formation");
const Participant = require("../models/Participant");


const getInscriptionsPerTheme = async (req, res) => {
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


const getFormationModeDistribution = async (req, res) => {
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


const getInscriptionsOverTime = async (req, res) => {
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