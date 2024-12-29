import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';

const PredictDetails = () => {
  const { AQI } = useParams();  // Fetch the AQI from the URL parameter

  // Static data passed as value
  const value = {
    pm25: 24,
    pm10: 35,
    no2: 34,
    nh3: 45,
    so2: 66,
    tem: 12,
    Humidity: 23
  };

  // Initialize the state with the static value
  const [data, setData] = useState([]);

  useEffect(() => {
    // Convert the value object to an array for easier mapping
    const formattedData = Object.entries(value).map(([key, val]) => ({
      name: key,
      value: val
    }));

    // Update state once
    setData(formattedData);
  }, []); // Empty dependency array to ensure this effect only runs once on mount

  useEffect(() => {
    // D3 code for creating the bar chart after data is set
    const margin = { top: 100, right: 30, bottom: 20, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#bar-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the x and y scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height, 0]);

    // Create bars for the graph
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#69b3a2')
      // Add hover effect
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#ff7f0e'); // Change color on hover
        svg.append('text') // Add value label on hover
          .attr('class', 'hover-text')
          .attr('x', x(d.name) + x.bandwidth() / 2)
          .attr('y', y(d.value) - 5)
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .text(d.value);
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', '#69b3a2'); // Revert color on mouse out
        svg.selectAll('.hover-text').remove(); // Remove value label on mouse out
      });

    // Add x-axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add y-axis
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Add value labels on top of each bar (optional)
    svg.selectAll('.bar')
      .data(data)
      .enter().append('text')
      .attr('x', d => x(d.name) + x.bandwidth() / 2) // Position horizontally in the center of each bar
      .attr('y', d => y(d.value) - 5) // Position the text slightly above the bar
      .attr('text-anchor', 'middle') // Center the text horizontally
      .attr('fill', 'black') // Set text color
      .text(d => d.value); // Display the value on top of each bar

  }, [data]); // This effect depends on 'data', but the state is only set once

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Predicted AQI: {Math.floor(AQI)}</h1>

      {/* Bar chart container */}
      <svg id="bar-chart"></svg>
    </div>
  );
};

export default PredictDetails;
