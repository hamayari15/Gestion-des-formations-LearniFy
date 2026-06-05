const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const admin = require("../models/admin");



router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const adm = new admin(data);

    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(data.password, salt);

    adm.password = cryptedPassword;

    const savedadm = await adm.save();
    res.send(savedadm);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const adm = await admin.findOne({ email: data.email });

    if (!adm) {
      return res.status(400).send("Email or password invalid");
    }

    const validPass = await bcrypt.compare(data.password, adm.password);

    if (!validPass) {
      return res.status(401).send("Email or password invalid");
    }

    const payload = {
      name: adm.fullname,
      _id: adm._id,
      email: adm.email,
    };

    const token = jwt.sign(payload, "1234567", { expiresIn: "2h" }); 
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});



router.get("/getadmin/:id", async (req, res) => {
  try {
    const adm = await admin.findById(req.params.id);
    if (!adm) {
      return res.status(404).send({ message: "Admin introuvable" });
    }
    res.send(adm);
  } catch (error) {
    res.status(500).send(error);
  }
});



router.post("/admin/check-password", async (req, res) => {
  const { adminId, actualPassword } = req.body;

  try {
    const adm = await admin.findById(adminId);
    if (!adm) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(actualPassword, adm.password);
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



router.put("/admin/:id/update-password", async (req, res) => {
  const { actualPassword, newPassword } = req.body;
  const adminId = req.params.id;

  try {
    const adm = await admin.findById(adminId);
    if (!adm) {
      return res.status(404).json({ message: "Admin introuvable." });
    }

    const isMatch = await bcrypt.compare(actualPassword, adm.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Mot de passe actuel incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    adm.password = hashedNewPassword;
    await adm.save();

    res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



module.exports = router;
