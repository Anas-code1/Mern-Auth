import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContent } from "./AppContent";

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");

      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error(data.message);
      }
    } catch (error) {
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
        const isAuthenticated = Boolean(data.success);

        if (!isMounted) {
          return;
        }

        setIsLoggedIn(isAuthenticated);

        if (isAuthenticated) {
          const userResponse = await axios.get(backendUrl + "/api/user/data");

          if (!isMounted) {
            return;
          }

          if (userResponse.data.success) {
            setUserData(userResponse.data.userData);
          } else {
            setUserData(null);
            toast.error(userResponse.data.message);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setIsLoggedIn(false);
        setUserData(null);
        toast.error(error.response?.data?.message || error.message);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
