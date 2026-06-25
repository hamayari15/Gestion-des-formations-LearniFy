const express = require("express");
const router = express.Router();

const participantController = require("../controllers/participant.controller");

const upload = require('../middlewares/upload');


router.post('/Register', upload.single('image'), participantController.Register);

router.post('/checkEmail', participantController.checkEmail);

router.post("/Login", participantController.Login);

router.get("/getParticipants", participantController.getParticipants);

router.get("/getParticipantsGrowth", participantController.getParticipantsGrowth);

router.get("/getParticipant/:id", participantController.getParticipantById);

router.put("/updateParticipant/:id", participantController.updateParticipant);

router.delete("/deleteParticipant/:id", participantController.deleteParticipant);

router.post("/check-password", participantController.checkPassword);

router.put("/:id/update-password", participantController.updatePassword);


module.exports = router;