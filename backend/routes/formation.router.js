const express = require("express");
const router = express.Router();

const formationController = require("../controllers/formation.controller");


router.post("/Add", formationController.addFormation);

router.get("/getAll", formationController.getAllFormations);

router.put("/Update/:id", formationController.updateFormation);

router.delete("/Delete/:id", formationController.deleteFormation);


module.exports = router;