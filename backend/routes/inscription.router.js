const express = require("express");
const router = express.Router();

const inscriptionController = require("../controllers/inscription.controller");


router.post("/addInscription/:participantId/:formationId", inscriptionController.addInscription);

router.get("/getAllInscriptions", inscriptionController.getInscriptions);

router.get("/Inscription/stats/:participantId", inscriptionController.getInscriptionStatsByParticipant);

router.get("/Inscription/getInscriptionsByParticipant/:participantId", inscriptionController.getInscriptionsByParticipant);

router.put("/Inscriptions/:id", inscriptionController.updateInscription);


module.exports = router;