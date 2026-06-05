const express = require("express");
const router = express.Router();

const Inscription = require("../models/inscription");



router.post("/addinscription/:participantId/:formationId", async (req, res) => {
  const { theme, fullname, email, entreprise, service, numSalle } = req.body;
  const { participantId, formationId } = req.params;

  if (!theme || !fullname || !email || !entreprise || !service || !numSalle) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newInscription = new Inscription({
      numSalle,
      theme,
      fullname,
      email,
      entreprise,
      service,
      participantId,
      formationId,
    });

    const savedInscription = await newInscription.save();
    res.status(201).json(savedInscription);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const duplicatedField = error.keyValue.fullname ? "fullname" : "email";
      res.status(400).json({ message: `${duplicatedField} already exists.` });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});



router.get("/getinscriptions", async (req, res) => {
  try {
    const inscriptions = await Inscription.find();
    res.status(200).json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/getinscription/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const inscription = await Inscription.findById(id);
    if (!inscription) {
      return res.status(404).json({ message: "Inscription not found." });
    }

    res.status(200).json(inscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put("/inscriptions/:id", async (req, res) => {
  const inscriptionId = req.params.id;
  const updatedStatus = req.body.status;

  try {
    const inscription = await Inscription.findByIdAndUpdate(
      inscriptionId,
      { status: updatedStatus },
      { new: true }
    );
    if (!inscription) {
      return res.status(404).send({ message: "Inscription not found" });
    }
    res.send(inscription);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});



router.patch("/updatestatus/:id", async (req, res) => {
  const inscriptionId = req.params.id;
  const { status } = req.body;

  if (!["Validée", "Refusée", "En Attente"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    const inscription = await Inscription.findByIdAndUpdate(
      inscriptionId,
      { status: status },
      { new: true }
    );

    if (!inscription) {
      return res.status(404).json({ message: "Inscription non trouvée." });
    }

    res.status(200).json({ message: "Statut mis à jour avec succès", inscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
