import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GasCard = ({ title, value = 50, maxValue = 500, text = 'Good', isDarkMode = true }) => {
  const svgRef = useRef(null);

  // Function to get color based on AQI value
  const getAqiColor = (value) => {
    if (value <= 50) return { color: 'rgb(76, 175, 80)', text: 'Good' }; 
    else if (value <= 100) return { color: 'rgb(255, 235, 59)', text: 'Moderate' }; 
    else if (value <= 200) return { color: 'rgb(255, 152, 0)', text: 'Unhealthy for Sensitive Groups' }; 
    else if (value <= 300) return { color: 'rgb(244, 67, 54)', text: 'Unhealthy' }; 
    else if (value <= 400) return { color: 'rgb(156, 39, 176)', text: 'Very Unhealthy' }; 
    else return { color: 'rgb(139, 0, 0)', text: 'Hazardous' }; 
  };
  
  // Get the color and text
  const aqiData = getAqiColor(value);
  
  // Pass the color to progressColor
  const progressColor = aqiData.color;
  text = aqiData.text;
  // console.log(progressColor); // Outputs the color based on the value
  

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 120;
    const height = 120;
    const radius = 45;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;

    // Clear previous SVG elements
    svg.selectAll('*').remove();

    // Add background circle
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', strokeWidth);

    // Add progress circle
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', progressColor)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference * (1 - value / maxValue))
      .style('transition', 'stroke-dashoffset 0.5s ease-in-out');

    // Add center text (value)
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(value);
  }, [value, maxValue, isDarkMode, progressColor]);

  return (
    <div
    className={` rounded-lg flex items-center   
     `}
  >
    {/* Left Side: SVG and Title */}
    <div className="flex flex-col items-center">
      <svg ref={svgRef} width={120} height={120}></svg>
    </div>
  
    {/* Right Side: Text */}
    <div className="flex flex-col items-start ml-4">
      <div
        className="text-4xl  mb-2" >
      <div className="text-xl mt-2">{title}</div>
       <div className='text-[16px] font-bold'>{text}</div> 
      </div>
    </div>
  </div>
  
  );
};

export default GasCard;
