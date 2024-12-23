import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Circle2 = ({ aqiValue = 50, maxAqi = 500, isDarkMode }) => {
  const svgRef = useRef(null);

  const validAqiValue = isNaN(aqiValue) ? 0 : aqiValue;
  const validMaxAqi = isNaN(maxAqi) || maxAqi === 0 ? 500 : maxAqi;

  const getStrokeColorAndText = (aqi) => {
    if (aqi <= 50) return { color: 'rgb(76, 175, 80)', text: 'Good' };
    if (aqi <= 100) return { color: 'rgb(255, 235, 59)', text: 'Moderate' };
    if (aqi <= 200) return { color: 'rgb(255, 152, 0)', text: 'Unhealthy for Sensitive Groups' };
    if (aqi <= 300) return { color: 'rgb(244, 67, 54)', text: 'Unhealthy' };
    if (aqi <= 400) return { color: 'rgb(156, 39, 176)', text: 'Very Unhealthy' };
    return { color: 'rgb(139, 0, 0)', text: 'Hazardous' };
  };

  const { color, text } = getStrokeColorAndText(validAqiValue);
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 200;
    const height = 200;

    // Select or create background circle
    const bgCircle = svg.selectAll('.bg-circle').data([null]);
    bgCircle
      .enter()
      .append('circle')
      .attr('class', 'bg-circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke-width', strokeWidth)
      .merge(bgCircle)
      .attr('stroke', isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(69, 63, 63, 0.25)');

    // Select or create progress circle
    const progressCircle = svg.selectAll('.progress-circle').data([null]);
    progressCircle
      .enter()
      .append('circle')
      .attr('class', 'progress-circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', circumference)
      .style('transition', 'stroke-dashoffset 0.5s ease-in-out')
      .merge(progressCircle)
      .attr('stroke', color)
      .attr('stroke-dashoffset', circumference * (1 - validAqiValue / validMaxAqi));

    // Select or create text element
    const textElement = svg.selectAll('.aqi-text').data([null]);
    textElement
      .enter()
      .append('text')
      .attr('class', 'aqi-text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .merge(textElement)
      .attr('fill', isDarkMode ? 'white' : '#111830')
      .text(validAqiValue);
  }, [validAqiValue, validMaxAqi, color, isDarkMode, circumference]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} width={200} height={200} aria-label={`AQI: ${validAqiValue} - ${text}`}>
        <title>{`AQI: ${validAqiValue} (${text})`}</title>
      </svg>
      <div className={`text-xl text-center mt-2 ${isDarkMode ? 'text-white' : '#111830'}`}>{text}</div>
    </div>
  );
};

export default Circle2;
