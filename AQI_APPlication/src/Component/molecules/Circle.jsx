import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Circle = ({ aqiValue = 50, maxAqi = 500, isDarkMode }) => {
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
  const radius = 80;
  const strokeWidth = 12;

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 200;
    const height = 200;
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

    // Add AQI text
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .text(validAqiValue);
  }, [validAqiValue, validMaxAqi, color, isDarkMode]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} width={200} height={200}></svg>
      <div className={`text-xl mt-2 ${isDarkMode ? 'text-white' : '#111830'}`}>{text}</div>
    </div>
  );
};

export default Circle;
