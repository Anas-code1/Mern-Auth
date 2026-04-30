import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } =
    React.useContext(AppContent);

  const [state, setState] = React.useState("Sign Up");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          toast.success("Successfully signed up!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          toast.success("Successfully logged in!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
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
           <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to the future.</h2>
           <p className="text-purple-200/80 text-lg">Experience a seamless and highly secure authentication flow with our modern interface.</p>
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

        <div className="glass-panel p-10 rounded-3xl w-full max-w-md text-purple-100 text-sm z-10 relative shadow-2xl">
          {/* Heading */}
          <h2 className="text-4xl font-bold mb-3 text-white text-center tracking-tight">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-center text-sm mb-8 text-purple-200/80">
            {state === "Sign Up"
              ? "Join us today to get started"
              : "Please login to your account"}
          </p>

          {/* Form */}
          <form onSubmit={onSubmitHandler}>
            {state === "Sign Up" && (
              <div className="glass-input mb-5 flex items-center gap-3 w-full px-5 py-3.5 rounded-full">
                <img src={assets.person_icon} alt="person" className="w-5 opacity-70" />
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  placeholder="Full Name"
                  className="outline-none bg-transparent text-white w-full placeholder:text-purple-200/50"
                />
              </div>
            )}

            {/* Input Field */}
            <div className="glass-input mb-5 flex items-center gap-3 w-full px-5 py-3.5 rounded-full">
              <img src={assets.mail_icon} alt="mail" className="w-5 opacity-70" />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Email Address"
                className="outline-none bg-transparent text-white w-full placeholder:text-purple-200/50"
              />
            </div>
            
            <div className="glass-input mb-6 flex items-center gap-3 w-full px-5 py-3.5 rounded-full">
              <img src={assets.lock_icon} alt="lock" className="w-5 opacity-70" />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                placeholder="Password"
                className="outline-none bg-transparent text-white w-full placeholder:text-purple-200/50"
              />
            </div>

            <button  className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base mb-5 shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all cursor-pointer">
              {state === "Sign Up" ? "Sign Up Now" : "Login"}
            </button>
            
            {state === "Sign Up" ? null : (
              <p
                onClick={() => navigate("/reset-password")}
                className="mb-4 text-purple-300 hover:text-white cursor-pointer transition-colors text-center font-medium"
              >
                Forgot password?
              </p>
            )}
          </form>
          
          {state === "Sign Up" ? (
            <p className="text-purple-200/80 text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                className="text-white cursor-pointer font-semibold hover:underline"
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-purple-200/80 text-center text-sm mt-4">
              Don't have an account?{" "}
              <span
                className="text-white cursor-pointer font-semibold hover:underline"
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
