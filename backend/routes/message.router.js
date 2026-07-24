const express = require("express");
const router = express.Router();
const { createMessage, getAllMessages, updateMessageStatus, deleteMessage
} = require("../controllers/message.controller");

const { protectAdmin } = require("../middlewares/authMiddleware");

router.post("/participant/sendMessage", createMessage);


router.get("/admin/getMessages", protectAdmin, getAllMessages);

router.patch("/admin/updateStatus/:id/status", protectAdmin, updateMessageStatus);

router.delete("/admin/deleteMessage/:id", protectAdmin, deleteMessage);


module.exports = router;