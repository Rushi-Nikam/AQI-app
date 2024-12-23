import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PollScatter = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/data')  // Ensure this matches your backend route
      .then((response) => response.json())
      .then((data) => {
        // Modify the timestamp format as needed
        const modifiedData = data.map(d => {
          // Use JavaScript's Date object to parse the timestamp in UTC
          const newTimestamp = new Date(d.timestamp);
          // Check if timestamp is valid and format it
          if (isNaN(newTimestamp)) {
            console.error("Invalid timestamp:", d.timestamp);
          } else {
            d.timestamp = newTimestamp;
          }
          return d;
        });

        setData(modifiedData);
        // console.log(modifiedData);  // Check the structure of the modified data
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

    // Set up the scales
    const xScale = d3.scaleTime()
      .domain([d3.min(data, (d) => d.timestamp), d3.max(data, (d) => d.timestamp)])  // Time range based on the data
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 500])  // AQI range from 0 to 500+
      .range([height - margin.bottom, margin.top]);

    // Set up the axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M"));
    const yAxis = d3.axisLeft(yScale).ticks(5);

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
      .text('AQI');

    // Define colors for each pollutant
    const colors = {
      aqi: 'blue',
      so2: 'red',
      co: 'green',
      no2: 'purple',
      pm25: 'orange',
      pm10: 'brown',
      o3: 'pink',
    };

    // Plot circles (scatter points) and lines for each pollutant
    Object.keys(colors).forEach((pollutant) => {
      // Line generator
      const line = d3.line()
        .x((d) => xScale(d.timestamp))  // Time for x position
        .y((d) => yScale(d[pollutant]));  // Dynamic pollutant value for y position

      // Draw line connecting the points with animation
      svg.append('path')
        .data([data])
        .attr('class', `${pollutant}-line`)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', colors[pollutant])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', function () {
          return this.getTotalLength();
        })
        .attr('stroke-dashoffset', function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);  // Animation to draw the line

      // Draw scatter points (circles) with animation
      svg.selectAll(`.${pollutant}-circle`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `${pollutant}-circle`)
        .attr('cx', (d) => xScale(d.timestamp))  // Time for x position
        .attr('cy', (d) => yScale(d[pollutant]))  // Pollutant value for y position
        .attr('r', 0)  // Initial radius of the circle (start small)
        .attr('fill', colors[pollutant])
        .on('mouseover', (event, d) => {
          // Tooltip
          d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'visible')
            .style('background-color', 'rgba(0,0,0,0.7)')
            .style('color', 'white')
            .style('padding', '5px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .text(`${pollutant.toUpperCase()}: ${d[pollutant]}\nTime: ${d3.timeFormat("%H:%M")(d.timestamp)}`)
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          d3.selectAll('.tooltip').remove();  // Remove tooltip when mouse leaves
        })
        .transition()
        .duration(1000)  // Animation duration
        .attr('r', 5);  // Grow the circle to its final radius
    });
  }, [data]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PollScatter;
