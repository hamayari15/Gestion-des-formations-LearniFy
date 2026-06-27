    const express = require("express");
    const app = express();
    const cors = require('cors');
    require("dotenv").config();

    
    const connectDB = require("./config/connect");
    connectDB();
    
    app.use(express.json());
    app.use(cors());    
    

    const AdminRoute = require("./routes/admin.router");
    const Participant = require("./routes/participant.router");
    const Formation = require("./routes/formation.router");
    const Inscription = require("./routes/inscription.router");   
    const Dashboard = require("./routes/dashboard.router");   


    app.use('/Admin', AdminRoute);
    app.use('/Participant', Participant);
    app.use('/Formation', Formation);
    app.use('/Inscription', Inscription);
    app.use('/Dashboard', Dashboard);

    app.use('/uploads', express.static('uploads'));


    app.listen(process.env.PORT,()=>{
        console.log("Server is running on port", process.env.PORT || 3000);
    });