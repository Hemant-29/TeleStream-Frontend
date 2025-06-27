import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

// Components Import
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { getColorFromLetter } from "../services/color";

const Search = () => {
  const baseUrl = "http://localhost:5000";

  const location = useLocation();

  // Search Params
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  console.log("Search params:", query);

  // Use State Variables
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use Effect Hooks
  useEffect(() => {
    const fetchSearchResult = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/video/search?keyword=${query}`
        );
        setIsLoading(false);
        console.log("search response:", response.data);
        setSearchData(response.data);
      } catch (error) {
        if (error.status == 404) {
          setSearchData(null);
        }
        console.error("error in search:", error);
      }
    };

    if (query) {
      fetchSearchResult();
    }
  }, [location.search]); // Listens to query change

  useEffect(() => {
    console.log("serachData:", searchData);
  }, [searchData]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        {searchData == null && (
          <div className="text-center w-full my-10">No search results</div>
        )}
        {searchData != null && !isLoading && (
          <div id="SearchPage" className="p-5 w-full">
            <p className="mb-10 text-center">Search results for: {query}</p>
            <h2 className="text-xl font-bold mb-4">Videos Found</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {searchData.videos &&
                searchData.videos.map((video) => {
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
            <h2 className="text-xl font-bold mb-4">Channels Found</h2>
            {searchData.users &&
              searchData.users.map((user) => {
                return (
                  <Link to={"/" + user._id} className="flex flex-row">
                    <p
                      className={`${getColorFromLetter(
                        user.channel[0]
                      )} rounded-full w-40 h-40 text-6xl font-bold text-white flex items-center justify-center m-4`}
                    >
                      {user.channel[0]}
                    </p>
                    <div className="flex flex-col gap-3 p-4 justify-center">
                      <p className="text-2xl font-bold">{user.channel}</p>
                      <div className="flex gap-4 ">
                        <p>@{user.username}</p>
                        <p>{user.subscribers.length} subscribers</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
