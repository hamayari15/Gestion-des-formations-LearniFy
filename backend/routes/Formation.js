const express = require("express");
const router = express.Router();

const Formation = require("../models/formation");
const Insciption = require("../models/inscription");



router.post("/add", async (req, res) => {
  try {
    const formation = new Formation({
      numSalle: req.body.numSalle,
      creditImpot: req.body.creditImpot,
      droitIndividuel: req.body.droitIndividuel,
      droitCollectif: req.body.droitCollectif,
      theme: req.body.theme,
      modeFormation: req.body.modeFormation,
      periodeDu: req.body.periodeDu,
      periodeA: req.body.periodeA,
      horaireDu: req.body.horaireDu,
      horaireA: req.body.horaireA,
    });
    const savedFormation = await formation.save();
    res.status(201).json(savedFormation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.get("/getall", async (req, res) => {
  try {
    const formations = await Formation.find();
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/getformation/:id", async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/getmyformation/:participantId", async (req, res) => {
  const id = req.params.participantId;
  try {
    const inscriptions = await Insciption.find({ participantId: id });
    if (!inscriptions.length) {
      return { message: "No inscriptions found for this participant." };
    }

    const formationIds = [
      ...new Set(inscriptions.map((inscription) => inscription.formationId)),
    ];

    const formations = await Formation.find({ _id: { $in: formationIds } });

    const result = inscriptions.map((inscription) => ({
      ...inscription.toObject(),
      formation:
        formations.find((f) => f._id.toString() === inscription.formationId) ||
        null,
    }));
    if (!result) {
      return res.status(404).json({ message: "Formation not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put("/update/:id", async (req, res) => {
  try {
    const updatedFormation = await Formation.findByIdAndUpdate(
      req.params.id,
      {
        numSalle: req.body.numSalle,
        creditImpot: req.body.creditImpot,
        droitIndividuel: req.body.droitIndividuel,
        droitCollectif: req.body.droitCollectif,
        theme: req.body.theme,
        modeFormation: req.body.modeFormation,
        periodeDu: req.body.periodeDu,
        periodeA: req.body.periodeA,
        horaireDu: req.body.horaireDu,
        horaireA: req.body.horaireA,
      },
      { new: true }
    );

    if (!updatedFormation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    res.json(updatedFormation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedFormation = await Formation.findByIdAndDelete(req.params.id);

    if (!deletedFormation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    res.json({ message: "Formation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.patch("/updateStatus/:id", async (req, res) => {
  try {
    const formationId = req.params.id;
    const { status } = req.body;

    if (!["Validée", "Refusée", "En Attente"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedFormation = await Formation.findByIdAndUpdate(
      formationId,
      { status: status },
      { new: true }
    );

    if (!updatedFormation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    updatedFormation.history.push({ status });
    await updatedFormation.save();

    res.status(200).json(updatedFormation);
  } catch (error) {
    console.error("Error updating formation status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
