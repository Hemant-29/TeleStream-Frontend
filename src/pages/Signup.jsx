import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const baseUrl = "http://localhost:5000";

  // State Variables
  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Use Navigate Hook
  const navigate = useNavigate();

  // Function for Submit handler
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/signup`,
        {
          username,
          channel,
          email,
          password,
        },
        {
          withCredentials: true, // allow cookie to be received
        }
      );

      console.log("Signup response:", response.data);
      setMessage(response.data.msg || "Signup Successful");

      // Navigate to the Homepage and reload after a delay
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-full h-screen flex justify-center items-center bg-neutral-900 text-white">
          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 bg-neutral-800 p-8 rounded-lg shadow-xl w-96"
          >
            <h2 className="text-xl font-semibold text-center">Sign Up</h2>

            <input
              type="text"
              placeholder="Username"
              className="px-4 py-2 rounded bg-neutral-700 placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded bg-neutral-700 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Channel Name"
              className="px-4 py-2 rounded bg-neutral-700 placeholder-gray-400"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded bg-neutral-700 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
            >
              Sign Up
            </button>

            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
