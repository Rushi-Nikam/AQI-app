import React from 'react';
import { useParams } from 'react-router-dom';

const LocalityDetail = () => {
  const { name } = useParams(); // Retrieve the locality name from the URL

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Details for {name}</h2>
      {/* Here you can fetch and display more detailed data for the locality */}
      <p>Display additional information and AQI data specific to {name}.</p>
    </div>
  );
};

export default LocalityDetail;
