import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loginContext, userContext, urlContext } from "./context/context.js";
import axios from "axios";

// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";

// Import Components
import NotFound from "./pages/NotFound.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Liked from "./pages/Liked.jsx";
import Signup from "./pages/Signup.jsx";
import Search from "./pages/Search.jsx";
import Watch from "./pages/Watch.jsx";
import Upload from "./pages/Upload.jsx";
import User from "./pages/user.jsx";

function App() {
  // SETUP BASE URL
  const baseUrl = "https://telestream-backend.onrender.com";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/subscriptions",
      element: <Subscriptions />,
    },
    {
      path: "/liked",
      element: <Liked />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/watch/:videoID",
      element: <Watch />,
    },
    {
      path: "/upload",
      element: <Upload />,
    },
    {
      path: "/:userID",
      element: <User />,
    },
  ]);

  // State Variables
  const [loggedinState, setLoggedinState] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  // ________________________________Functions________________________________
  // Function to Verify Login
  const verifyLogin = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/auth/test`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setLoggedinState(true);
      }
      console.log("Logged In state:", res.data);
    } catch (err) {
      console.log(
        "Not logged in:",
        err?.response?.data?.message || err.message
      );
      setLoggedinState(false);
    }
  };

  // Function to fetch the user details
  const fetchUser = async () => {
    if (!loggedinState) {
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user`, {
        withCredentials: true,
      });
      if (!response.data) {
        return null;
      }
      setUserDetails(response.data.user);
      console.log("User Data Response", response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  // _______________________________Use Effect Hooks_______________________________
  useEffect(() => {
    verifyLogin();
    fetchUser();
  }, [loggedinState]);

  useEffect(() => {
    console.log("User Details:", userDetails);
  }, [userDetails]);

  return (
    <>
      <urlContext.Provider value={baseUrl}>
        <userContext.Provider value={{ userDetails, refreshUser: fetchUser }}>
          <loginContext.Provider value={loggedinState}>
            <RouterProvider router={router} />
          </loginContext.Provider>
        </userContext.Provider>
      </urlContext.Provider>
    </>
  );
}

export default App;
