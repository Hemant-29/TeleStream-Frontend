import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext, userContext } from "../context/context";
import axios from "axios";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";

const Subscriptions = () => {
  const baseUrl = "http://localhost:5000";

  // State Variables
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use Navigate Hook
  const navigate = useNavigate();

  // Use Context Hook
  const loggedinState = useContext(loginContext);
  const { userDetails, refreshUser } = useContext(userContext);

  // Function to find subscription user details
  const fetchSubcriptionDetails = async (subscriptionUserID) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/${subscriptionUserID}`
      );

      if (response.data.user) {
        setIsLoading(false);
        setSubscriptionDetails((prev) => {
          const alreadyExists = prev.some(
            (user) => user._id === response.data.user._id
          );
          if (!alreadyExists) {
            return [...prev, response.data.user];
          }
          return prev;
        });
      }
    } catch (error) {
      console.log("error occurred in fetching subscriptions!");
      console.error(error);
    }
  };

  // Function to Unsubscribe from a channel
  const unsubscribeChannel = async (channelID) => {
    console.log("unsubscribing from", channelID, "with id:", channelID);
    if (channelID) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/unsubscribe/${channelID}`,
          {},
          { withCredentials: true }
        );
        console.log("unsubscribing response:", response.data);
        if (response.status == 200) {
          // Refresh the user Details after unsubscribing
          refreshUser();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // _______________________________Use Effect Hooks_______________________________
  useEffect(() => {
    if (userDetails.subscribedChannels) {
      userDetails.subscribedChannels.forEach((element) => {
        fetchSubcriptionDetails(element);
      });
      if (userDetails.subscribedChannels.length == 0) {
        setIsLoading(false);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    console.log("Subscription Details:", subscriptionDetails);
  }, [subscriptionDetails]);

  useEffect(() => {
    if (loggedinState === false) {
      setIsLoading(false);
    }
  }, [loggedinState]);

  // ____________________________________JSX_____________________________________
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar highlight="subscriptions" />
        <div id="Subscriptions" className="p-5 w-full">
          {loggedinState == false && (
            <div className="flex flex-col items-center w-full p-5 text-lg">
              <p>Login to see your subscriptions</p>

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
          {!isLoading &&
            userDetails.subscribedChannels &&
            (userDetails.subscribedChannels.length == 0 ? (
              <div className="text-center">
                Subscribe a channel to see their videos
              </div>
            ) : (
              <>
                <div className="font-bold text-xl">Your Subscriptions</div>
                <div className="flex flex-col gap-3 p-4 mb-8">
                  {subscriptionDetails.map((channel, index) => (
                    <div className="flex items-center justify-between border rounded-xl p-4">
                      <Link key={index} to={"/" + channel._id}>
                        {channel.channel}
                      </Link>
                      <button
                        className="px-4 py-2 bg-neutral-600 rounded-xl"
                        onClick={() => unsubscribeChannel(channel._id)}
                      >
                        Unsubscribe
                      </button>
                    </div>
                  ))}
                </div>

                <div className="font-bold text-xl">Their Videos</div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 p-4 mb-8">
                  {subscriptionDetails.map((channel) =>
                    channel.videos.map((video) => (
                      <VideoCard
                        videoID={video._id}
                        thumbnailUrl={video.thumbnailUrl}
                        title={video.title}
                        userID={video.userID}
                        channelName={video.userName}
                        views={video.views}
                        date={video.date.split("T")[0]}
                        key={video._id}
                      ></VideoCard>
                    ))
                  )}
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
