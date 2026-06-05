    const express = require("express");
    const app = express();
    const cors = require('cors');
    
    require("./config/connect");

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



    app.listen(3000,()=>{
        console.log("server work on port 3000");
    });