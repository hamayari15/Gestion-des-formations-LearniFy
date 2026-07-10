const express = require("express");
const router = express.Router();

const inscriptionController = require("../controllers/inscription.controller");


router.post("/addInscription/:participantId/:formationId", inscriptionController.addInscription);

router.get("/getAllInscriptions", inscriptionController.getInscriptions);

router.get("/stats/:participantId", inscriptionController.getInscriptionStatsByParticipant);

router.get("/getInscriptionsByParticipant/:participantId", inscriptionController.getInscriptionsByParticipant);

router.patch("/updateStatus/:id", inscriptionController.updateInscriptionStatus);


module.exports = router;