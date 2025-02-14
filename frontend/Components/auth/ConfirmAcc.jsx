import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ConfirmAccount() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      verifyAccount(token);
    } else {
      setMessage("Invalid or missing token.");
      setLoading(false);
    }
  }, [location]);

  const verifyAccount = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:9192/auth/confirm-account?token=${token}`
      );
      setMessage("Registration successful! Your account has been verified.");
    } catch (error) {
      setMessage(
        "Failed to verify account. Please try again or contact support."
      );
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  return <div>{message}</div>;
}

export default ConfirmAccount;
