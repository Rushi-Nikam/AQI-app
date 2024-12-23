import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Report = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load and parse the CSV file
    d3.csv("/Images/bus_1.csv").then((parsedData) => {
      const formattedData = parsedData.map((d) => ({
        temperature: +d.temperature,
        latitude: +d.latitude,
        longitude: +d.longitude,
        nh3: +d.nh3,
        no2: +d.no2,
        mq131: +d.mq131,
        mq7: +d.mq7,
        pm25: +d.pm25,
        pm10: +d.pm10,
        aqi: +d.aqi,
        humidity: +d.humidity,
        timestamp: new Date(+d.timestamp),
      }));
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    // Clear existing SVG
    d3.select("#chart").selectAll("*").remove();

    // Dimensions and margins
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    // Create SVG
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.timestamp))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.aqi)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%H:%M:%S")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Line generator
    const line = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.aqi));

    // Draw line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }, [data]);

  return (
    <div>
      <h1>Air Quality Report</h1>
      <div id="chart"></div>
    </div>
  );
};

export default Report;
