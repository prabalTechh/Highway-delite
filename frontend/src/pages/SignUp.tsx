import React, { useState, useEffect } from "react";
import axios from "axios";
import icon from "../assets/icon.png";
import bgImg from "../assets/bg.png";
import Input from "../components/Input";
import googlesvg from "../assets/plus.svg";
import { Link, useNavigate } from "react-router-dom";

interface FormDataProp {
  name: string;
  email: string;
  dob: string;
  password: string;
}

const BASE_URL = "http://localhost:4000";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormDataProp>({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOTP] = useState("");

  useEffect(() => {
    const sendSignupRequest = async () => {
      if (!isSubmitting) return;

      try {
        const response = await axios.post(
          `${BASE_URL}/api/user/signup`,
          formData
        );
        console.log(response.data);
        setShowOTPVerification(true);
        setIsSubmitting(false);
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      }
    };

    sendSignupRequest();
  }, [isSubmitting, formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  const handleOTPVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/user/verify-otp`, {
        email: formData.email,
        otp: otp,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      // Handle OTP verification error
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col h-full max-w-screen-xl mx-auto py-4">
        <div className="flex gap-2 px-4 sm:px-5 pb-2">
          <img src={icon} alt="icon" />
          <h1>HD</h1>
        </div>
        <div className="flex h-full w-full px-8">
          <div className="h-full w-full lg:w-1/2">
            <div className="max-w-screen-sm h-full mx-auto flex flex-col justify-center gap-4 px-8 py-8">
              {!showOTPVerification ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div>
                    <h1 className="text-3xl font-bold">Sign up</h1>
                    <p className="text-sm text-gray-400">
                      Sign up to enjoy the feature of HD
                    </p>
                  </div>
                  <Input
                    title="Your name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    title="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    title="Date of birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                  <Input
                    title="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <div className=" text-center py-2 rounded-lg hover:bg-blue-700 bg-[#367AFF] text-white font-semibold max-w-sm">
                    <button className="">Sign Up</button>
                  </div>
                  <div className="flex max-w-sm text-gray-400 items-center gap-1 py-2">
                    <hr className="w-full border-gray-400" />
                    or
                    <hr className="w-full border-gray-400" />
                  </div>
                  <div className="border border-gray-300 text-center py-2 rounded-lg  font-semibold max-w-sm">
                    <button className="flex w-full items-center justify-center">
                      Continue with Google{" "}
                      <span>
                        <img src={googlesvg} alt="svg" />
                      </span>
                    </button>
                 
                  </div>
                  <div className="flex max-w-sm text-gray-400  items-center justify-center">
                      already have an account?
                      <span className="text-blue-400 underline">
                        <Link to="/login">Log In</Link>
                      </span>
                    </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <h1 className="text-3xl font-bold">Verify OTP</h1>
                    <p className="text-sm text-gray-400">
                      Enter the OTP sent to {formData.email}
                    </p>
                  </div>
                  <Input
                    title="OTP"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <div className=" text-center py-2 rounded-lg hover:bg-blue-700 bg-[#367AFF] text-white font-semibold max-w-sm">
                    <form onSubmit={handleOTPVerification}>
                      <button type="submit">Verify OTP</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2 px-10">
            <img
              src={bgImg}
              alt="bg-image"
              className="h-full mx-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
