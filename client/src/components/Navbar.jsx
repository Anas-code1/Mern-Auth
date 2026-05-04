import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

    const sendVerificationOtp = async()=>{
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        } else{
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }


    const logout = async () =>{
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/logout')

        if (data.success) {
          setIsLoggedIn(false)
          setUserData(null)
          navigate('/login')
        } else {
          toast.error(data.message)
        }
      
        
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);  
      }
    }
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      <img src={assets.logo} alt="" className="w-44 sm:w-52 cursor-pointer" onClick={() => navigate('/')} />
      {userData ? (
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative group cursor-pointer shadow-[0_0_15px_rgba(167,139,250,0.5)] border border-purple-300/30">
          <span className="font-semibold text-lg">{userData.name[0].toUpperCase()}</span>
          <div className="absolute hidden group-hover:block top-full right-0 z-10 pt-2">
            <ul className="list-none m-0 p-2 glass-panel rounded-xl text-sm min-w-[150px] shadow-2xl">
              {!userData.isAccountVerified && (
                <li onMouseDown={(e) => { e.preventDefault(); sendVerificationOtp(); }} className="py-2 px-3 text-purple-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded-md mb-1">
                  Verify Email
                </li>
              )}
              <li onMouseDown={(e) => { e.preventDefault(); logout(); }} className="py-2 px-3 text-purple-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded-md">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 glass-panel rounded-full px-6 py-2 text-purple-100 hover:text-white hover:bg-white/10 transition-all shadow-lg hover:shadow-purple-500/20 cursor-pointer"
        >
          Login
          <img src={assets.arrow_icon} alt="" className="w-4 invert opacity-80" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
