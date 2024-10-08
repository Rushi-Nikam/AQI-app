import React, { useState, useEffect } from 'react';
import Search from '../Search/Search';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi"; // Import icons for menu toggle

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setBgColor('bg-white shadow');
    } else {
      setBgColor('transparent');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`flex flex-col lg:flex-row items-center justify-between w-full px-6 py-2 sticky top-0 z-50 ${bgColor}`}>
      {/* Logo and Mobile Menu Toggle */}
      <div className="flex justify-between w-full">
        <Link to="/" className='text-3xl text-blue-500 font-bold'>
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
            <div className='border-b-2  w-full my-1' /> {/* Divider */}
            <Link to="/" className='text-2xl'>
              <FaRegMoon />
            </Link>
            <div className='border-b w-full my-1' /> {/* Divider */}
            <Link to="/" className='text-3xl'>
              <IoSunnyOutline />
            </Link>
            <div className='border-b w-full my-1' /> {/* Divider */}
          </div>

          {/* Register and Login */}
          <div className='flex justify-center gap-2'>
            <Link to="/" className='bg-purple-950 text-white font-bold py-2 px-4 rounded-full'>Register</Link>
            <div className='border-b w-full my-1' /> {/* Divider */}
            <Link to="/" className='bg-purple-950 text-white font-bold py-2 px-4 rounded-full'>Login</Link>
          </div>
        </div>
      )}

      {/* Navbar Items for Larger Screens */}
      <div className={`hidden lg:flex flex-col lg:flex-row lg:items-center lg:gap-10`}>
        {/* Notification & Mode Icons */}
        <div className='flex justify-center gap-10 items-center'>
          <Link to="/" className='text-3xl'>
            <IoIosNotificationsOutline />
          </Link>
          <Link to="/" className='text-2xl'>
            <FaRegMoon />
          </Link>
          <Link to="/" className='text-3xl'>
            <IoSunnyOutline />
          </Link>
        </div>

        {/* Register and Login */}
        <div className='bg-purple-950 text-white gap-2 font-serif py-3 flex items-center px-4 rounded-full'>
          <Link to="/" className='text-lg font-bold'>Register</Link>
          <span className='text-2xl'> | </span>
          <Link to="/" className='text-lg font-bold'>Login</Link>
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
