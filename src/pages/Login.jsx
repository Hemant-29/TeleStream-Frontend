import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const baseUrl = "http://localhost:5000";

  // State Variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Use Navigate
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/login`,
        { username, password },
        {
          withCredentials: true, // send cookies and allow response cookies
        }
      );
      setMessage(response.data.msg || "Login Successful");
      console.log("logged in user:", response);

      // Navigate to the Homepage and reload
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.error || "Login Failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div
          id="login_page"
          className="w-full h-screen flex justify-center items-center bg-neutral-900 text-white"
        >
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 bg-neutral-800 p-8 rounded-lg shadow-xl w-96"
          >
            <h2 className="text-xl font-semibold text-center">Login</h2>

            <input
              type="text"
              placeholder="Username"
              className="px-4 py-2 rounded bg-neutral-700 placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
            >
              Log In
            </button>

            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
