import React from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry) {
      const currentTime = Date.now();

      if (currentTime > tokenExpiry) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default useAuth;
