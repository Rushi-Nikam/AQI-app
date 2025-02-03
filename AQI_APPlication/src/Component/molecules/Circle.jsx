import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Circle = ({ aqiValue = 50, maxAqi = 500, AQI = "Air Quality Index", isDarkMode }) => {
  const svgRef = useRef(null);

  const validAqiValue = isNaN(aqiValue) ? 0 : aqiValue;
  const validMaxAqi = isNaN(maxAqi) || maxAqi === 0 ? 500 : maxAqi;

  const getStrokeColorAndText = (aqi) => {
    if (aqi <= 50) return { color: 'rgb(76, 175, 80)', text: 'Good' };
    else if (aqi <= 100) return { color: 'rgb(255, 235, 59)', text: 'Moderate' };
    else if (aqi <= 200) return { color: 'rgb(255, 152, 0)', text: 'Unhealthy for Sensitive Groups' };
    else if (aqi <= 300) return { color: 'rgb(244, 67, 54)', text: 'Unhealthy' };
    else if (aqi <= 400) return { color: 'rgb(156, 39, 176)', text: 'Very Unhealthy' };
    else return { color: 'rgb(139, 0, 0)', text: 'Hazardous' };
  };

  const { color, text } = getStrokeColorAndText(validAqiValue);

  // Increased radius and stroke width
  const radius = 200;
  const strokeWidth = 100; // Adjusted stroke width

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = radius * 2 + strokeWidth; // Added strokeWidth to width
    const height = radius * 2 + strokeWidth; // Added strokeWidth to height
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
      .attr('stroke', isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(69, 63, 63, 0.25)')
      .attr('stroke-width', strokeWidth);

    // Add progress circle
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference * (1 - validAqiValue / validMaxAqi))
      .style('transition', 'stroke-dashoffset 0.5s ease-in-out');

    // Add AQI text inside the circle
    svg
  .append('text')
  .attr('x', width / 2) // Horizontal center
  .attr('y', height / 2 +15) // Start from center with a gap from top
  .attr('text-anchor', 'middle')
  .attr('fill', color)
  .style('font-size', '80px') // Adjusted font size for AQI value
  .style('font-weight', 'bold')
  .text(validAqiValue)
  .style('dominant-baseline', 'middle'); // Centers the text vertically with respect to its 'y' position

  

    // Add category text inside the circle
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 70) // Adjusted to position category text below AQI value
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '18px') // Adjusted font size for category text
      .style('font-weight', 'normal')
      .text(text);

    // Add AQI label text
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 40) // Adjusted to position AQI label text above AQI value
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '20px') // Adjusted font size for AQI label
      .style('font-weight', 'bold')
      .text(AQI);
  }, [validAqiValue, validMaxAqi, color, isDarkMode]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}></svg>
    </div>
  );
};

export default Circle;
