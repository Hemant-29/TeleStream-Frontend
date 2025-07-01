import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext, urlContext, userContext } from "../context/context";
import axios from "axios";

import logo from "../assets/play.png";
import loginIcon from "../assets/login.svg";
import signupIcon from "../assets/signup.svg";
import userIcon from "../assets/user.svg";
import uploadIcon from "../assets/upload.svg";
import logoutIcon from "../assets/logout.svg";
import accountIcon from "../assets/account.svg";
import { getColorFromLetter } from "../services/color";

const Navbar = () => {
  const baseUrl = useContext(urlContext);

  // State Variables
  const [searchTerm, setSearchTerm] = useState("");
  const [userDropDown, setUserDropDown] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [channelBgColor, setChannelBgColor] = useState(null);

  // Reference and Navigate Hooks
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Import context
  const loggedinState = useContext(loginContext);
  const { userDetails, refreshUser } = useContext(userContext);

  // Function to search video
  const searchVideo = (e) => {
    e.preventDefault(); // prevent page reload
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Function to Logout user
  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log("LogoutResponse", response.data);

      // Navigate to the Homepage and reload
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to update Height
  const updateHeight = () => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  };

  // UseEffect Hooks
  useEffect(() => {
    updateHeight(); // initial
    window.addEventListener("resize", updateHeight); // update on resize

    return () => window.removeEventListener("resize", updateHeight); // cleanup
  }, []);

  useEffect(() => {
    setChannelBgColor((prev) => {
      let channelFirstLetter = "A";
      if (userDetails.channel) {
        channelFirstLetter = userDetails.channel[0];
      }
      return getColorFromLetter(channelFirstLetter);
    });
  }, [userDetails]);

  return (
    <>
      <div
        id="navbar"
        ref={navbarRef}
        className="sticky top-0 z-50 flex flex-col gap-3 w-full items-center justify-between px-4 py-2 bg-neutral-600/70 backdrop-blur-md w-vw h-fit sm:flex-row sm:h-16"
      >
        <Link to={"/"} className="flex">
          <img src={logo} alt="Logo Icon" width={40} />
          <h2 id="LogoName" className="text-4xl px-4">
            TeleStream
          </h2>
        </Link>
        <form onSubmit={searchVideo} className="flex items-center">
          <input
            type="text"
            className=" border-1 border-neutral-400 w-5xs h-10 pl-3 rounded-l-lg md:w-2xs"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="rounded-r-lg px-3 bg-indigo-500 h-10 cursor-pointer">
            Search
          </button>
        </form>
        {!loggedinState && (
          <div className="flex gap-3">
            <Link to="/login" className="flex gap-2 items-center">
              <img src={loginIcon} />
              Login
            </Link>
            <Link to="/signup" className="flex gap-2 items-center">
              <img src={signupIcon} />
              SignUp
            </Link>
          </div>
        )}
        {loggedinState && (
          <div className="flex gap-3">
            <button
              to="/login"
              onClick={() => setUserDropDown((prev) => !prev)}
              className="flex gap-2 items-center cursor-pointer"
            >
              <img src={userIcon} />
              User
            </button>
          </div>
        )}
      </div>
      {userDropDown && (
        <div
          className="flex flex-col gap-5 z-50 fixed right-2 top-20 p-6 rounded-xl bg-neutral-600/70 backdrop-blur-md"
          style={{ top: `${navHeight}px` }}
        >
          <div className="flex gap-2 items-center justify-center text-center">
            <p className="text-lg font-bold">
              {userDetails.subscribers.length}
            </p>
            <p> Subscribers</p>
          </div>

          <div className="flex flex-col items-center">
            <Link
              to={"/" + userDetails._id}
              className={`rounded-4xl w-8 h-8 text-center text-xl font-bold text-white ${channelBgColor}`}
            >
              {userDetails.channel && userDetails.channel[0].toUpperCase()}
            </Link>
            <Link to={"/" + userDetails._id}>{userDetails.channel || ""}</Link>
          </div>

          <Link to="/account" className="flex gap-2 items-center">
            <img src={accountIcon} alt="upload" />
            Your Account
          </Link>
          <Link to="/upload" className="flex gap-2 items-center w-[25px]">
            <img src={uploadIcon} alt="upload" />
            Upload Video
          </Link>
          <button className="flex gap-2 items-center" onClick={logoutUser}>
            <img src={logoutIcon} alt="logout" />
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
