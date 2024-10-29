import React, { useState, useEffect } from 'react';
import Search from '../Search/Search';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi"; // Import icons for menu toggle

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      // Set background color based on dark mode state
      setBgColor(isDarkMode ? 'bg-[#111827] shadow' : 'bg-white shadow');
    } else {
      setBgColor('transparent');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDarkMode]); // Add isDarkMode as a dependency

  return (
    <header className={`flex flex-col lg:flex-row items-center   w-full px-6 py-2 sticky top-0 z-[60] ${bgColor}`}>
      {/* Logo and Mobile Menu Toggle */}
      <div className="flex justify-between   w-full">
        <Link to="/" className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-purple-500'>
          AQI
        </Link>
     
  
        <div className="block lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX className='text-3xl' /> : <HiMenu className='text-3xl' />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='hidden lg:flex w-full max-w-md relative'>
        <div className='absolute inset-y-0 left-48 flex items-center pl-3'>
          <FaSearch className='text-gray-500' />
        </div>
        <Search className="pl-10" />
      </div>

      {/* Mobile Menu Items */}
      {isMobileMenuOpen && (
        <div className="grid lg:hidden mt-4 gap-4">
          {/* Notification & Mode Icons */}
          <div className='flex flex-col items-center'>
            <Link to="/" className='text-3xl'>
              <IoIosNotificationsOutline />
            </Link>
            <div className='border-b-2 w-full my-1' /> {/* Divider */}
            <div onClick={() => setIsDarkMode(!isDarkMode)} className='text-2xl text-black cursor-pointer'>
          
              {isDarkMode? <FaRegMoon /> : <IoSunnyOutline />}
            </div>
            <div className='border-b w-full my-1' /> {/* Divider */}
          </div>

          
        </div>
      )}

      {/* Navbar Items for Larger Screens */}
      <div className={`hidden lg:flex flex-col lg:flex-row lg:items-center lg:gap-10`}>
        {/* Notification & Mode Icons */}
        <div className='flex justify-center gap-10 items-center'>
          <Link to="/" className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl`}>
            <IoIosNotificationsOutline />
          </Link>
          <div onClick={() => setIsDarkMode(!isDarkMode)} className={`text-3xl cursor-pointer ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {isDarkMode ? <FaRegMoon /> : <IoSunnyOutline />}
          </div>
        </div>
      </div>

      {/* Search Bar for Mobile */}
      <div className={`lg:hidden w-full max-w-md relative mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className='absolute inset-y-0 left-96 flex items-center pl-3'>
          <FaSearch className='text-gray-500' />
        </div>
        <Search className="pl-10" />
      </div>
    </header>
  );
};

export default Navbar;
