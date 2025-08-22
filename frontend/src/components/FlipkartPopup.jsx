import { useState, useEffect } from "react";
import api, { FILE_BASE_URL } from "../services/api";
import { FiX, FiDownload } from "react-icons/fi";

const FlipkartPopup = ({ onClose }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const response = await api.getLatestFlipkartContent();
        if (response.success) {
          setContent(response.content);
        }
      } catch (error) {
        console.error("Error fetching Flipkart content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const getVideoType = (videoPath) => {
    if (!videoPath) return "video/mp4";
    const extension = videoPath.split(".").pop().toLowerCase();
    switch (extension) {
      case "mp4":
        return "video/mp4";
      case "webm":
        return "video/webm";
      case "ogg":
        return "video/ogg";
      case "mov":
        return "video/quicktime";
      default:
        return "video/mp4";
    }
  };

  if (loading) return null;
  if (!content) return null;

  const imageUrl = content.image_path
    ? `${FILE_BASE_URL}${content.image_path}`
    : null;
  const videoUrl = content.video_path
    ? `${FILE_BASE_URL}${content.video_path}`
    : null;
  const videoType = getVideoType(content.video_path);

  return (
    <div
      className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 p-4"
      style={{ background: "#00000091" }}
    >
      <div
        className="relative rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-cover bg-center shadow-lg"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black z-10 bg-white rounded-full p-1 shadow-md"
        >
          <FiX size={24} />
        </button>

        {/* Overlay content */}
       
          <h2 className="text-2xl font-bold mb-2 text-white">
            {content.title}
          </h2>
          <p className="text-white mb-4">{content.description}</p>

          {/* Video Section */}
          {videoUrl && !videoError && (
            <div className="mb-6">
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: "400px" }}
                  onError={handleVideoError}
                >
                  <source src={videoUrl} type={videoType} />
                  Your browser does not support the video tag.
                </video>
              </div>

             
            </div>
          )}

          {/* Video error fallback */}
          {videoError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 text-center mb-2">
                Video cannot be played in the browser.
              </p>
              <div className="text-center">
                <a
                  href={videoUrl}
                  download
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiDownload className="mr-2" />
                  Download Video
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

  );
};

export default FlipkartPopup;