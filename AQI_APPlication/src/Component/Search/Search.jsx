import React from 'react';

const Search = ({ searchTerm, setSearchTerm, isDarkMode }) => {
  return (
    <div className={`mb-4 p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <input
        type="text"
        placeholder="Search locality..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-300 placeholder-gray-400'
            : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 placeholder-gray-500'
        }`}
      />
    </div>
  );
};

export default Search;
