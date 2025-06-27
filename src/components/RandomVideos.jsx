import React, { useState, useEffect } from "react";
import axios from "axios";

import VideoCard from "../components/VideoCard";

const RandomVideos = ({ videoIDtoRemove }) => {
  // constants
  const base_Url = "http://localhost:5000";

  // State variables
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //   __Functions__
  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${base_Url}/api/v1/video/all`);
      let videos = response.data;

      // Remove the unwanted video
      videos = videos.filter((video) => video._id !== videoIDtoRemove);

      // Shuffle the remaining videos
      videos = shuffleArray(videos);

      // Set state
      setAllVideos(videos);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Shuffle Array
  function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating the original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  }

  // __Use effect Hooks__
  useEffect(() => {
    fetchVideos();
  }, [videoIDtoRemove]);

  useEffect(() => {
    console.log(allVideos);
  }, [allVideos]);

  return (
    <>
      <div id="RandomVideos" className="p-5">
        {isLoading && (
          <div className="flex justify-center w-vw text-center">
            <h1 className="text-2xl text-center">Please wait, Loading...</h1>
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allVideos.map((video) => {
            return (
              <VideoCard
                videoID={video._id}
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
    </>
  );
};

export default RandomVideos;
