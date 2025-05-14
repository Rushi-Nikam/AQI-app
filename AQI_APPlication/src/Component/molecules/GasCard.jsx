import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GasCard = ({ title, semititle, value = 50, maxValue = 500, isDarkMode = true }) => {
  const svgRef = useRef(null);

  // Function to get color based on AQI value
  const getAqiColor = (value) => {
    if (value <= 50) return { color: '#00b050', text: 'Good' };
    else if (value <= 100) return { color: '#92d050', text: 'Satisfactory' };
    else if (value <= 200) return { color: '#ffff00', text: 'Moderate	' };
    else if (value <= 300) return { color: '#ff9900', text: 'Poor' };
    else if (value <= 400) return { color: '#ff0000', text: 'Very Poor'};
    else return { color: '#c00000', text: 'Severe' };
  }
  // Get the color and category text
  const { color: progressColor, text } = getAqiColor(value);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 120;
    const height = 120;
    const radius = 45;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;

    // Clear previous elements before rendering new ones
    svg.selectAll('*').remove();

    // Add background circle
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', strokeWidth);

    // Add progress circle with animation
    const progressCircle = svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', progressColor)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference) // Start with full offset
      .style('transition', 'stroke 1s ease-in-out');

    // Animate the stroke-dashoffset using D3
    progressCircle.transition()
      .duration(1000) // Animation duration (1 second)
      .ease(d3.easeCubicInOut) // Smooth easing
      .attr('stroke-dashoffset', circumference * (1 - value / maxValue));

    // Add center text (value)
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(value);
  }, [value, maxValue, isDarkMode, progressColor]);

  return (
    <div className="rounded-lg flex items-center">
      {/* Left Side: SVG */}
      <div className="flex flex-col items-center">
        <svg ref={svgRef} width={120} height={120}></svg>
      </div>

      {/* Right Side: Text */}
      <div className="flex items-start ml-4 gap-5">
        <div className="text-xl">
          <div className="text-[16px] mt-2 font-semibold">{title}</div>
          <div className="text-xs mt-2 font-normal flex">{semititle}</div>
          <div className="text-[16px] font-bold flex">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default GasCard;
