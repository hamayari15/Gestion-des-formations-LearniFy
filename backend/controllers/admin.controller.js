const Admin = require("../models/admin.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.Register = async (req, res) => {
  try {
    const data = req.body;

    const adm = new Admin(data);

    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(data.password, salt);

    adm.password = cryptedPassword;

    const savedAdmin = await adm.save();

    res.status(201).json(savedAdmin);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.Login = async (req, res) => {
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
    res.status(500).json({
      message: err.message
    });
  }
};


exports.getAdminById = async (req, res) => {
  try {
    const adm = await Admin.findById(req.params.id);

    if (!adm) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    res.status(200).json(adm);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.checkPassword = async (req, res) => {
  try {
    const { adminId, actualPassword } = req.body;

    const adm = await Admin.findById(adminId);

    if (!adm) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(
      actualPassword,
      adm.password
    );

    res.status(200).json(isMatch);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const adminId = req.params.id;

    const {
      actualPassword,
      newPassword
    } = req.body;

    const adm = await Admin.findById(adminId);

    if (!adm) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(
      actualPassword,
      adm.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect"
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    adm.password = hashedPassword;

    await adm.save();

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};