import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaSearch, FaRegMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { FaChevronDown , FaChevronUp } from "react-icons/fa6";

const Navbar = ({ isDarkMode=true, setIsDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  // Use this for pathname checking

  const handleScroll = () => {
    setBgColor(window.scrollY > 50 ? (isDarkMode ? 'bg-[#111827] shadow' : 'bg-white shadow') : 'transparent');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDarkMode]);

  // Default dark mode is set to true
  useEffect(() => {
    if (isDarkMode === undefined) {
      setIsDarkMode(true);  // Set dark mode to true by default if it's undefined
    }
  }, [isDarkMode, setIsDarkMode]);

  const handleSearch = (e) => {
    if (searchTerm.trim()) {
      navigate(`/locality/${searchTerm}`);
    }
  };

  return (
    <header className={`flex flex-col lg:flex-row items-center w-full px-6 py-2 sticky top-0 z-[60] ${bgColor}`}>
      <div className="flex justify-evenly w-full">
        <Link to="/" className="text-3xl lg:mr-[500px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-purple-500">
          AQI
        </Link>

      {/* Existing Map Links */}
<div className="hidden lg:flex gap-10 justify-center items-center text-center">
  <div>
    <Link to="/Leaf-map" className="flex justify-center items-center gap-1">
      Map {location.pathname === '/Leaf-map' ? <FaChevronUp /> : <FaChevronDown />}
    </Link>
  </div>
  {/* <div>
    <Link to='/Bar_chart' className='flex justify-center items-center gap-1'>BarChart {location.pathname==='/Bar_chart' ? <FaChevronUp />:<FaChevronDown />} </Link>
  </div> */}
  {/* <div>
    <Link to='/new_page' className='flex justify-center items-center gap-1'>scatter{location.pathname==='/new_page' ? <FaChevronUp />:<FaChevronDown />}</Link>
  </div> */}
</div>


        {/* Mobile Menu Button */}
        <div className="block lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`hidden lg:flex w-full max-w-md relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search location..."
          className={`pl-10 w-full py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-300'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500'
          }`}
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-3 flex items-center"
        >
          <FaSearch
            className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}
          />
        </button>
      </form>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="grid lg:hidden mt-4 gap-4">
          <Link to="/" className="text-3xl">
            {/* <IoIosNotificationsOutline /> */}
          </Link>
          <Link to='/Leaf-map' className='flex justify-center items-center gap-1'>
            Map {location.pathname === '/Leaf-map' ? <FaChevronUp /> : <FaChevronDown />}
          </Link>
          <div onClick={() => setIsDarkMode(!isDarkMode)} className="text-2xl text-black cursor-pointer">
            {isDarkMode ? <FaRegMoon /> : <IoSunnyOutline />}
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="hidden lg:flex gap-10 items-center">
        <Link to="/" className={`${isDarkMode ? 'text-white' : 'text-black'} text-2xl`}>
          {/* <IoIosNotificationsOutline /> */}
        </Link>
        <div onClick={() => setIsDarkMode(!isDarkMode)} className={`${isDarkMode ? 'text-white' : 'text-black'} text-3xl cursor-pointer`}>
          {isDarkMode ? <FaRegMoon /> : <IoSunnyOutline />}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`lg:hidden w-full max-w-md relative mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search location..."
          className={`pl-10 w-full py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-300'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500'
          }`}
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-3 flex items-center"
        >
          <FaSearch
            className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}
          />
        </button>
      </form>
    </header>
  );
};

export default Navbar;
