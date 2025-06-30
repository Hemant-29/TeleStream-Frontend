import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext, urlContext } from "../context/context";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Upload = () => {
  const baseUrl = useContext(urlContext);
  const navigate = useNavigate();
  const loggedinState = useContext(loginContext);

  // State Variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [uploaded, setUploaded] = useState(false);

  // Function to handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !videoFile || !thumbnailFile) {
      setUploadMessage("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      setIsLoading(true);
      setUploadMessage("");

      const response = await axios.post(
        `${baseUrl}/api/v1/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setUploaded(true);
      console.log("Upload success:", response.data);
      setUploadMessage("Video uploaded successfully!");
      setNoteMessage(
        "Note: The video is currently being processed up to 1080p quality. It may be temporarily unavailable until processing is complete."
      );
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setUploadMessage(error.response?.data?.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-neutral-900 text-white">
        <Sidebar highlight="Upload" />
        <div className="flex-grow sm:px-12 py-6">
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
            </div>
          )}
          <h2 className="text-xl font-bold mb-6">Upload Your Video</h2>

          <form
            onSubmit={handleUpload}
            className="space-y-6 max-w-xl px-2 sm:px-8"
          >
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter the video title"
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600"
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a description for your video"
                className="w-full p-2 h-32 rounded bg-neutral-800 border border-neutral-600"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Video File<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
                className="text-sm bg-neutral-600 h-12 w-40 sm:w-60 p-3 rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail Image<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                required
                className="text-sm bg-neutral-600 h-12 w-40 sm:w-60 p-3 rounded-2xl"
              />
            </div>
            {uploadMessage && (
              <div
                className={`text-sm ${
                  uploadMessage.includes("successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {uploadMessage}
              </div>
            )}
            {<div className="text-sm text-yellow-400">{noteMessage}</div>}
            {!uploaded && (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 ml-4 rounded text-white transition"
              >
                {isLoading ? "Uploading..." : "Upload Video"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Upload;
