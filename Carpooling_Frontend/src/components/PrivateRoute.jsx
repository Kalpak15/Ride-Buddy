import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth); // Assumes you are storing the token in the Redux auth state

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
