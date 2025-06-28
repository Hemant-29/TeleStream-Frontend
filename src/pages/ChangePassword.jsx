import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { loginContext, urlContext, userContext } from "../context/context";

const ChangePassword = () => {
  const baseUrl = useContext(urlContext);
  const loggedinState = useContext(loginContext);
  const { userDetails } = useContext(userContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  // ________________________________Functions________________________________
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage({ type: "error", text: "Please fill both fields." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({});

      const res = await axios.put(
        `${baseUrl}/api/v1/user/changePassword`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      setMessage({ type: "success", text: res.data.msg });
      setOldPassword("");
      setNewPassword("");

      // Optional: Redirect to account after success
      setTimeout(() => navigate("/account"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // _______________________________Use Effect Hooks_______________________________
  useEffect(() => {
    // if (!loggedinState) {
    //   navigate("/login");
    // }
  }, [loggedinState]);

  // ____________________________________JSX_____________________________________
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="py-5 px-2 sm:px-5 w-full">
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
            </div>
          )}

          <div className="max-w-xl mx-auto mt-10 flex flex-col gap-5">
            <p className="text-xl font-bold">Change Your Password</p>

            <input
              type="password"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="account-valuefield"
            />

            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="account-valuefield"
            />

            <button
              onClick={handleChangePassword}
              className="mt-3 px-6 py-2 w-2xs bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition"
            >
              Submit
            </button>

            {message.text && (
              <div
                className={`mt-3 text-sm p-2 rounded-xl ${
                  message.type === "error"
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
