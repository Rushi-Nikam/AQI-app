import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ apiUrl = "http://34.30.30.232:8000/aqi_values/get_data", isDarkMode = true }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the CSV data from the API
    fetch(apiUrl)
      .then(response => response.text())  // Get the response as text (CSV)
      .then(csvData => {
        // Parse the CSV data
        d3.csvParse(csvData, (d) => {
          // Process the data, converting the required fields to numbers
          d.aqi = +d.aqi;
          d.timestamp = new Date(Number(d.timestamp));  // Convert timestamp to Date object
          return d;
        }).then(parsedData => {
          setData(parsedData);  // Store the parsed data in state
        });
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, [apiUrl]);

  useEffect(() => {
    if (data.length === 0) return; // Don't render if no data is loaded

    // Chart dimensions
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create the horizontal scale and its axis generator (timestamp as x-axis)
    const x = d3.scaleBand()
      .domain(data.map(d => d.timestamp))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const xAxis = d3.axisBottom(x)
      .tickSizeOuter(0)
      .tickFormat(d3.timeFormat("%H:%M"));  // Format timestamp for better readability

    // Create the vertical scale (AQI as y-axis)
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.aqi)]).nice()
      .range([height - marginBottom, marginTop]);

    // Create the SVG container and apply zoom behavior
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;")
      .call(zoom);

    // Append the bars
    svg.selectAll(".bars")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.timestamp))  // Position each bar according to the timestamp
      .attr("y", d => y(d.aqi))  // Height of the bar is based on the AQI value
      .attr("height", d => y(0) - y(d.aqi))  // Set the height of the bar
      .attr("width", x.bandwidth())  // Set the width of each bar
      .attr("fill", isDarkMode ? "steelblue" : "orange");

    // Append the axes
    svg.selectAll(".x-axis")
      .data([data])
      .join("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    svg.selectAll(".y-axis")
      .data([data])
      .join("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());

  }, [data, isDarkMode]);

  // Zoom behavior
  function zoom(svg) {
    const extent = [[0, 0], [928, 500]];

    svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed));

    function zoomed(event) {
      const x = d3.scaleBand()
        .domain(data.map(d => d.timestamp))
        .range([0, 928])
        .padding(0.1);

      svg.selectAll(".bars rect")
        .attr("x", d => x(d.timestamp))
        .attr("width", x.bandwidth());

      svg.selectAll(".x-axis").call(d3.axisBottom(x).tickSizeOuter(0));
    }
  }

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
