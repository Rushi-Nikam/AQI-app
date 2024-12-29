import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';

const AQIChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  // Handle file upload and parse CSV data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Parse timestamp and convert to Date
          const parsedData = result.data.map((row) => ({
            timestamp: new Date(Number(row.timestamp)),
            aqi: parseFloat(row.aqi),
          }));
          setData(parsedData);
        },
        header: true, // Treat first row as header
      });
    }
  };

  // Create D3 chart
  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 928;
    const height = 600;

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.timestamp))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.aqi)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.aqi));

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear any previous content

    // Append the line path
    svg.append('path')
      .data([data])
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Append the x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Append the y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add the axis labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height - 10})`)
      .style('text-anchor', 'middle')
      .text('Date');

    svg.append('text')
      .attr('transform', `translate(${15},${height / 2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('AQI');

  }, [data]);

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AQIChart;
