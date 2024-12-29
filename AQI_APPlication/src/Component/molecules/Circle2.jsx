import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const pollutantRanges = {
  pm25: { max: 500, levels: [50, 100, 250, 350, 500], labels: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], colors: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b0000'] },
  pm10: { max: 600, levels: [50, 100, 260, 430, 600], labels: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], colors: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b0000'] },
  co: { max: 50, levels: [1, 2, 10, 17, 34], labels: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], colors: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b0000'] },
  no2: { max: 400, levels: [40, 80, 180, 280, 400], labels: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], colors: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b0000'] },
  nh3: { max: 200, levels: [20, 50, 100, 150, 200], labels: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], colors: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b0000'] },
};

const Circle2 = ({ pollutant = 'pm25', value = 50, isDarkMode = false }) => {
  const svgRef = useRef(null);
  const range = pollutantRanges[pollutant] || pollutantRanges['pm25'];

  const getStrokeColorAndText = (value) => {
    for (let i = 0; i < range.levels.length; i++) {
      if (value <= range.levels[i]) {
        return { color: range.colors[i], text: range.labels[i] };
      }
    }
    return { color: range.colors[range.colors.length - 1], text: range.labels[range.labels.length - 1] };
  };

  const { color, text } = getStrokeColorAndText(value);
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
      .attr('stroke-dashoffset', circumference * (1 - value / range.max));

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
      .text(value);
  }, [value, range, color, isDarkMode, circumference]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} width={200} height={200} aria-label={`${pollutant.toUpperCase()} Level: ${value} - ${text}`}>
        <title>{`${pollutant.toUpperCase()}: ${value} (${text})`}</title>
      </svg>
      <div className={`text-xl text-center mt-2 ${isDarkMode ? 'text-white' : '#111830'}`}>{text}</div>
    </div>
  );
};

export default Circle2;
