import React from "react";
import { Link } from "react-router-dom";

const VideoCard = (props) => {
  const maxLength = 70;
  const truncatedTitle = (title) => {
    const newTitle =
      title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
    return newTitle;
  };

  const channelID = "channel1";

  return (
    <div className="flex flex-col">
      <Link to={`/watch/${props.videoID}`}>
        <div className="w-full aspect-video overflow-hidden rounded-xl">
          <img
            src={props.thumbnailUrl}
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <p className="font-bold">{truncatedTitle(props.title)}</p>
      </Link>
      <Link
        to={"/" + props.userID}
        className="flex gap-4 text-xs text-neutral-300 hover:text-white"
      >
        {props.channelName}
      </Link>
      <div className="flex gap-4 text-xs text-neutral-300">
        <p>{props.views.toLocaleString("en-US")} views</p>
        <p>{props.date}</p>
      </div>
    </div>
  );
};

export default VideoCard;
