import React from 'react';

const Search = ({ items }) => {
  return (
    <>
      <header className="flex justify-center items-center p-4 ">
        <div className="w-full max-w-md">
          <input
            type="text"
            name="search-form"
            id="search-form"
            placeholder="Search..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>
      </header>
    </>
  );
};

export default Search;
