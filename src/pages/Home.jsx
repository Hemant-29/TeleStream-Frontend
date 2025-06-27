import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { urlContext } from "../context/context";

const Home = () => {
  // constants
  const base_Url = useContext(urlContext);

  // State variables
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //   __Functions__
  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${base_Url}/api/v1/video/all`);
      console.log(response.data);
      setAllVideos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // __Use effect Hooks__
  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    console.log(allVideos);
  }, [allVideos]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar highlight="home" />
        <div id="HomePage" className="p-5">
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allVideos.map((video) => {
              return (
                <VideoCard
                  videoID={video._id}
                  userID={video.userID}
                  title={video.title}
                  channelName={video.userName}
                  thumbnailUrl={video.thumbnailUrl}
                  videoUrl={video.videoUrl}
                  views={video.views}
                  date={video.date.split("T")[0]}
                  key={video._id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
