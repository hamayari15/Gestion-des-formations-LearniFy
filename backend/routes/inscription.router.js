const express = require("express");
const router = express.Router();

const inscriptionController = require("../controllers/inscription.controller");


router.post("/addInscription/:participantId/:formationId", inscriptionController.addInscription);

router.get("/getInscriptions", inscriptionController.getInscriptions);

console.log("Inscription routes loaded");

router.get("/participant/:participantId", inscriptionController.getInscriptionsByParticipant);
// router.get("/getInscription/:id", inscriptionController.getInscriptionById);

router.put("/Inscriptions/:id", inscriptionController.updateInscription);

router.patch("/updateStatus/:id", inscriptionController.updateStatus);


module.exports = router;