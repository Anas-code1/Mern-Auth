import { useContext } from "react";
import { AppContent } from "../context/AppContent";
import { assets } from "../assets/assets"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userData, isLoggedIn } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full max-w-6xl mx-auto mt-24 lg:mt-32 px-6 lg:px-12 text-white relative z-10 gap-12">
      {/* Left Text Content */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
        {/* Greeting */}
        <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-medium mb-3 text-purple-200">
          Hey {userData ? userData.name : "there"}!
          <img
            className="w-10 aspect-square"
            src={assets.hand_wave}
            alt="wave"
          />
        </h1>

        {/* Main Heading */}
        <h2 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-white leading-[1.1]">
          Welcome to <br className="hidden lg:block" /> the future.
        </h2>

        {/* Description */}
        <p className="mb-10 max-w-lg text-lg text-purple-200/80 leading-relaxed">
          Let's start with a quick product tour and we will have you up and
          running in no time. Experience next-gen authentication.
        </p>

        {/* Button */}
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            className="glass-panel px-10 py-4 text-white bg-white/5 hover:bg-white/10 transition-all rounded-full font-bold text-lg shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-purple-500/50 hover:scale-[1.02] cursor-pointer"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Right Graphic */}
      <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0 relative w-full max-w-md lg:max-w-none">
        <div className="relative w-72 sm:w-96 aspect-square rounded-full flex items-center justify-center animate-[pulse_6s_ease-in-out_infinite]">
          <img
            src={assets.header_abstract}
            alt="header graphic"
            className="w-full h-full object-cover rounded-[3rem] shadow-[0_0_80px_rgba(167,139,250,0.4)] border border-purple-400/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
