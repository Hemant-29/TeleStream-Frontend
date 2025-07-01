import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

// Import components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import RandomVideos from "../components/RandomVideos";

// Import Icons
import like_thumbsUp from "../assets/like.svg";
import share from "../assets/share.svg";
import { loginContext, urlContext, userContext } from "../context/context";
import VideoPlayer from "../components/VideoPlayer";
import { getColorFromLetter } from "../services/color";

const Watch = () => {
  // Constants
  const baseUrl = useContext(urlContext);
  const { videoID } = useParams();

  // State Variables
  const [videoDetails, setVideoDetails] = useState({});
  const [commentsData, setCommentsData] = useState([]);
  const [channelBgColor, setChannelBgColor] = useState(null);
  const [likedVideo, setLikedVideo] = useState(false);
  const [comment, setComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Contexts
  const loggedinState = useContext(loginContext);
  const { userDetails, refreshUser } = useContext(userContext);

  // _________________________________Functions_________________________________
  // Function to Fetch video details from API
  const fetchVideoDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/video/${videoID}`);
      const data = response.data;
      console.log("Video fetch data:", data.video);
      setVideoDetails(data.video);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to Fetch All comments on video
  const fetchComments = async () => {
    try {
      const results = await axios.get(
        `${baseUrl}/api/v1/video/comments/${videoID}`
      );
      const comments_data = results.data.comments;
      console.log("Comments Data:", comments_data);
      setCommentsData(comments_data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to Add Comment
  const addComment = async (event) => {
    event.preventDefault();
    try {
      if (loggedinState) {
        const response = await axios.post(
          `${baseUrl}/api/v1/comment/${videoID}`,
          { desc: comment },
          { withCredentials: true }
        );
        console.log("comment added successfully:", response.data);
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to Like a video
  const likeVideo = async () => {
    try {
      if (loggedinState) {
        const response = await axios.post(
          `${baseUrl}/api/v1/video/like/${videoID}`,
          {},
          { withCredentials: true }
        );
        console.log("Like video response:", response.data);
        refreshUser();
      } else {
        window.alert("Login to like the video");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to subscribe to a channel
  const subscribeChannel = async () => {
    console.log(
      "Subscribing to",
      videoDetails.userName,
      "with id:",
      videoDetails.userID
    );
    if (!loggedinState) {
      window.alert("Login to subscribe channel");
    }
    if (videoDetails.userID) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/subscribe/${videoDetails.userID}`,
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
    console.log(
      "unsubscribing from",
      videoDetails.userName,
      "with id:",
      videoDetails.userID
    );
    if (videoDetails.userID) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/unsubscribe/${videoDetails.userID}`,
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

  // ______________________________Use Effect Hooks______________________________
  useEffect(() => {
    fetchVideoDetails();
    fetchComments();
  }, [videoID, comment]);

  useEffect(() => {
    setChannelBgColor((prev) => {
      const channelFirstLetter = videoDetails?.userName?.[0] || "?";
      return getColorFromLetter(channelFirstLetter);
    });
  }, [videoDetails]);

  useEffect(() => {
    if (userDetails && Array.isArray(userDetails.likes)) {
      setLikedVideo(userDetails.likes.includes(videoID));
    }
  }, [setLikedVideo, userDetails, videoID]);

  useEffect(() => {
    setSubscribed((prev) => {
      if (videoDetails.userID && userDetails.subscribedChannels) {
        const isSubbed = userDetails.subscribedChannels.includes(
          videoDetails.userID
        );
        if (isSubbed) {
          return true;
        }
        return false;
      }
    });
  }, [userDetails, videoDetails]);

  useEffect(() => {
    console.log("is Subscribed? :", subscribed);
  }, [subscribed]);

  // _____________________________________JSX_____________________________________
  return (
    <>
      <Navbar />
      <div className="flex flex-col p-4 w-full">
        <VideoPlayer videoDetails={videoDetails} />

        <h2 className="mt-4 text-xl font-semibold text-white">
          {videoDetails.title}
        </h2>
        <div className="flex gap-4 flex-col md:flex-row items-center justify-between my-3">
          <div className="flex items-center gap-3 w-full">
            <Link
              to={"/" + videoDetails.userID}
              className={`rounded-4xl w-8 h-8 text-center text-xl font-bold text-white ${channelBgColor}`}
            >
              {videoDetails.userName && videoDetails.userName[0].toUpperCase()}
            </Link>
            <Link to={"/" + videoDetails.userID}>{videoDetails.userName}</Link>
            {subscribed ? (
              <button
                className="cursor-pointer bg-neutral-700 rounded-2xl px-4 py-2"
                onClick={unsubscribeChannel}
              >
                Unsubscribe
              </button>
            ) : (
              <button
                className="cursor-pointer bg-neutral-50 text-black rounded-2xl px-4 py-2"
                onClick={subscribeChannel}
              >
                Subscribe
              </button>
            )}
          </div>

          <div className="flex justify-start md:justify-end gap-4 w-full">
            <button
              className="flex gap-2 items-center cursor-pointer bg-neutral-700 rounded-2xl px-4 py-2"
              onClick={() => likeVideo()}
            >
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill={likedVideo ? "white" : "none"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {videoDetails.likes && videoDetails.likes.length} Likes
            </button>
            <button className="flex gap-2 items-center cursor-pointer bg-neutral-700 rounded-2xl px-4 py-2">
              <img src={share} alt="" />
              Share
            </button>
          </div>
        </div>

        <div className="bg-neutral-700 p-5 my-3 rounded-xl">
          <div className="flex gap-4 w-full text-sm font-bold">
            <p>{videoDetails.views?.toLocaleString()} views</p>
            <p>{videoDetails.date?.split("T")[0]}</p>
          </div>

          <p
            className={`whitespace-pre-line text-neutral-300 text-sm mt-2 transition-all duration-300 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {videoDetails.description || "No video Description"}
          </p>

          {videoDetails.description &&
            videoDetails.description.length > 450 && (
              <button
                className="text-blue-400 text-xs mt-1 hover:underline"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
        </div>
        <div id="videoComments">
          <h2 className="font-bold ">{commentsData.length} Comments</h2>
          <div id="addComment">
            <form onSubmit={addComment} className="flex justify-between">
              <input
                type="text"
                className="border-b w-3/4 focus:outline-none"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {loggedinState && (
                <button
                  type="submit"
                  className="rounded-2xl px-3 py-2 bg-neutral-600"
                >
                  Comment
                </button>
              )}
            </form>
            {loggedinState == false && (
              <div className="flex gap-4 items-center mt-5">
                <p>Login to add a comment</p>
                <Link
                  to={"/login"}
                  className="rounded-xl px-3 py-2 bg-neutral-600"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 bg-neutral-900 p-5 my-3 rounded-lg">
            {commentsData &&
              commentsData.map((comment) => {
                return (
                  <div>
                    <div className="flex gap-3">
                      <p className="text-neutral-300 text-xs mt-2">
                        {comment.userName}
                      </p>
                      <p className="text-neutral-300 text-xs mt-2">
                        {comment.updatedAt.split("T")[0]}
                      </p>
                    </div>
                    <p className="text-neutral-100 text-sm mt-2 ml-2">
                      {comment.desc}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div id="moreVideos">
          <h2 className="font-bold ">More Videos</h2>
          <RandomVideos videoIDtoRemove={videoID} />
        </div>
      </div>
    </>
  );
};

export default Watch;
