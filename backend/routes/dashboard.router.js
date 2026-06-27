const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");


router.get("/inscriptions-per-theme", dashboardController.getInscriptionsPerTheme);

router.get("/formation-mode", dashboardController.getFormationModeDistribution);

router.get("/inscriptions-over-time", dashboardController.getInscriptionsOverTime);


module.exports = router;