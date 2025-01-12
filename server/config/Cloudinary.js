const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function connectCloudinary(){
    try {
        
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
        console.log("cloudinary connexted");

    } catch (error) {
        console.log("error while cloudinary connection")
    }
    
}


module.exports = connectCloudinary;