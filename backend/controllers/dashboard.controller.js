const Inscription = require("../models/Inscription.model");
const Formation = require("../models/Formation.model");
const Participant = require("../models/Participant.model");


exports.getInscriptionsByStatus = async (req, res) => {
  try {
    const raw = await Inscription.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const defaults = ["Validée", "Refusée", "En Attente"];

    const result = defaults.map(status => {
      const found = raw.find(r => r._id === status);
      return {
        _id: status,
        count: found ? found.count : 0
      };
    });

    res.json(result);
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