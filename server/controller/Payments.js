
const {instance} = require("../config/razorpay");
const Course = require("../Models/Course");
const User = require("../Models/User");
const mailsender = require("../Utils/mailsender");
const mongoose = require("mongoose");
const {couseEnrollmentEmail} = require("../mail/templates/CourseEnrollmentEmail");

const crypto = require("crypto");
const CourseProgress = require("../Models/CourseProgress");





exports.capturePayment = async(req,res)=>{

    const {courses} = req.body;
    const userid = req.user.id;

    if(courses.length===0)
    {
        return res.status(400).json(
            {
                succsess:false,
                message:"No courses found",
            }
        )
    }

    let totalamount = 0;

    for(const courseid of courses)
    {
        let course;
        try {

            course  = await Course.findById(courseid);
            if(!course)
            {
                return res.status(401).json({
                    succsess:false,
                    message:"Course not fetched sucsessfully from db"
                })
            }

            const uid = new mongoose.Types.ObjectId(userid);


            //user already enrolled or not
            if(course.studentEnrolled.includes(uid))
            {
                return res.status(402).json({
                    succsess:false,
                    message:"user already enrolled"
                })
            }

            totalamount += course.Price;

            
        } catch (error) {
            
            console.log("Error in for loop ",error);
            return res.status(500).json({
                succsess:false,
                message:"Failed to fetch course"
            })
        }
    }

    //create options 

    const options = {
        amount:totalamount*100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()
    }

    //create order
    try {

        const paymentresponse = await instance.orders.create(options);

       return  res.status(200).json({
            succsess:true,
            message:paymentresponse,
        })

        
    } catch (error) {
        console.log("error in order creation",error);
        return res.status(500).json({
            succsess:false,
            message:"error in order creation"
        })
    }



}   


//verify payment

exports.verifySignature = async(req,res)=>{
    const razorpay_order_id  = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;

    const courses = req.body.courses;
    console.log(courses);
    const userid  = req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    {
        return res.status(404).json({
            succsess:false,
            message:"Razorpay values missing"
        })
    }

    let body = razorpay_order_id+"|"+razorpay_payment_id;
    const expectedsignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    if(expectedsignature===razorpay_signature)
    {
        //enroll student
        await enrollstudent(courses,userid,res);
        return res.status(200).json({succsess:true, message:"Payment Verified"});
    }
    else
    {
        return res.status(400).json({
            succsess:false,
            message:" failed Payment signatrue verified",
        })
    }

 }

 const enrollstudent = async(courses,userid,res)=>{
    if(courses.length===0 || !userid)
    {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseid of courses)
    {
        try {
            
            const enrolledcourse  = await Course.findByIdAndUpdate(courseid,{
                $push:{studentEnrolled:userid},
            },{new:true});
    
            if(!enrolledcourse)
            {
                return res.status.json({
                    succsess:false,
                    message:"enrolled course failed",
                })
            }
    
            const enrolledstudnet = await User.findByIdAndUpdate(userid,{
                $push:{courses:courseid},
            },{new:true});
    
            if(!enrolledstudnet)
            {
                return res.status.json({
                    succsess:false,
                    message:"enrolled studnet failed",
                })
            }
    
            const mailresponse = await mailsender(enrolledstudnet.email,"sucsessfully buied the course",`course name:
                ${enrolledcourse.courseName}`);
    
            console.log("mail response",mailresponse);

            const createprogress = await CourseProgress.create({courseid:courseid,userid:userid});

        } catch (error) {
            console.log(error);
            return res.status.json({
                succsess:false,
                message:"enrolledment failed",
            })
        }
        


    }
 }


//capture the payment and create the order for the razorpay

// exports.capturePayment = async(req,res)=>{

//     const {courseid} = req.body;
//     const userid = req.user.id;

//     if(!courseid)
//     {
//         return res.status(401).json({
//             sucsess:false,
//             message:"course id not found",
//         })
//     }

//     let course;
//     try {
        
//         course = await Course.findById({courseid});
//         if(!course)
//         {
//             return res.status(401).json({
//                 sucsess:false,
//                 message:"course  not found",
//             })
//         }

//         //check user already buied the course or not

//         const uid = new mongoose.Schema.Types.ObjectId(userid);
        
//         if(course.studentEnrolled.includes(uid))
//         {
//             return res.status(401).json({
//                 sucsess:false,
//                 message:"user already buied this course",
//             })
//         }



//     } catch (error) {
//          return res.status(500).json({
//                 sucsess:false,
//                 message:"issue with course fetching",
//             })
//     }

//     //create order

//     const amount = course.Price;
//     const currency = 'INR';

//     const options = {
//         amount:amount*100,
//         currency:currency,
//         recipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseid:courseid,
//             userid,
//         },

//     }

//     try {
        
//         const paymentresponse = await instance.orders.create(options);

//         console.log(paymentresponse);

//         return res.status(200).json({
//             sucsess:true,
//             courseName:course.courseName,
//             coursedescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderid:paymentresponse.id,
//             currency:paymentresponse.currency,
//             amount:paymentresponse.amount,
//         });

//     } catch (error) {
        
//         return res.status(500).json({
//             sucsess:false,
//             message:"error while order creation",
//         })
//     }

// }

// //verify signature

// exports.verifySignature = async(req,res)=>{

//     let webhooksecert = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhooksecert);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature===digest)
//     {
//         //payment authorised 
//         //signature matched
//         //user and course ko update karna hai
//         const {courseid,userid} = req.body.payload.payment.entity.notes;

//         try {
            
//             //find the course and update the enroll list 
//             const enrolledcourse = await Course.findOneAndUpdate({_id:courseid},
//                 {
//                     $push:{studentEnrolled:userid},
//                 },
//                 {new:true}
//             );

//             //find the student and update his course list

//             const enrolledstudent = await User.findOneAndReplace({_id:userid},
//                 {
//                     $push:{courses:courseid}
//                 },
//                 {new:true}
//             );

//             console.log(enrolledcourse);
//             console.log(enrolledstudent);

//             //mail send to student

//             const mailresponse = await mailsender(enrolledstudent.email,
//                 "welcome to the world of studynotion",
//                 "dfnk",
//             );

//             console.log(mailresponse);

//             return res.status(200).json({
//                 sucsess:true,
//                 message:"signatue verified sucsessfully and course added to student",
//             })

//         } catch (error) {
//             return res.status(500).json({
//                 sucsess:false,
//                 message:"error while user or course fetching",
//             })
//         }
//     }
//     else
//     {
//         return res.status(400).json({
//             sucsess:false,
//             message:"invalid signature",
//         })
//     }
// }

