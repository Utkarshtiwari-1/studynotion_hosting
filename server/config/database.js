const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("db connected successfully");
    })
    .catch((error)=>{
        console.log(error);
        console.log("issue with database connection");
        process.exit(1);
    })
}

module.exports = dbconnect;