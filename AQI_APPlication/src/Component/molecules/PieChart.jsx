import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = () => {
  const [data, setData] = useState([]); // State for data
  const chartRef = useRef(null); // Reference for the SVG element

  useEffect(() => {
    // Fetch the JSON file
    fetch('/MOCK_DATA.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Update state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching the JSON:', error);
      });
  }, []);

  useEffect(() => {
    // Render the pie chart when data is updated
    if (data.length > 0) {
      drawPieChart();
    }
  }, [data]);

  const drawPieChart = () => {
    const svgWidth = 400;
    const svgHeight = 400;
    const radius = Math.min(svgWidth, svgHeight) / 2;

    // Remove existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3
      .select(chartRef.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr(
        'transform',
        `translate(${svgWidth / 2}, ${svgHeight / 2})`
      );

    // Prepare the data for the pie chart (e.g., AQI distribution)
    const aqiData = data.reduce((acc, item) => {
      const range = Math.floor(item.aqi / 50) * 50; // Group AQI into ranges of 50
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(aqiData).map(([range, count]) => ({
      range,
      count,
    }));

    const pie = d3.pie().value((d) => d.count);
    const arcs = pie(pieData);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Draw the pie chart
    svg
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    svg
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .text((d) => `${d.data.range}-${+d.data.range + 49}: ${d.data.count}`);
  };

  return (
    <div>
      <h1>Air Quality Index Data</h1>
      {/* <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Timestamp</th>
            <th>AQI</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>CO</th>
            <th>NO2</th>
            <th>SO2</th>
            <th>O3</th>
            <th>Temperature</th>
            <th>Humidity</th>
          </tr>
        </thead>
        <tbody>
         {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.location}</td>
              <td>{item.timestamp}</td>
              <td>{item.aqi}</td>
              <td>{item.pm2_5}</td>
              <td>{item.pm10}</td>
              <td>{item.co}</td>
              <td>{item.no2}</td>
              <td>{item.so2}</td>
              <td>{item.o3}</td>
              <td>{item.temprature}</td>
              <td>{item.humidity}</td>
            </tr>
          ))} 
        </tbody>
      </table> */}

      <div>
        <h2>AQI Pie Chart</h2>
        <svg ref={chartRef}></svg>
      </div>
    </div>
  );
};

export default PieChart;
