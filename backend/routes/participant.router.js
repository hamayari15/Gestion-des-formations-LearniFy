const express = require("express");
const router = express.Router();

const participantController = require("../controllers/participant.controller");

const upload = require('../middlewares/upload');


router.post('/Register', upload.single('image'), participantController.Register);

router.post('/checkEmail', participantController.checkEmail);

router.post("/Login", participantController.Login);

router.get("/getParticipants", participantController.getParticipants);

router.get("/getParticipantsGrowth", participantController.getParticipantsGrowth);

router.get("/stats/active-inactive", participantController.getActiveInactiveStats);

router.get("/getParticipant/:id", participantController.getParticipantById);

router.put("/updateParticipant/:id", participantController.updateParticipant);

router.put("/:id/update-password", adminController.updatePassword);

router.delete("/deleteParticipant/:id", participantController.deleteParticipant);


module.exports = router;