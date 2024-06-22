const User = require("../Models/User");
const mailsender = require("../Utils/mailsender");
const bcrypt = require("bcrypt");
const Crypto  = require("crypto");

exports.resetpasswordToken = async(req,res)=>{
   
    try {

        const {email} = req.body;
        console.log(email);
        const user = await User.findOne({email:email});
    
        if(!user)
        {
            return res.status(401).json({
                sucsess:false,
                message:"user not exist",
            });
        }
        else
        {
            console.log("user",user);
        }
    
        //generate token 
        const token = Crypto.randomUUID();
    
        const updateddetails = await User.findOneAndUpdate({_id:user._id},{token:token,
            resetpasswordexpires:Date.now()+5*60*1000,
        },{new:true});

        console.log(updateddetails);
    
        const url = `https://localhost:3000/update-password/${token}`;
    
        await mailsender(email,"password reset link",`password reset link ${url}`);
    
        return res.status(200).json({
            sucsess:true,
            message:"email sent sucsessfully",
        });
        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            sucsess:false,
            message:"issue with sending mail of reset link",
        });
    }

}


exports.resetpassword = async(req,res)=>{
    
    try {

        const {password,confirmpassword,token} = req.body;

        if(password!==confirmpassword)
            {
                 return res.status(401).json({
                        sucsees:false,
                        message:"password does not match",
                    })
            }

        const userDetails = await User.findOne({token:token});

        if(!userDetails)
        {
                return res.status(401).json({
                    sucsees:false,
                    message:"user not found",
                })
        }

        // if(userDetails.resetpasswordexpires<Date.now())
        // {
        //     return res.status(401).json({
        //         sucsees:false,
        //         message:"token expired",
        //     })
        // }

        const hashedpassword = await bcrypt.hash(password,10);
        const resposnse = await User.findOneAndUpdate({token:token},{password:hashedpassword},{new:true});
        
        return res.status(200).json({
            sucsees:true,
            message:"password updated sucsessfully",
        });
    } catch (error) {
        return res.status(500).json({
            sucsees:false,
            message:"issue with password change ",
        })
    }
}