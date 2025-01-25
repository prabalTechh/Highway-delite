import { useEffect, useState } from "react";
import bgImg from "../assets/bg.png";
import logoImg from "../assets/icon.png";
import googleSvg from "../assets/plus.svg";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Loader Component
const Loader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-transparent border-blue-500"></div>
      <div className="absolute inset-1 animate-ping rounded-full bg-blue-400 opacity-75"></div>
    </div>
  </div>
);

interface FormDataProp {
  email: string;
  password: string;
}

const BASE_URL = "https://highway-delite-ue66.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataProp>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loader state

  useEffect(() => {
    const sendSignupRequest = async () => {
      if (!isSubmitting) return;

      setIsLoading(true); // Show loader
      try {
        const response = await axios.post(
          `${BASE_URL}/api/user/signin`,
          formData
        );
        if(response.status === 200) {
          const data = response.data as { token: string };
          localStorage.setItem("token", data.token);
        }
        console.log(response.data);
        setIsSubmitting(false);
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      } finally {
        setIsLoading(false); // Hide loader
      }
    };

    sendSignupRequest();
  }, [isSubmitting, formData, navigate]);

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  return (
    <div className="flex w-screen h-screen">
      {isLoading && <Loader />} {/* Display loader conditionally */}
      <div className="hidden md:block w-2/3 h-full p-2">
        <img
          src={bgImg}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex w-full md:w-1/3 h-full flex-col">
        <div className="flex gap-2 p-5">
          <img src={logoImg} alt="icon" />
          <h1>HD</h1>
        </div>
        <div className="w-full max-w-md mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Sign in</h1>
            <p className="text-sm text-gray-500">
              Please Login to Continue Your account
            </p>
          </div>

          <div className="space-y-4">
            <Input
              title="Email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            <Input
              title="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />

            <button
              onClick={handleSignUp}
              className="w-full py-2 bg-[#367AFF] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button className="w-full py-2 border border-gray-300 font-semibold rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
              <span>Continue with Google</span>
              <img src={googleSvg} alt="Google logo" className="w-5 h-5" />
            </button>

            <div className="text-gray-400 flex items-center justify-center gap-2">
              Need an account?
              <span className="text-blue-400 underline">
                <Link to="/signup">Create one</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
