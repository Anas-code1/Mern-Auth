import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContent";

function EmailVerify() {
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otpArray = inputRefs.current.map((input) => input.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, userData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-nebula relative overflow-hidden">
      {/* Left Column - Visuals (Desktop Only) */}
      <div className="hidden lg:flex flex-col items-center justify-center relative bg-black/20 backdrop-blur-sm border-r border-white/10 p-10">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="absolute left-10 top-10 w-36 cursor-pointer z-20"
        />
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-8">
           <img 
             src={assets.auth_hero} 
             alt="Abstract 3D Shape" 
             className="w-full h-full object-cover rounded-3xl shadow-[0_0_50px_rgba(167,139,250,0.3)] hover:scale-105 transition-transform duration-700" 
           />
        </div>
        <div className="text-center relative z-20 max-w-md">
           <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Secure your account.</h2>
           <p className="text-purple-200/80 text-lg">Verify your email address to unlock full access to our platform.</p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 w-full">
        {/* Mobile Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="lg:hidden absolute left-6 sm:left-12 top-6 w-28 cursor-pointer z-20"
        />
        <form
          onSubmit={onSubmitHandler}
          className="glass-panel p-10 rounded-3xl w-full max-w-md text-sm z-10 relative shadow-2xl"
        >
          <h1 className="text-white text-4xl font-bold text-center mb-4 tracking-tight">
            Verify Email
          </h1>
          <p className="text-center mb-8 text-purple-200/80 text-base">
            Enter the 6-digit code sent to your email address.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-14 glass-input text-white text-center text-2xl font-bold rounded-xl focus:ring-2 focus:ring-purple-400/50"
                  ref={(element) => (inputRefs.current[index] = element)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all cursor-pointer">
            Verify Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailVerify;
