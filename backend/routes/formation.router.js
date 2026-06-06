const express = require("express");
const router = express.Router();

const formationController = require("../controllers/formation.controller");


router.post("/Add", formationController.addFormation);

router.get("/getAll", formationController.getAllFormations);

router.get("/getFormation/:id", formationController.getFormationById);

router.get("/getMyFormations/:participantId", formationController.getMyFormations);

router.put("/Update/:id", formationController.updateFormation);

router.delete("/Delete/:id", formationController.deleteFormation);

router.patch("/updateStatus/:id", formationController.updateStatus);


module.exports = router;