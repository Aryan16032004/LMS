import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import studentService from "../../backend/student.js";
import { Container } from "../index.js";
import Topic from "./Topics.jsx";// Import the Topic component

export  function Course() {
    const [topics, setTopics] = useState([]); // State to hold the array of topics
    const { id } = useParams(); // Get course ID from the URL parameters
    const [selectedTopic, setSelectedTopic] = useState(null); // To keep track of the selected topic

    // Fetch the topics when the component mounts or when id changes
    useEffect(() => {
        const fetchTopics = async () => {
            if (id) {
                try {
                    const response = await studentService.getTopicsByCourseId(id); // Fetch topics by course ID
                    // const response = response ?? []; // Defensive check for data
                    
                    if (Array.isArray(response)) {
                        setTopics(response); // Set the topics in the state
                    } else {
                        console.error("Invalid data format received", response);
                    }
                } catch (error) {
                    console.error("Error fetching topics:", error.message);
                }
            } else {
                // Handle error if no ID is present
            }
        };

        fetchTopics();
    }, [id]);

    // Handler for clicking a topic
    const handleTopicClick = (topic) => {
        setSelectedTopic(topic._id); // Set the clicked topic as selected
    };

    return (
        <Container>
            <div className="flex h-full">
                {/* Sidebar for Topics */}
                <div className="fixed top-[6rem] left-0 h-full w-[20vw] bg-white shadow-md border-r border-gray-300 z-10">
                    <header className="bg-blue-300 text-white text-xl font-semibold text-center p-4">
                        Topics
                    </header>
                    <ul className="list-disc list-inside space-y-2 mt-4 p-4">
                        {topics.map((topic) => (
                            <li
                                key={topic._id}
                                className={`cursor-pointer ${
                                    selectedTopic === topic._id
                                        ? "font-bold text-blue-500"
                                        : "font-normal"
                                }`}
                                onClick={() => handleTopicClick(topic)}
                            >
                                {topic.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right side: Conditionally render the Topic component */}
                <div className="ml-[22vw] w-full p-4">
                    {selectedTopic ? (
                        <Topic id={selectedTopic} /> // Pass the selected topic's ID as a prop to Topic
                    ) : (
                        <p>Select a topic to view details.</p> // Default message when no topic is selected
                    )}
                </div>
            </div>
        </Container>
    );
}
