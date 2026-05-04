import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContent";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
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

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp", {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((input) => input.value);
    const nextOtp = otpArray.join("");

    if (nextOtp.length !== 6) {
      return toast.error("Please enter the 6-digit OTP");
    }

    setOtp(nextOtp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

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
           <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Regain access.</h2>
           <p className="text-purple-200/80 text-lg">Follow the simple steps to reset your password and get back to your account.</p>
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

        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="glass-panel p-10 rounded-3xl w-full max-w-md text-sm z-10 relative shadow-2xl"
          >
            <h1 className="text-white text-3xl font-bold text-center mb-4 tracking-tight">
              Reset Password
            </h1>
            <p className="text-center mb-8 text-purple-200/80">
              Enter your registered email address
            </p>
            <div className="glass-input mb-5 flex items-center gap-3 w-full px-5 py-3.5 rounded-full">
              <img src={assets.mail_icon} alt="mail" className="w-5 opacity-70" />
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent outline-none text-white w-full placeholder:text-purple-200/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold mt-3 shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all cursor-pointer">
              Send OTP
            </button>
          </form>
        )}

        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOtp}
            className="glass-panel p-10 rounded-3xl w-full max-w-md text-sm z-10 relative shadow-2xl"
          >
            <h1 className="text-white text-3xl font-bold text-center mb-4 tracking-tight">
              Verify OTP
            </h1>
            <p className="text-center mb-8 text-purple-200/80">
              Enter the 6-digit code sent to your email id.
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

            <button type="submit" className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold mt-3 shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all cursor-pointer">
              Verify OTP
            </button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="glass-panel p-10 rounded-3xl w-full max-w-md text-sm z-10 relative shadow-2xl"
          >
            <h1 className="text-white text-3xl font-bold text-center mb-4 tracking-tight">
              New Password
            </h1>
            <p className="text-center mb-8 text-purple-200/80">
              Enter the new password below
            </p>
            <div className="glass-input mb-5 flex items-center gap-3 w-full px-5 py-3.5 rounded-full">
              <img src={assets.lock_icon} alt="lock" className="w-5 opacity-70" />
              <input
                type="password"
                placeholder="New Password"
                className="bg-transparent outline-none text-white w-full placeholder:text-purple-200/50"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold mt-3 shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all cursor-pointer">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
