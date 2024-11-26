import React from 'react';

const Circle = ({ aqiValue = 50, maxAqi = 500, isDarkMode }) => {
  // Ensure aqiValue and maxAqi are numbers
  const validAqiValue = isNaN(aqiValue) ? 0 : aqiValue;
  const validMaxAqi = isNaN(maxAqi) || maxAqi === 0 ? 500 : maxAqi; // Avoid division by zero

  // Function to determine stroke color and text based on AQI value
  const getStrokeColorAndText = (aqi) => {
    if (aqi <= 50) return { color: 'rgb(76, 175, 80)', text: 'Good' }; // Good (Green)
    else if (aqi <= 100) return { color: 'rgb(255, 235, 59)', text: 'Moderate' }; // Moderate (Yellow)
    else if (aqi <= 200) return { color: 'rgb(255, 152, 0)', text: 'Unhealthy for Sensitive Groups' }; // Unhealthy for Sensitive Groups (Orange)
    else if (aqi <= 300) return { color: 'rgb(244, 67, 54)', text: 'Unhealthy' }; // Unhealthy (Red)
    else if (aqi <= 400) return { color: 'rgb(156, 39, 176)', text: 'Very Unhealthy' }; // Very Unhealthy (Purple)
    else return { color: 'rgb(139, 0, 0)', text: 'Hazardous' }; // Hazardous (Maroon)
  };

  // Get stroke color and text based on AQI value
  const { color, text } = getStrokeColorAndText(validAqiValue);

  // Calculate the percentage of the AQI value to determine the stroke offset
  const percentage = Math.min(validAqiValue / validMaxAqi, 1); // Convert to a value between 0 and 1
  const radius = 80; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset = circumference * (1 - percentage); // Offset to create the effect of filling

  return (
    <div className="flex flex-col items-center justify-center">
      {/* SVG Circle */}
      <svg width="200" height="220"> {/* Adjust width and height */}
        <circle
          cx="100" // Center x position
          cy="100" // Center y position
          r={radius}
          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(69, 63, 63, 0.25)'} // Remaining border color
          strokeWidth="12" // Stroke width
          fill="transparent"
        />

        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color} // Color based on AQI
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`} // Total length of the stroke
          strokeDashoffset={strokeDashoffset} // Dynamic offset to create filling effect
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} // Transition effect
        />

        {/* Centered AQI Value Text */}
        <text
          x="100" // Center x position
          y="105" // Center y position
          textAnchor="middle" // Center the text
          fill={isDarkMode ? 'white' : '#111830'} // Text color based on dark mode
          fontSize="22" // Font size
          fontWeight="bold" // Font weight
        >
          {validAqiValue}
        </text>
      </svg>

      {/* Text outside the Circle */}
      <div className={`text-xl mt-2 ${isDarkMode ? 'text-white' : '#111830'}`}>
        {text}
      </div> 
     {/* <p className='text-2xl font-bold'>CO</p>  */}
    </div>
  );
};

export default Circle;
