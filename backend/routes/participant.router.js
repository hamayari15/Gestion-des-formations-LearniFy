const express = require("express");
const router = express.Router();

const participantController = require("../controllers/participant.controller");

const upload = require('../middlewares/upload');


router.post('/Register', upload.single('Image'), participantController.Register);

router.post("/Login", participantController.Login);

router.get("/getParticipants", participantController.getParticipants);

router.get("/getParticipant/:id", participantController.getParticipantById);

router.put("/updateParticipant/:id", participantController.updateParticipant);

router.delete("/deleteParticipant/:id", participantController.deleteParticipant);

router.post("/Participant/check-password", participantController.checkPassword);

router.put("/Participant/:id/update-password", participantController.updatePassword);


module.exports = router;