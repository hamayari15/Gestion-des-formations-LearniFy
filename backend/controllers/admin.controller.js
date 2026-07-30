const Admin = require("../models/admin.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const LoginHistory = require("../models/loginHistory.model");
const { UAParser } = require("ua-parser-js");


// exports.Register = async (req, res) => {
//   try {
//     const data = req.body;

//     const adm = new Admin(data);

//     const salt = await bcrypt.genSalt(10);
//     const cryptedPassword = await bcrypt.hash(data.password, salt);

//     adm.password = cryptedPassword;

//     const savedAdmin = await adm.save();

//     res.status(201).json(savedAdmin);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.Login = async (req, res) => {
    console.log('LOGIN HIT', new Date().toISOString(), req.ip);

  try {
    const data = req.body;

    const adm = await Admin.findOne({ email: data.email });

    if (!adm) {
      return res.status(400).json({
        message: "Email or password invalid"
      });
    }

    const validPass = await bcrypt.compare(
      data.password,
      adm.password
    );

    if (!validPass) {
      return res.status(401).json({
        message: "Email or password invalid"
      });
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();
    const device = `${ua.browser.name || "Unknown browser"} on ${ua.os.name || "Unknown OS"}`;

    await LoginHistory.create({
      admin: adm._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      device,
    });

    const payload = {
      _id: adm._id,
      role: 'Admin'
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token, role: "Admin" });

  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong. Please try again later.'
    });
  }
};


exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid admin id" });
    }

    const adm = await Admin.findById(id).select("-password");

    if (!adm) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(adm);
  } catch (error) {
    console.error("getAdminById error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid admin id" });
    }

    const { actualPassword, newPassword } = req.body;

    if (!actualPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    if (newPassword === actualPassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
      });
    }

    const adm = await Admin.findById(id);

    if (!adm) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(actualPassword, adm.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    adm.password = await bcrypt.hash(newPassword, 10);
    await adm.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("updatePassword error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getLoginHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid admin id" });
    }

    const entries = await LoginHistory.find({ admin: id })
      .sort({ loginAt: -1 })
      .limit(10);

    res.status(200).json({ entries });
  } catch (error) {
    console.error("getLoginHistory error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
