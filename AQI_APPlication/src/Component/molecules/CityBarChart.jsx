import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CityBarChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/data')  // Ensure this matches your backend route
      .then((response) => response.json())
      .then((data) => {
        // Parse the timestamp into Date objects
        const parsedData = data.map(d => {
          d.timestamp = new Date(d.timestamp); // Convert timestamp to Date
          return d;
        });
        setData(parsedData);
        // console.log(parsedData);  // Check the structure of the fetched data
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    // Set up the SVG container
    const width = 900;
    const height = 500;
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Clear previous content
    svg.selectAll('*').remove();

    // Set up the time scale for x-axis
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.timestamp))  // Using timestamps as discrete values
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // Set up the y-axis scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.so2, d.no2, d.co, d.pm25, d.pm10, d.o3))])  // Removed aqi
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Set up the axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M'));  // Format the time axis labels
    const yAxis = d3.axisLeft(yScale);

    // Append axes to the SVG
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Time');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text('Pollutant Value');

    // Define colors for each pollutant (removed aqi)
    const colors = {
      so2: 'red',
      no2: 'purple',
      co: 'green',
      pm25: 'orange',
      pm10: 'brown',
      o3: 'pink',
    };

    // Create the tooltip div and make it initially invisible
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '4px');

    // Plot bars for each pollutant
    Object.keys(colors).forEach((pollutant) => {
      svg.selectAll(`.${pollutant}`)
        .data(data)
        .enter()
        .append('rect')
        .attr('class', pollutant)
        .attr('x', (d) => xScale(d.timestamp))  // Positioning on x-axis (time)
        .attr('y', (d) => yScale(d[pollutant]))  // Positioning on y-axis
        .attr('width', xScale.bandwidth())  // Width of each bar
        .attr('height', (d) => height - margin.bottom - yScale(d[pollutant]))  // Height of each bar
        .attr('fill', colors[pollutant])
        .on('mouseover', (event, d) => {
          tooltip.style('visibility', 'visible')
            .text(`${pollutant.toUpperCase()}: ${d[pollutant]}`)
            .style('left', `${event.pageX + 5}px`)  // Tooltip position on the x-axis
            .style('top', `${event.pageY - 28}px`);  // Tooltip position on the y-axis
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });

      // Add labels on top of each bar (Pollutant value in this case)
      svg.selectAll(`.${pollutant}-label`)
        .data(data)
        .enter()
        .append('text')
        .attr('class', `${pollutant}-label`)
        .attr('x', (d) => xScale(d.timestamp) + xScale.bandwidth() / 2)  // Position label on the x-axis
        .attr('y', (d) => yScale(d[pollutant]) - 5)  // Position label above the bar
        .attr('text-anchor', 'middle')
        .text((d) => d[pollutant]);
    });
  }, [data]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CityBarChart;
