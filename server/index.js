const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
require("dotenv").config();

app.use(express.json());
app.use(cookieparser());




app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));

app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp",
}));

const dbconnect = require("./config/database");
dbconnect();

const connectCloudinary = require("./config/Cloudinary");
connectCloudinary();


const PORT = process.env.PORT || 4000;


const courserouter = require("./routes/Course");
const  paymentrouter = require("./routes/Payment");
const profilerouter = require("./routes/Profile");
const userrouter = require("./routes/User");

app.use("/api/v1/courses",courserouter);
app.use("/api/v1/payments",paymentrouter);
app.use("/api/v1/profile",profilerouter);
app.use("/api/v1/user",userrouter);

app.get("/",(req,res)=>{
    res.status(200).json({
        sucsess:true,
        message:"app listning",
    })
})

app.listen(PORT,()=>{
    console.log(`app is listning on port ${PORT}`);
})






