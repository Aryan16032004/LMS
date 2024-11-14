import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from '../index.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import teacherService from '../../backend/teacher.js';

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

function TeacherDashboard() {
  const teacherId = useSelector((state) => state.auth.userData.data._id);
  // console.log("Teacher ID:", teacherId); // Log teacher ID

  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});

  useEffect(() => {
    const fetchClassAndCourses = async () => {
      try {
        // console.log("Fetching courses for teacher ID:", teacherId);

        // Fetch courses for the teacher
        const coursesData = await teacherService.getTeacherCourses(teacherId);
        console.log("Fetched Courses Data:", coursesData);

        if (Array.isArray(coursesData)) {
          const courseArray = coursesData.map((course) => ({
            _id: course._id,
            courseName: course.name,
          }));
          setCourses(courseArray);
          // console.log("Set Courses Array:", courseArray);

          // Fetch details for each course (topics and students)
          const details = {};
          for (let course of courseArray) {
            // const topics = await teacherService.getTopicsByCourseId(course._id);
            const students = await teacherService.getCourseStudents(course._id);
            // console.log(`Fetched Students for Course ID ${course._id}:`, students);

            details[course._id] = {
              students: students, // Assuming `students` follows the structure you've shown
            };
          }
          setCourseDetails(details);
          // console.log("Set Course Details:", details);
        } else {
          // console.log("Courses data is not an array or is empty");
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchClassAndCourses();
  }, [teacherId]);

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

        {/* Table to display topics, classes, and students */}
        {courses.map((course) => (
          <div key={course._id} className="w-full max-w-screen-xl mt-10">
            <h2 className="text-2xl font-semibold mb-4">{course.courseName}</h2>

            {courseDetails[course._id] ? (
              <table className="w-full border border-gray-300 rounded-md">
                <thead>
                  <tr>
                    <th className="p-3 border border-gray-300 bg-gray-200">Course Topics</th>
                    <th className="p-3 border border-gray-300 bg-gray-200">Classes & Students</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="p-3 border border-gray-300">{course.courseName}</td>
                      <td className="p-3 border border-gray-300">
                        {Object.entries(courseDetails[course._id].students).map(([className, students], classIndex) => (
                          <div key={classIndex} className="mb-4">
                            <div className="font-semibold">{className}</div>
                            <ul className="list-disc ml-5">
                              {students.map((student, studentIndex) => (
                                <li key={studentIndex}>{student}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No details available for {course.courseName}</div>
            )}
          </div>
        ))}

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

export default TeacherDashboard;
