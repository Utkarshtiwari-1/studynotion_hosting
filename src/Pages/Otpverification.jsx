import { useState } from "react"
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Signupuser } from "../service/operations";

function Otpverification(){
    const[otp,setotp] = useState("");
    const {formdata} = useSelector((state)=>state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(formdata);
    const {FirstName,LastName,email,password,confirmpassword,accountType} = formdata;

    function signupclickhandler(event){
       event.preventDefault();
        dispatch(Signupuser(FirstName,LastName,email,password,confirmpassword,accountType,otp,navigate));
    }
    return(
        <div className="text-white min-h-[calc(100vh-3.5rem)] grid place-items-center">
            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify email</h1>
            <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">A verification code has been sent to you. Enter the code below</p>
            <form onSubmit={signupclickhandler}>
            <OTPInput
              value={otp}
              onChange={setotp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
            <div className="mt-6 flex items-center justify-between">
                <Link to="/login">
                    <p className="text-richblack-5 flex items-center gap-x-2">Back to login</p>
                </Link>
                <div>
                    Resend it
                </div>
            </div>
        </div>
    )
}

export default Otpverification;