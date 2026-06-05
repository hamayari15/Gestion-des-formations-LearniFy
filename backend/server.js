    const express = require("express");
    const app = express();
    const cors = require('cors');
    require("dotenv").config();

    
    const connectDB = require("./config/connect");
    connectDB();
    
    app.use(express.json());
    app.use(cors());    
    

    const AdminRoute = require("./routes/Admin");
    const Participant = require("./routes/Participant");
    const Formation = require("./routes/Formation");
    const Inscription = require("./routes/Inscription");   


    app.use('/Admin', AdminRoute);
    app.use('/Participant', Participant);
    app.use('/Formation', Formation);
    app.use('/Inscription', Inscription);



    app.listen(process.env.PORT,()=>{
        console.log("Server is running on port", process.env.PORT || 3000);
    });