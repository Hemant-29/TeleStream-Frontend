import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext, urlContext, userContext } from "../context/context";
import axios from "axios";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";

const Liked = () => {
  const baseUrl = useContext(urlContext);

  // State Variables
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use Navigate Hook
  const navigate = useNavigate();

  // Use Context Hook
  const loggedinState = useContext(loginContext);
  const { userDetails, refreshUser } = useContext(userContext);

  // ________________________________Functions________________________________

  const fetchVideoDetails = async (videoID) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/video/${videoID}`);
      console.log("Video Details:", response.data);

      setIsLoading(false);

      setLikedVideos((prev) => {
        const alreadyExists = prev.some(
          (video) => video._id === response.data.video._id
        );
        if (!alreadyExists) {
          return [...prev, response.data.video];
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // _______________________________Use Effect Hooks_______________________________
  useEffect(() => {
    if (userDetails.likes) {
      userDetails.likes.forEach((videoID) => {
        fetchVideoDetails(videoID);
      });

      if (userDetails.likes.length == 0) {
        setIsLoading(false);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    console.log("All Liked Videos:", likedVideos);
  }, [likedVideos]);

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
        <Sidebar highlight="liked" />
        <div id="Subscriptions" className="p-5 w-full">
          {loggedinState == false && (
            <div className="flex flex-col items-center w-full p-5 text-lg">
              <p>Login to see your liked videos</p>

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
            (likedVideos.length == 0 ? (
              <div className="text-center">
                Nothing here... time to explore and like some videos!
              </div>
            ) : (
              <>
                <div className="font-bold text-xl">Liked Videos</div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 p-4 mb-8">
                  {likedVideos.map((video) => (
                    <VideoCard
                      videoID={video._id}
                      thumbnailUrl={video.thumbnailUrl}
                      title={video.title}
                      channelName={video.userName}
                      views={video.views}
                      date={video.date.split("T")[0]}
                      key={video._id}
                    ></VideoCard>
                  ))}
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Liked;
