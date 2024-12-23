import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const SensorData = () => {
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("temperature"); // Default metric
  const svgRef = useRef();

  useEffect(() => {
    // Load and process the CSV file
    d3.csv("/Images/bus_1.csv").then((sensorData) => {
      const modifiedData = sensorData.map((d) => ({
        ...d,
        temperature: +d.temperature,
        humidity: +d.humidity,
        nh3: +d.nh3,
        no2: +d.no2,
        mq131: +d.mq131,
        mq7: +d.mq7,
        pm25: +d.pm25,
        pm10: +d.pm10,
        originalTimestamp: new Date(+d.timestamp),
        timestamp: new Date(+d.timestamp).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      }));
      setData(modifiedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Set up dimensions and margins
      const width = 800;
      const height = 500;
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };

      // Clear previous SVG content
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Set up scales
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.originalTimestamp))
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[selectedMetric])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Create axes
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M:%S"));
      const yAxis = d3.axisLeft(yScale);

      // Append x-axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      // Append y-axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

      // Add axes labels
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Time");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(selectedMetric);

      // Draw line connecting points
      const line = d3
        .line()
        .x((d) => xScale(d.originalTimestamp))
        .y((d) => yScale(d[selectedMetric]));

      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add animation to the line
      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .ease(d3.easeCubicInOut) // Apply ease-in-out transition
        .duration(2000) // Animation duration in milliseconds
        .attr("stroke-dashoffset", 0);

      // Draw scatterplot points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.originalTimestamp))
        .attr("cy", (d) => yScale(d[selectedMetric]))
        .attr("r", 5)
        .attr("fill", "red")
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
          // Tooltip on hover
          d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "5px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("visibility", "visible")
            .text(`${selectedMetric}: ${d[selectedMetric]}, Time: ${d.timestamp}`)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          d3.selectAll(".tooltip").remove();
        });
    }
  }, [data, selectedMetric]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Sensor Data Scatterplot</h1>
      <label htmlFor="metric">Select Metric: </label>
      <select
        id="metric"
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
      >
        <option value="temperature">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="nh3">NH3</option>
        <option value="no2">NO2</option>
        <option value="mq131">MQ131</option>
        <option value="mq7">MQ7</option>
        <option value="pm25">PM2.5</option>
        <option value="pm10">PM10</option>
      </select>
      <svg ref={svgRef} width={800} height={500}></svg>
    </div>
  );
};

export default SensorData;
