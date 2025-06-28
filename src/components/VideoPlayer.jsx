import React, { useContext, useEffect, useRef, useState } from "react";
import { urlContext } from "../context/context";
import axios from "axios";

const VideoPlayer = ({ videoDetails }) => {
  const baseUrl = useContext(urlContext);

  // State Variables
  const [isViewSent, setIsViewSent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [showVolume, setShowVolume] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [expandedSetting, setExpandedSetting] = useState(false);
  const [expandedSpeed, setExpandedSpeed] = useState(false);
  const [controlsShow, setControlsShow] = useState(false);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(Date.now());
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  // Use Ref Hooks
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const playedTimeRef = useRef(0); // accumulated real playback time

  // __________________________________Functions__________________________________
  // Functions to add a view to the video using a timer
  const startTrackingPlayback = () => {
    if (timerRef.current || isViewSent) return;

    timerRef.current = setInterval(() => {
      if (!videoRef.current) return;
      playedTimeRef.current += 1; // increment by 1 second

      const video = videoRef.current;
      const duration = video.duration;
      const viewThreshold = Math.min(duration * 0.25, 30); // 25% or 30s

      if (playedTimeRef.current >= viewThreshold) {
        clearInterval(timerRef.current);
        timerRef.current = null;

        // Call the view API
        axios
          .post(
            `${baseUrl}/api/v1/video/view/${videoDetails._id}`,
            {},
            { withCredentials: true }
          )
          .then((res) => {
            console.log("View added:", res.data);
            setIsViewSent(true);
          })
          .catch((err) => console.error("Error adding view:", err));
      }
    }, 1000); // check every 1 second
  };
  const stopTrackingPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Function to format time
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // ___Functions for video controls___
  // Play Pause the video
  const playControls = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setControlsShow(true);
    } else {
      videoRef.current.play();
      setTimeout(() => {
        setControlsShow(false);
      }, 1000);
    }
    setIsPlaying((prev) => !prev);
  };

  // Set the progress of the progress bar
  const setProgressControl = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  // Toggle Full Screen
  const toggleFullScreen = async () => {
    const videoContainer = videoRef.current?.parentElement;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!document.fullscreenElement) {
      try {
        // Enter fullscreen
        await videoContainer?.requestFullscreen();
        setFullScreen(true);

        // Rotate to landscape on mobile
        if (isMobile && screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape").catch((err) => {
            console.warn("Orientation lock failed:", err);
          });
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        // Exit fullscreen
        await document.exitFullscreen();
        setFullScreen(false);

        // Unlock orientation back to default
        if (isMobile && screen.orientation?.unlock) {
          screen.orientation.unlock(); // optional; most browsers reset automatically
        }
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  // Set Playback Speed
  const setPlaybackSpeed = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setExpandedSpeed(false);
  };

  // _________________________________Use Effect_________________________________

  useEffect(() => {
    // Adds the eventlistener to update time and duration at the beginning
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  useEffect(() => {
    console.log("video Details:", videoDetails);
  }, [videoDetails]);

  useEffect(() => {
    // Set Volume whenever state changes
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Go to the video player
    window.scrollTo({
      top,
      behavior: "smooth",
    });

    // Reset video states when new video loads
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    playedTimeRef.current = 0;
    setIsViewSent(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // play the video
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsPlaying((prev) => !prev);
  }, [videoDetails._id]);

  useEffect(() => {
    // Handle the video ending
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsPlaying(false);
      console.log("Video playback ended");
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    // Effect to auto-hide controls 1s after last mouse move
    const interval = setInterval(() => {
      if (Date.now() - lastMouseMoveTime > 1000 && !isHoveringControls) {
        setControlsShow(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastMouseMoveTime]);

  // ______________________________________JSX______________________________________
  return (
    <div
      className="relative w-full h-[30rem] rounded-lg overflow-hidden shadow-md bg-black"
      onMouseMove={() => {
        setLastMouseMoveTime(Date.now());
        setControlsShow(true);
      }}
      onMouseLeave={() => {
        setControlsShow(false);
        setExpandedSetting(false);
        setExpandedSpeed(false);
      }}
    >
      <video
        ref={videoRef}
        src={videoDetails.originalVideoUrl}
        onPlay={startTrackingPlayback}
        onPause={stopTrackingPlayback}
        onTimeUpdate={setProgressControl}
        className="w-full h-full"
      >
        Your browser does not support the video tag.
      </video>

      <div
        className="absolute top-0 h-full w-full z-10"
        onClick={playControls}
        onDoubleClick={toggleFullScreen}
      ></div>
      {/* Video Playback Controls */}
      {controlsShow && (
        <div
          className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col gap-0 z-20"
          onMouseMove={() => setIsHoveringControls(true)}
          onMouseLeave={() => setIsHoveringControls(false)}
        >
          {/* Playback Slider */}
          <div className="relative w-full h-1 bg-neutral-600/70  rounded-full overflow-hidden">
            {/* Filled progress */}
            <div
              className="absolute top-0 left-0 h-full bg-purple-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Slider input */}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => {
              const newProgress = parseFloat(e.target.value);
              setProgress(newProgress);
              if (videoRef.current && videoRef.current.duration > 0) {
                videoRef.current.currentTime =
                  (newProgress / 100) * videoRef.current.duration;
              }
            }}
            className="player_slider w-full h-2 appearance-none bg-transparent pointer-events-auto relative bottom-1.5 z-10"
          />

          {/* Control Bar */}
          <div className="flex items-center justify-between">
            <div
              id="player-left_buttons"
              className="flex flex-row sm:gap-2 items-center"
            >
              {/* Play Button */}
              <button onClick={playControls} className="w-12 aspect-square">
                {isPlaying ? (
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 36 36"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                  >
                    <path
                      className="ytp-svg-fill"
                      d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
                    />
                  </svg>
                ) : (
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 36 36"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                  >
                    <path
                      className="ytp-svg-fill"
                      d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
                    />
                  </svg>
                )}
              </button>

              <div
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                className="flex flex-row items-center"
              >
                <button
                  className="w-10 sm:w-12 aspect-square"
                  onClick={() => setVolume((prev) => (prev > 0 ? 0 : 50))}
                >
                  {volume == 0 && (
                    <svg
                      height="100%"
                      width="100%"
                      viewBox="0 0 36 36"
                      version="1.1"
                      fill="#ffffff"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="ytp-svg-fill"
                        d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z"
                        fill="#fff"
                      />
                    </svg>
                  )}
                  {volume != 0 &&
                    (volume > 50 ? (
                      <svg
                        height="100%"
                        width="100%"
                        version="1.1"
                        viewBox="0 0 36 36"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <clipPath id="ytp-svg-volume-animation-mask">
                            <path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z" />
                            <path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z" />
                            <path
                              className="ytp-svg-volume-animation-mover"
                              d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z"
                              transform="translate(0, 0)"
                            />
                          </clipPath>
                          <clipPath id="ytp-svg-volume-animation-slash-mask">
                            <path
                              className="ytp-svg-volume-animation-mover"
                              d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z"
                              transform="translate(0, 0)"
                            />
                          </clipPath>
                        </defs>

                        <path
                          className="ytp-svg-fill ytp-svg-volume-animation-speaker"
                          clipPath="url(#ytp-svg-volume-animation-mask)"
                          d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z
                     M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z
                     M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 
                     C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
                          fill="#fff"
                        />
                        <path
                          className="ytp-svg-fill ytp-svg-volume-animation-hider"
                          clipPath="url(#ytp-svg-volume-animation-slash-mask)"
                          d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"
                          fill="#fff"
                          style={{ display: "none" }}
                        />
                      </svg>
                    ) : (
                      <svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 36 36"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                      >
                        <defs>
                          <clipPath id="ytp-svg-volume-animation-mask">
                            <path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z" />
                            <path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z" />
                            <path
                              className="ytp-svg-volume-animation-mover"
                              d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z"
                              transform="translate(0, 0)"
                            />
                          </clipPath>
                          <clipPath id="ytp-svg-volume-animation-slash-mask">
                            <path
                              className="ytp-svg-volume-animation-mover"
                              d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z"
                              transform="translate(0, 0)"
                            />
                          </clipPath>
                        </defs>

                        <path
                          className="ytp-svg-fill ytp-svg-volume-animation-speaker"
                          clipPath="url(#ytp-svg-volume-animation-mask)"
                          d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z"
                          fill="#fff"
                        />

                        <path
                          className="ytp-svg-fill ytp-svg-volume-animation-hider"
                          clipPath="url(#ytp-svg-volume-animation-slash-mask)"
                          d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"
                          fill="#fff"
                          style={{ display: "none" }}
                        />
                      </svg>
                    ))}
                </button>
                {showVolume && (
                  <input
                    type="range"
                    className="w-20 h-1 accent-gray-50 cursor-pointer"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  ></input>
                )}
              </div>
              <div>
                <span className="cursor-default select-none text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            <div
              id="player-right_buttons"
              className="relative flex flex-row sm:gap-2 items-center"
            >
              {/* Quality Settings Button */}
              <button
                onClick={() => {
                  setExpandedSetting((prev) => !prev);
                  setExpandedSpeed(false);
                }}
                className="w-10 sm:w-12 aspect-square"
              >
                <svg
                  height="100%"
                  width="100%"
                  viewBox="0 0 36 36"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    id="ytp-id-19"
                    fill="#fff"
                    d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z"
                  />
                </svg>
              </button>
              {expandedSetting && (
                <div className="absolute bottom-16 right-1/2 bg-neutral-600/60 backdrop-blur-xs rounded-xl w-20">
                  {[1080, 480, 240].map((resolution) => {
                    return (
                      <div
                        onClick={() => setExpandedSetting(false)}
                        className="px-4 py-2 cursor-pointer hover:bg-neutral-700/70 hover:rounded-xl"
                      >
                        {resolution + "p"}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Video Playback Speed Button */}
              <button
                onClick={() => {
                  setExpandedSpeed((prev) => !prev);
                  setExpandedSetting(false);
                }}
                className="flex justify-center items-center w-10 sm:w-12 aspect-square"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70%"
                  height="70%"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6.34315 17.6569C5.22433 16.538 4.4624 15.1126 4.15372 13.5607C3.84504 12.0089 4.00346 10.4003 4.60896 8.93853C5.21446 7.47672 6.23984 6.22729 7.55544 5.34824C8.87103 4.46919 10.4177 4 12 4C13.5823 4 15.129 4.46919 16.4446 5.34824C17.7602 6.22729 18.7855 7.47672 19.391 8.93853C19.9965 10.4003 20.155 12.0089 19.8463 13.5607C19.5376 15.1126 18.7757 16.538 17.6569 17.6569"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12L16 10"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {expandedSpeed && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/4 bg-neutral-600/60 backdrop-blur-xs rounded-xl w-20">
                  {[0.5, "normal", 1.25, 1.5, 2].map((speed) => {
                    return (
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-neutral-700/70 hover:rounded-xl"
                        onClick={() => {
                          if (speed == "normal") speed = 1;
                          setPlaybackSpeed(speed);
                        }}
                        key={speed}
                      >
                        {speed}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullScreen}
                className="w-10 sm:w-12 aspect-square"
              >
                {fullScreen ? (
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 36 36"
                    version="1.1"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g className="ytp-fullscreen-button-corner-2">
                      <path
                        className="ytp-svg-fill"
                        d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-3">
                      <path
                        className="ytp-svg-fill"
                        d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-0">
                      <path
                        className="ytp-svg-fill"
                        d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-1">
                      <path
                        className="ytp-svg-fill"
                        d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 36 36"
                    version="1.1"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g className="ytp-fullscreen-button-corner-0">
                      <path
                        className="ytp-svg-fill"
                        d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-1">
                      <path
                        className="ytp-svg-fill"
                        d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-2">
                      <path
                        className="ytp-svg-fill"
                        d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"
                      />
                    </g>
                    <g className="ytp-fullscreen-button-corner-3">
                      <path
                        className="ytp-svg-fill"
                        d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"
                      />
                    </g>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
