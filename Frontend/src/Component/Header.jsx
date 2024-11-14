import React from 'react';
import {Container,Logout} from './index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  

  
  const navigate = useNavigate();
  const location = useLocation(); 

  const navItems = [
    { name: "Home", slug: "/", active: !authStatus },
  ];

  return (
    <header className='py-3 shadow-md bg-blue-200'>
      <Container>
        <nav className='flex items-center'>

        <div className='mr-4'>
          {userData && userData.data ? (
            <p className='text-lg font-semibold'>Welcome, {userData.data.name}</p>
          ) : (
            <p className='text-lg font-semibold'>Welcome, Guest</p>
          )}
        </div>

          

          <ul className='flex space-x-6 ml-auto'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 font-semibold py-2 text-gray-700 duration-200 rounded-md 
                      ${location.pathname === item.slug ? 'bg-blue-400 text-white' : 'hover:underline'}`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* Logout Button */}
            {authStatus && (
              <li>
                <Logout/>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
