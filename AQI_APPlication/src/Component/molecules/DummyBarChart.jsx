import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DummyBarChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Fetch the data from the API
    fetch('http://localhost:5000/api/city')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log({ data });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    // Set up the SVG container
    const w = 1200;
    const h = 600;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('margin-top', '50px');

    // Clear any previous content
    svg.selectAll('*').remove();

    // Set up the scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.locality)) // We will use locality as the x-axis
      .range([margin.left, w - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.aqi, d.so2, d.co, d.no2, d.pm25, d.pm10, d.o3))])
      .range([h - margin.bottom, margin.top]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').attr('transform', `translate(0, ${h - margin.bottom})`).call(xAxis);
    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(yAxis);

    // Add labels
    svg
      .append('text')
      .attr('x', w / 2)
      .attr('y', h - 10)
      .attr('text-anchor', 'middle')
      .text('Locality');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Pollutant Value');

    // Define color scale based on AQI
    const getColor = (aqi) => {
      if (aqi <= 50) return 'green'; // Good
      if (aqi <= 100) return 'yellow'; // Moderate
      if (aqi <= 150) return 'orange'; // Unhealthy for Sensitive People
      if (aqi <= 200) return 'red'; // Unhealthy
      if (aqi <= 300) return 'purple'; // Very Unhealthy
      return 'brown'; // Hazardous
    };

    // Plot each pollutant with a different color
    const bars = svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.locality)) // x position of bars
      .attr('y', h - margin.bottom) // Start from the bottom
      .attr('width', xScale.bandwidth())
      .attr('height', 0) // Start with no height
      .attr('fill', (d) => getColor(d.aqi)) // color based on AQI value
      
     
    // Animate the bars to grow in height
    bars
      .transition()
      .duration(1000)
      .attr('y', (d) => yScale(d.aqi)) // Move bars up to the correct height
      .attr('height', (d) => h - margin.bottom - yScale(d.aqi)); // Set the correct height

    // Add AQI value on top of each bar with fade-in animation
    svg
      .selectAll('.aqi-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'aqi-text')
      .attr('x', (d) => xScale(d.locality) + xScale.bandwidth() / 2) // Center text over the bar
      .attr('y', (d) => yScale(d.aqi) - 5) // Position slightly above the bar
      .attr('text-anchor', 'middle')
      .attr('fill', 'black') // Ensure visibility
      .attr('font-weight', 'bold') // Bold text
      .text((d) => d.aqi)
      .style('opacity', 0) // Start with opacity 0 (invisible)
      .transition() // Add fade-in transition
      .duration(1000)
      .style('opacity', 1); // Fade in to full opacity

  }, [data]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DummyBarChart;
