import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from "../context/context";
import { Link, useParams } from "react-router-dom";
import { getColorFromLetter } from "../services/color";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import uploadIcon from "../assets/upload.svg";
import binIcon from "../assets/dustbin.svg";

const User = () => {
  // constants
  const baseUrl = "http://localhost:5000";

  // Use Context
  const { userDetails, refreshUser } = useContext(userContext);

  // Use Params Hook
  const userID = useParams().userID;

  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [channelUser, setChannelUser] = useState({});
  const [deletionPopup, setDeletionPopup] = useState(false);
  const [deletionVideo, setDeletionVideo] = useState({});

  //   __________________________________Functions__________________________________
  // Fetch User details from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/${userID}`);
      setIsLoading(false);
      console.log("userDetails:", response.data);
      setChannelUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to subscribe to a channel
  const subscribeChannel = async () => {
    console.log("Subscribing to", channelUser.username, "with id:", userID);
    if (userID) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/subscribe/${userID}`,
          {},
          { withCredentials: true }
        );
        console.log("Subscribing response:", response.data);
        if (response.status == 200) {
          refreshUser();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to subscribe to a channel
  const unsubscribeChannel = async () => {
    console.log("unsubscribing from", channelUser.username, "with id:", userID);
    if (userID) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/unsubscribe/${userID}`,
          {},
          { withCredentials: true }
        );
        console.log("unsubscribing response:", response.data);
        if (response.status == 200) {
          refreshUser();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to delete a video
  const deleteVideo = async (videoID) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/video/delete/${videoID}`,
        { withCredentials: true }
      );
      console.log("deletion result:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ______________________________Use effect Hooks______________________________
  useEffect(() => {
    fetchUsers();
  }, [userID]);

  useEffect(() => {
    console.log("subscribedChannels", userDetails.subscribedChannels);
  }, [userDetails]);

  useEffect(() => {
    console.log("channel Details", channelUser);
  }, [channelUser]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar highlight="User" />
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
          </div>
        )}
        {!isLoading && (
          <div id="UserPage" className="p-5 w-full">
            <div className="text-center text-5xl font-bold bg-neutral-600 rounded-xl py-20">
              {channelUser.channel}
            </div>
            <div className="flex flex-col sm:flex-row items-center my-10">
              <p
                className={`${getColorFromLetter(
                  channelUser.channel[0]
                )} rounded-full w-40 h-40 text-6xl font-bold text-white flex items-center justify-center m-4`}
              >
                {channelUser.channel[0]}
              </p>
              <div className="flex flex-col gap-3 p-4">
                <p className="text-2xl font-bold">{channelUser.channel}</p>
                <div className="flex gap-4">
                  <p>@{channelUser.username}</p>
                  <p>{channelUser.subscribers} subscribers</p>
                </div>
                <p>{channelUser.videos.length} videos</p>

                {userDetails &&
                userDetails.subscribedChannels.includes(channelUser._id) ? (
                  <button
                    className="px-6 py-3 rounded-2xl text-white bg-neutral-600 "
                    onClick={unsubscribeChannel}
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    className="px-6 py-3 rounded-2xl text-black bg-neutral-100 "
                    onClick={subscribeChannel}
                  >
                    Subscribe
                  </button>
                )}
              </div>
              {channelUser._id == userDetails._id && (
                <Link to={"/upload"} className="py-10 w-15 mx-auto">
                  <img src={uploadIcon} alt="" />
                  <p className="text-center">Upload Video</p>
                </Link>
              )}
            </div>
            <p className="text-xl font-bold">All Videos</p>
            <hr className="border-neutral-500 my-3" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {channelUser.videos.map((video) => {
                return (
                  <div className="relative">
                    <VideoCard
                      videoID={video._id}
                      userID={video.userID}
                      title={video.title}
                      channelName={channelUser.channel}
                      thumbnailUrl={video.thumbnailUrl}
                      videoUrl={video.videoUrl}
                      views={video.views}
                      date={video.date.split("T")[0]}
                      key={video._id}
                    />
                    {channelUser._id == userDetails._id && (
                      <button
                        onClick={() => {
                          setDeletionPopup(true);
                          setDeletionVideo(video);
                        }}
                        className="absolute top-5 right-5 rounded-full bg-red-600/50 backdrop-blur-xs p-3 w-12"
                      >
                        <img src={binIcon} alt="" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {deletionPopup && (
              <div className="flex flex-col items-center justify-center gap-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-15 h-3/4 w-3/4 rounded-2xl bg-neutral-700/70 backdrop-blur-md z-50">
                <p>You are Permanently Deleting your video titled:</p>
                <p className="font-bold">{deletionVideo.title}</p>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <button
                    className="bg-white text-black font-bold px-6 max-h-12 py-3 w-fit rounded-2xl"
                    onClick={() => setDeletionPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 font-bold px-6 py-3 w-fit rounded-2xl"
                    onClick={() => {
                      deleteVideo(deletionVideo._id);
                      setDeletionPopup(false);
                    }}
                  >
                    PROCEED TO DELETE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default User;
