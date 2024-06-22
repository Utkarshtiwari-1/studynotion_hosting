const User = require("../Models/User");
const Message = require("../Models/Message");


exports.Messagecreation = async(req,res)=>{
    try {
        
        const {FirstName,LastName,email,Countrycode,Phonenumber,message} = req.body;

        if(!FirstName || !LastName || !email || !Countrycode || !Phonenumber || !message)
        {
            return res.status(403).json({
                sucsess:false,
                message:"all feilds are required",
            })
        }

        const response = await Message.create({
            FirstName,
            LastName,
            email,
            Countrycode,
            Phonenumber,
            message,
        })

        return res.status(200).json({
            sucsess:true,
            message:"your request has been send"
        })

    } catch (error) {
        
    }
}