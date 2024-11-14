import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from '../Component/StudentDasboard/StudentDashboard';
import TeacherDashboard from '../Component/TeacherDashboard/TeacherDashboard';
// import AdminDashboard from '../Component/AdminDashboard/AdminDashboard';

function Dashboard() {
  // Access the userType from Redux store
  const userType = useSelector((state) => state.auth.userRole);

  return (
    <div>
      {userType === 'student' && <StudentDashboard />}
      {userType === 'teacher' && <TeacherDashboard />}
      {/* {userType === 'admin' && <AdminDashboard />} */}
      {!userType && <p>Loading...</p>}
    </div>
  );
}

export default Dashboard;
