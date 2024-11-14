import React from 'react';
import { useSelector } from 'react-redux';
import { Course as TeacherCourse } from '../Component/TeacherDashboard/Course.jsx';
import {Course as StudentCourse} from "../Component/StudentDasboard/Course.jsx"
// import AdminDashboard from '../Component/AdminDashboard/AdminDashboard';

function CoursePage() {
  // Access the userType from Redux store
  const userType = useSelector((state) => state.auth.userRole);

  return (
    <div>
      {userType === 'student' && <StudentCourse/>}
      {userType === 'teacher' && <TeacherCourse />}
      {/* {userType === 'admin' && <AdminDashboard />} */}
      {!userType && <p>Loading...</p>}
    </div>
  );
}

export default CoursePage;
