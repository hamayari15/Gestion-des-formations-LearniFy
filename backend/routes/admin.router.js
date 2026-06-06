const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");


router.post("/Register", adminController.register);

router.post("/Login", adminController.login);

router.get("/getAdmin/:id", adminController.getAdminById);

router.post("/Admin/Check-Password", adminController.checkPassword);

router.put("/Admin/:id/update-password", adminController.updatePassword);


module.exports = router;