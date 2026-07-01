const express = require("express");
const router = express.Router();

const inscriptionController = require("../controllers/inscription.controller");


router.post("/addInscription/:participantId/:formationId", inscriptionController.addInscription);

router.get("/getInscriptions", inscriptionController.getInscriptions);

// router.get("/getInscription/:id", inscriptionController.getInscriptionById);

router.put("/Inscriptions/:id", inscriptionController.updateInscription);

router.patch("/updateStatus/:id", inscriptionController.updateStatus);


module.exports = router;