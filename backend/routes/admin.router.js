const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");


// router.post("/Register", adminController.Register);

router.post("/Login", adminController.Login);

router.get("/getAdmin/:id", adminController.getAdminById);

router.post("/Check-Password", adminController.checkPassword);

router.put("/:id/update-password", adminController.updatePassword);


module.exports = router;