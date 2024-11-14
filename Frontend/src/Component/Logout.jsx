import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../backend/Auth';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function LogoutBtn() {
  const navigate = useNavigate(); // Corrected to use the hook
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);

  const logoutHandler = async () => {
    try {
      await authService.logout(userRole); // Wait for the logout to complete
      dispatch(logout()); // Dispatch the logout action
      navigate("/"); // Navigate to the login page
    } catch (error) {
      console.error("Logout failed:", error); // Handle any potential errors
    }
  };

  return (
    <button
      className='font-bold text-white bg-red-600 px-5 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300'
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
