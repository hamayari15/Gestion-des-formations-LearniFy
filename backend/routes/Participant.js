const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const participant = require("../models/participant");



router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const par = new participant(data);

    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(data.password, salt);

    par.password = cryptedPassword;

    const savedpar = await par.save();
    res.send(savedpar);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



router.post("/login", async (req, res) => {
  const data = req.body;
  const par = await participant.findOne({ email: data.email });
  console.log(data);

  if (!par) {
    res.status(400).send("email or password invalid");
  } else {
    const validpass = bcrypt.compareSync(data.password, par.password);

    if (!validpass) {
      res.status(401).send("email or password invalid");
    } else {
      const payload = {
        fullname: par.fullname,
        _id: par._id,
        email: par.email,
        gender: par.gender,
        age: par.age,
        id: par._id,
      };
      const token = jwt.sign(payload, "1234567", { expiresIn: "2h" }); 
      res.send({ token });
    }
  }
});



router.get("/getparticipants", async (req, res) => {
  try {
    const part = await participant.find();
    res.json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/getparticipant/:id", async (req, res) => {
  try {
    const par = await participant.findById(req.params.id);
    console.log("Participant ID:", req.params.id);
    if (!par) {
      return res.status(404).send({ message: "Participant introuvable" });
    }
    res.send(par);
  } catch (error) {
    res.status(500).send(error);
  }
});



router.put("/updateparticipant/:id", async (req, res) => {
  try {
    const participantId = req.params.id;
    const updatedData = req.body;

    const updatedParticipant = await participant.findByIdAndUpdate(
      participantId,
      updatedData
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }

    res.json({
      message: "Participant mis à jour avec succès.",
      data: updatedParticipant,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du participant:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



router.delete("/deleteparticipant/:id", async (req, res) => {
  try {
    const participantId = req.params.id;

    const deletedParticipant = await participant.findByIdAndDelete(
      participantId
    );

    if (!deletedParticipant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }

    res.json({ message: "Participant supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du participant:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



router.post("/participant/check-password", async (req, res) => {
  const { participantId, actualPassword } = req.body;

  try {
    const part = await participant.findById(participantId);
    if (!part) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const isMatch = await bcrypt.compare(actualPassword, part.password);
    if (isMatch) {
      return res.status(200).json(true);
    } else {
      return res.status(400).json(false);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});



router.put("/participant/:id/update-password", async (req, res) => {
  const { actualPassword, newPassword } = req.body;
  const participantId = req.params.id;

  try {
    const par = await participant.findById(participantId);
    if (!par) {
      return res.status(404).json({ message: "Participant introuvable." });
    }

    const isMatch = await bcrypt.compare(actualPassword, par.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Mot de passe actuel incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    par.password = hashedNewPassword;
    await par.save();

    res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



module.exports = router;
