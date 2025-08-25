import { useState, useEffect } from 'react';
import intro from '../assets/intro.mp4'

const AssignmentIntroVideo = ({ onVideoEnd, assignmentName }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    return () => clearTimeout(skipTimer);
  }, []);

  const handleVideoEnd = () => {
    setShowVideo(false);
    onVideoEnd();
  };

  const handleSkipIntro = () => {
    setShowVideo(false);
    onVideoEnd();
  };

  if (!showVideo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Skip button */}
        {showSkipButton && (
          <button
            onClick={handleSkipIntro}
            className="absolute top-3 right-4 z-10  px-4 py-2 font-medium text-red-400 
                   border border-red-500 rounded-lg 
                   hover:bg-red-900 transition 
                   hover:text-white
                   focus:outline-none focus:ring-2 focus:ring-red-500"
            style={{ zIndex: 100 }}
          >
            Skip Tutorial
          </button>
        )}
        
        <div className=" border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 p-4 rounded-t-lg">
          <h2 className="text-white text-xl font-bold text-center">
            Tutorial: {assignmentName}
          </h2>
        </div>
        
        <div className="relative aspect-video bg-black">
          <video
            autoPlay
            controls
            onEnded={handleVideoEnd}
            className="w-full h-full object-contain"
          >
            {/* Replace with your actual video path */}
            <source src={intro} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="border border-opacity-20 border-white shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-white/10 p-4 rounded-b-lg text-center">
          <p className="text-gray-300 text-sm">
            Watch this tutorial to learn how to approach this assessment effectively
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentIntroVideo;