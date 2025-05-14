import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Circle = ({ aqiValue = 100, maxAqi = 500, AQI = "Air Quality Index", isDarkMode }) => {
  const svgRef = useRef(null);

  const validAqiValue = isNaN(aqiValue) ? 0 : aqiValue;
  const validMaxAqi = isNaN(maxAqi) || maxAqi === 0 ? 500 : maxAqi;

  const getStrokeColorAndText = (aqi) => {
    if (aqi <= 50) return { color: '#00b050', text: 'Good' };
    else if (aqi <= 100) return { color: '#92d050', text: 'Satisfactory' };
    else if (aqi <= 200) return { color: '#ffff00', text: 'Moderate	' };
    else if (aqi <= 300) return { color: '#ff9900', text: 'Poor' };
    else if (aqi <= 400) return { color: '#ff0000', text: 'Very Poor'};
    else return { color: '#c00000', text: 'Severe' };
  };
  const { color, text } = getStrokeColorAndText(validAqiValue);

  const radius = 130;
  const strokeWidth = 50;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = radius * 2 + strokeWidth;
    const height = radius * 2 + strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const progressValue = circumference * (1 - validAqiValue / validMaxAqi);

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

    // Add progress circle with animation
    const progressCircle = svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference)
      .attr('stroke-linecap', 'round') // Smooth stroke edges
      .style('transition', 'stroke-dashoffset 0.1s ease-in-out');

    // Animate stroke
    progressCircle
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', progressValue);

    // Add AQI text inside the circle
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .style('font-size', '80px')
      .style('font-weight', 'bold')
      .text(validAqiValue)
      .style('dominant-baseline', 'middle');

    // Add category text inside the circle
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 70)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '18px')
      .style('font-weight', 'normal')
      .text(text);

    // Add AQI label text
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 40)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '20px')
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
