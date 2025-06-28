import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext, urlContext, userContext } from "../context/context";
import axios from "axios";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import editIcon from "../assets/edit.svg";

const Account = () => {
  const baseUrl = useContext(urlContext);

  // State Variables
  const [isLoading, setIsLoading] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeChannel, setChangeChannel] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [changeDetails, setChangeDetails] = useState({});

  // Use Navigate Hook
  const navigate = useNavigate();

  // Use Context Hook
  const loggedinState = useContext(loginContext);
  const { userDetails, refreshUser } = useContext(userContext);

  // ________________________________Functions________________________________

  // Check proper email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Submit Function
  const handleSubmit = async () => {
    // Email format check
    if (changeDetails.email && !isValidEmail(changeDetails.email)) {
      setSubmitMessage("Please provide a valid email address");
      return;
    }

    // Check for value changes
    if (
      !changeDetails.username &&
      !changeDetails.channel &&
      !changeDetails.email
    )
      return;

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/update`,
        { ...changeDetails },
        { withCredentials: true }
      );
      console.log("Update successful:", response.data);
      setSubmitMessage(response.data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error);
      setSubmitMessage(error.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
    console.log("Calling api with data:", changeDetails);
  };

  // _______________________________Use Effect Hooks_______________________________
  useEffect(() => {
    console.log("user details:", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log("change details:", changeDetails);
  }, [changeDetails]);

  // ____________________________________JSX_____________________________________
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div id="Accoount" className="py-5 px-2 sm:px-5 w-full">
          {loggedinState == false && (
            <div className="flex flex-col items-center w-full p-5 text-lg">
              <p>Login to see your Account Details</p>

              <Link
                to="/login"
                className="px-4 py-2 m-4 bg-neutral-600 rounded-2xl"
              >
                Go to Login
              </Link>
            </div>
          )}
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
            </div>
          )}
          <p className="text-xl font-bold">Your Account Details</p>
          {userDetails && (
            <div className="flex flex-col gap-15 sm:px-5 py-10 w-fit">
              {/* Change Channel name */}
              <div className="relative flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="account-channel">Channel Name:</label>
                {!changeChannel && (
                  <span id="account-channel" className="account-valuefield">
                    {userDetails.channel}
                  </span>
                )}
                {!changeChannel && (
                  <button
                    onClick={() => {
                      setChangeChannel(true);
                      setChangeDetails((prev) => ({
                        ...prev,
                        channel: userDetails.channel || "",
                      }));
                    }}
                    className="account-editicon"
                  >
                    <img src={editIcon} alt="" />
                  </button>
                )}
                {changeChannel && (
                  <input
                    value={changeDetails.channel || ""}
                    onChange={(e) =>
                      setChangeDetails((prev) => ({
                        ...prev,
                        channel: e.target.value,
                      }))
                    }
                    placeholder="Enter Channel Name"
                    className="account-valuefield"
                  />
                )}
              </div>

              {/* Change Username */}
              <div className="relative flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="account-username">User Name:</label>
                {!changeUsername && (
                  <span id="account-username" className="account-valuefield">
                    {userDetails.username}
                  </span>
                )}
                {!changeUsername && (
                  <button
                    onClick={() => {
                      setChangeUsername(true);
                      setChangeDetails((prev) => ({
                        ...prev,
                        username: userDetails.username || "",
                      }));
                    }}
                    className="account-editicon"
                  >
                    <img src={editIcon} alt="" />
                  </button>
                )}
                {changeUsername && (
                  <input
                    value={changeDetails.username || ""}
                    onChange={(e) =>
                      setChangeDetails((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Enter new username"
                    className="account-valuefield"
                  />
                )}
              </div>

              {/* Change Email */}
              <div className="relative flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="account-email">Email ID:</label>
                {!changeEmail && (
                  <span id="account-email" className="account-valuefield">
                    {userDetails.email}
                  </span>
                )}
                {!changeEmail && (
                  <button
                    onClick={() => {
                      setChangeEmail(true);
                      setChangeDetails((prev) => ({
                        ...prev,
                        email: userDetails.email || "",
                      }));
                    }}
                    className="account-editicon"
                  >
                    <img src={editIcon} alt="" />
                  </button>
                )}
                {changeEmail && (
                  <input
                    value={changeDetails.email || ""}
                    onChange={(e) =>
                      setChangeDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter new email"
                    className="account-valuefield"
                  />
                )}
              </div>

              {/* Change Password */}
              <div className="relative flex flex-col sm:flex-row items-center justify-between">
                <label htmlFor="account-password">Password:</label>
                <span id="account-password" className="account-valuefield">
                  ********
                </span>
                <Link to={"/changePassword"} className="account-editicon">
                  <img src={editIcon} alt="" />
                </Link>
              </div>
              {submitMessage != "" && (
                <p className="text-red-500">{submitMessage}</p>
              )}
              {(changeUsername || changeChannel || changeEmail) && (
                <button
                  onClick={handleSubmit}
                  className="mt-6 px-6 py-2 bg-purple-700 text-white font-bold rounded-2xl hover:bg-purple-800 transition"
                >
                  Submit Changes
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Account;
