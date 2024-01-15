// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const signIn = async (username, password) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post("http://localhost:5000/login", {
//         username,
//         password,
//       });
//       localStorage.setItem("token", response.data.token);
//       setIsAuthenticated(true);
//       navigate("/dashboard"); // Navigate to dashboard
//     } catch (error) {
//       setError(
//         "There has been a problem with your fetch operation: " + error.message
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signUp = async (username, password) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post("http://localhost:5000/signup", {
//         username,
//         password,
//       });
//       localStorage.setItem("token", response.data.token);
//       setIsAuthenticated(true);
//     } catch (error) {
//       setError(
//         "There has been a problem with your fetch operation: " + error.message
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signOut = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//   };

//   const checkAuth = () => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return { isAuthenticated, isLoading, error, signIn, signUp, signOut };
// };

// export default useAuth;

import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a context for the auth state
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signIn = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/dashboard"); // Navigate to dashboard
    } catch (error) {
      setError(
        "There has been a problem with your fetch operation: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setError(
        "There has been a problem with your fetch operation: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
