import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Verifyemail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

 const verifying = async () => {
  try {
    const res = await axios.post(`http://localhost:3000/api/auth/verify/${token}`,{},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    console.log(res);

    if (res.status === 200) {
      setStatus("✅ Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

  } catch (error) {
    setStatus(
      error.response?.data?.message ||
      "❌ Verification failed. Please try again."
    );
  }
};

  useEffect(() => {
    if (token) {
      verifying();
    }
  }, [token]);

  return (
    <div className="w-full min-h-screen bg-pink-200 flex justify-center items-center">
      <div className="w-[500px] h-[200px] bg-white rounded-lg flex justify-center items-center">
        <p className="text-2xl font-semibold">{status}</p>
      </div>
    </div>
  );
}

export default Verifyemail;