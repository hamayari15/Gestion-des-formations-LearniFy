const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");


// router.post("/Register", adminController.Register);

router.post("/Login", adminController.Login);

router.get("/getAdmin/:id", adminController.getAdminById);

router.put("/:id/update-password", adminController.updatePassword);

router.get("/:id/login-history", adminController.getLoginHistory);


module.exports = router;