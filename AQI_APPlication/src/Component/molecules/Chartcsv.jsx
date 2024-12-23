import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Chartcsv = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    // Set chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG before rendering new one
    d3.select(svgRef.current).select('svg').remove();

    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x scale (based on index)
    const x = d3
      .scaleBand()
      .domain(data.map((d, i) => i)) // Use the index as the x-axis value
      .range([0, width])
      .padding(0.1);

    // Create y scale (based on the pm25 value)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => +d.pm25)]) // Find the max value of pm25
      .nice()
      .range([height, 0]);

    // Add the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append('g').call(d3.axisLeft(y));

    // Create bars for the bar chart
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => x(i)) // Position bars based on index
      .attr('y', d => y(+d.pm25)) // Position bars based on pm25 value
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(+d.temperature))
      .attr('fill', 'steelblue');
  };

  return <div ref={svgRef}></div>;
};

export default Chartcsv;
