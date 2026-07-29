const express = require("express");
const router = express.Router();
const { createMessage, getAllMessages, updateMessageStatus, deleteMessage
} = require("../controllers/message.controller");

router.post("/participant/sendMessage", createMessage);


router.get("/admin/getMessages", getAllMessages);

router.patch("/admin/updateStatus/:id/status", updateMessageStatus);

router.delete("/admin/deleteMessage/:id", deleteMessage);


module.exports = router;