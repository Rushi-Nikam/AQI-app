import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 p-5 ">
      <input
        type="text"
        placeholder="Search locality..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default Search;
