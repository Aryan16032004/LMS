import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { Container } from '../index.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import studentService from '../../backend/student.js';

// Custom Next Arrow Button
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Next
    </div>
  );
}

// Custom Prev Arrow Button
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Prev
    </div>
  );
}

function StudentDashboard() {
  const [courses, setCourses] = useState([]); // State to hold the courses array
  const [className, setClassName] = useState(""); // State to hold the class name
  // const studentService = new StudentService();

  // Fetch class and courses when component mounts
  useEffect(() => {
    const fetchClassAndCourses = async () => {
      try {
        // Get the student's class ID
        const classId = await studentService.getStudentClass();

        // Get the class details using the class ID
        if (classId) {
          const classDetails = await studentService.getClassDetailsById(classId);
          setClassName(classDetails?.name || "Unknown Class"); // Set the class name
        }

        // Get the student's courses
        const coursesData = await studentService.getStudentCourses();
        // console.log("Courses Data:", coursesData);
        
        if (Array.isArray(coursesData)) {
          const courseArray = coursesData.map((course) => ({
            _id: course._id,
            courseName: course.name,
          }));
          setCourses(courseArray); // Set the courses array
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchClassAndCourses();
  }, []);

  // Slider settings for slick-carousel
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Container>
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-screen-xl pt-20 relative">
          {/* Display Class Name as Heading */}
          <h2 className="text-3xl font-bold mb-4 text-center">{className}</h2>

          {/* Slider to display courses */}
          <Slider {...settings}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="p-2">
                  <Link to={`/course/${course._id}`}>
                    <div className="w-full h-32 border border-solid border-black flex flex-col items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-200">
                      <span className="text-lg font-medium">{course.courseName}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div>No courses available</div>
            )}
          </Slider>
        </div>

        {/* Custom styles for the carousel navigation buttons */}
        <style>{`
          .custom-arrow {
            position: absolute;
            top: 50%;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            z-index: 1;
          }
          .custom-next {
            right: 10px;
          }
          .custom-prev {
            left: 10px;
          }
        `}</style>
      </div>
    </Container>
  );
}

export default StudentDashboard;
