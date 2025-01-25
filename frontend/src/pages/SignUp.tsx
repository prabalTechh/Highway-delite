import React, { useState, useEffect } from "react";
import axios from "axios";
import icon from "../assets/icon.png";
import bgImg from "../assets/bg.png";
import Input from "../components/Input";
// import googlesvg from "../assets/plus.svg";
import {  useNavigate } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sendSignupRequest = async () => {
      if (!isSubmitting) return;

      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    sendSignupRequest();
  }, [isSubmitting, formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  const handleOTPVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/api/user/verify-otp`, {
        email: formData.email,
        otp: otp,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      // Handle OTP verification error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col h-full max-w-screen-xl mx-auto py-4">
        <div className="flex gap-2 px-4 sm:px-5 pb-2">
          <img src={icon} alt="icon" />
          <h1>HD</h1>
        </div>
        <div className="flex h-full w-full md:px-8">
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
                  <button 
                    disabled={isLoading} 
                    className={`text-center py-2 rounded-lg max-w-sm text-white font-semibold ${
                      isLoading 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-[#367AFF] hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg 
                          className="animate-spin h-5 w-5 mr-3" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing up...
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                  {/* Rest of the code remains the same */}
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
                  <button 
                    type="submit"
                    disabled={isLoading} 
                    onClick={handleOTPVerification}
                    className={`text-center py-2 rounded-lg max-w-sm text-white font-semibold ${
                      isLoading 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-[#367AFF] hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg 
                          className="animate-spin h-5 w-5 mr-3" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying OTP...
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
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