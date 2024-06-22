const nodemailer = require("nodemailer");


const mailsender = async(email,title,body)=>{
    try {

        //transpoter
        let transpoter = nodemailer.createTransport({
            //host:smtp.gmail.com,
            service:"Gmail",
            auth:{
                user:"tiwariutkarsh571@gmail.com",
                pass:"knivpgklwkuysrqf",
            }
        });

        let info = await transpoter.sendMail({
            from:`study notion`,
            to:`${email}`,
            subject:`${title}`,
            text:`${body}`,
           

        })
        
        return info;
    } catch (error) {
        console.log("while sending mail in utils",error);
    }
}

module.exports = mailsender;