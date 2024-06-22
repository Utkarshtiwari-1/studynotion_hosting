
const jwt = require("jsonwebtoken");
require("dotenv").config();
//for authorisation

exports.auth = async(req,res,next)=>{
    try {
        
        //extract token
        console.log("token lene aaye hain",req.cookies.token);

        const token  = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token)
        {
            return res.status(400).json({
                sucsess:false,
                message:"token not found",
            });
        }

        //verify the token
        try {

            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("verified",decode);

            req.user = decode;
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                sucsess:false,
                message:"jwt not found",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            sucsess:false,
            message:"authentication failed",
        });

    }
}

//isstudent 

exports.isStudent = async(req,res,next)=>{
    try {

        if(req.user.accountType!=="Student")
        {
            return res.status(401).json({
                sucsess:false,
                message:"invalid user ,not a student",
            });
        }
        
        next();
    } catch (error) {
        
        return res.status(500).json({
            sucsess:false,
            message:"error in student",
        });
    }
}

//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try {

        if(req.user.accountType!=="Instructor")
        {
            return res.status(401).json({
                sucsess:false,
                message:"invalid user ,not a Instructor",
            });
        }
        
        next();
    } catch (error) {
        
        return res.status(500).json({
            sucsess:false,
            message:"error in Instructor",
        });
    }
}

//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try {

        if(req.user.accountType!=="Admin")
        {
            return res.status(401).json({
                sucsess:false,
                message:"invalid user ,not a Admin",
            });
        }
        
        next();
    } catch (error) {
        
        return res.status(500).json({
            sucsess:false,
            message:"error in Admin",
        });
    }
}



