const bcrypt = require("bcrypt");

require("dotenv").config();

const connectDB = require("./config/connect");

const Admin = require("./models/admin.model");

async function createAdmin() {

  try {

    await connectDB();

    const existingAdmin = await Admin.findOne({

      email: "admin@gmail.com"

    });

    if (existingAdmin) {

      console.log("Admin already exists");

      process.exit();

    }

    const hashedPassword = await bcrypt.hash(

      "admin123",

      10

    );

    await Admin.create({

      fullName: "Administrator",

      email: "admin@gmail.com",

      password: hashedPassword

    });

    console.log("Admin created successfully");

    process.exit();

  }

  catch (error) {

    console.log(error);

    process.exit(1);

  }

}

createAdmin();