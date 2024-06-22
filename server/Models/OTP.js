const mongoose = require("mongoose");
const mailsender = require("../Utils/mailsender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");



const otpschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        
    },
    otp:{
        type:String,
        required:true,
       
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
});

async function sendverificationEmail(email,otp){
    try {
        
        const mailresponse = await mailsender(email,"Verification email by studynotion",otp);

        console.log("mail sended",mailresponse.response);

    } catch (error) {
        console.log("while sending mail in otp.js",error);
    }
}

otpschema.pre("save",async function(next){

    if(this.isNew){
       await sendverificationEmail(this.email,this.otp);
    }
    next();
})

module.exports = mongoose.model("OTP",otpschema);