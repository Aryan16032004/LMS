import React, { useEffect, useState } from 'react';
import studentService from '../../backend/student';

export default function Topic({ id }) {  // Destructure id from props
  const [topic, setTopic] = useState({}); // Holds topic data
  const [videoVisible, setVideoVisible] = useState(false); // State to toggle video visibility

  // Fetch topic data when component mounts
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await studentService.getTopic(id);
        // console.log('Response:', response);
         // Use the id prop instead of useParam
        setTopic(response);
        // console.log('Topic:', topic);
        
      } catch (error) {
        console.error('Error fetching topic:', error.message);
      }
    };
    if (id) {
      fetchTopic();
    }
  }, [id]);

  // Function to toggle video visibility
  const handleVideoToggle = () => {
    setVideoVisible(!videoVisible);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      {/* Top section: Description (with border) */}
      <div className="mb-6 text-center border-2 border-black p-4">
        <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
        <p className="text-lg">{topic.description}</p>
      </div>

      {/* Main container with flex layout */}
      <div className="flex">
        {/* Left section: Display video (with border) */}
        <div className="w-1/2 border-2 border-black p-4">
          <div className="w-full h-auto flex justify-center items-center">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              frameBorder="0"
              allowFullScreen
              title="YouTube video"
              width="560"
              height="315"
            ></iframe>
          </div>
        </div>

        {/* Right section: Button and Content (with border) */}
        <div className="w-1/2 border-2 border-black p-2 flex flex-col justify-start items-start ml-6">
          {/* Button to toggle video */}
          <button
            onClick={handleVideoToggle}
            className="bg-blue-500 text-white py-2 px-4 mb-6 rounded hover:bg-blue-700"
          >
            {videoVisible ? 'Hide Tutorial' : 'See Tutorial'}
          </button>

          {/* Conditionally render the YouTube video based on state */}
          {videoVisible && (
            <iframe
              width="400"
              height="300"
              src={topic.videoLink} // This should come from your API response
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Content section (appears below the button) */}
          <div className="text-md">
            <p>{topic.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
