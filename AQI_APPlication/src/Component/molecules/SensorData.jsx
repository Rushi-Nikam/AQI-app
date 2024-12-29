import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

// Main SensorData component that accepts a dark mode prop
const SensorData = ({ darkmode }) => {
  const [data, setData] = useState([]); // State to store sensor data
  const [selectedMetric, setSelectedMetric] = useState("temperature"); // State for selected metric
  const svgRef = useRef(); // Reference to the SVG element for D3 rendering
  const tooltipRef = useRef(); // Reference to the tooltip element

  // Effect to load and process CSV data
  useEffect(() => {
    d3.csv("/Images/bus_2.csv") // Load CSV file
      .then((sensorData) => {
        const selectedData = [];
        // Select every 10th data point for reduced rendering load
        for (let i = 50; i < sensorData.length; i += 150) {
          selectedData.push(sensorData[i]);
        }

        // Convert data fields to appropriate formats
        const modifiedData = selectedData.map((d) => ({
          ...d,
          temperature: +d.temperature,
          humidity: +d.humidity,
          nh3: +d.nh3,
          no2: +d.no2,
          mq131: +d.mq131,
          mq7: +d.mq7,
          pm25: +d.pm25,
          pm10: +d.pm10,
          aqi: +d.aqi,
          originalTimestamp: new Date(+d.timestamp), // Convert timestamp to Date
          timestamp: new Date(+d.timestamp).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata", // Format timestamp
          }),
        }));
        setData(modifiedData); // Update state with processed data
      })
      .catch((error) => console.error("Error loading CSV file:", error)); // Error handling
  }, []);

  // Effect to render chart whenever data, metric, or dark mode changes
  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort(
        (a, b) => a.originalTimestamp - b.originalTimestamp
      ); // Sort data by timestamp

      const width = 1200; // SVG width
      const height = 500; // SVG height
      const margin = { top: 20, right: 20, bottom: 50, left: 80 }; // Chart margins

      const svg = d3.select(svgRef.current); // Select SVG
      svg.selectAll("*").remove(); // Clear previous chart

      const tooltip = d3.select(tooltipRef.current); // Select tooltip element

      // Create scales for X and Y axes
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(sortedData, (d) => d.originalTimestamp))
        .range([margin.left, width - margin.right]);

      let yScale = d3
        .scaleLinear()
        .domain([0, d3.max(sortedData, (d) => d[selectedMetric])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Define axes
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(d3.timeHour.every(1))
        .tickFormat(d3.timeFormat("%H"));

      const yAxis = d3.axisLeft(yScale);

      // Render X axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .style("stroke", darkmode ? "#fff" : "#000");

      // Render Y axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .style("stroke", darkmode ? "#fff" : "#000");

      // Add X axis label
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", darkmode ? "#fff" : "#000")
        .text("hourly data");

      // Add Y axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", darkmode ? "#fff" : "#333")
        .text(selectedMetric);

      // Define colors for different metrics
      const dotColor = (metric) => {
        switch (metric) {
          case "temperature":
            return "yellow";
          case "humidity":
            return "pink";
          case "mq7":
            return "black";
          case "mq131":
            return "purple";
          case "no2":
            return "green";
          case "nh3":
            return "orange";
          case "pm25":
            return "gold"
          case "pm10":
            return "red";
          case "aqi":
            return "violet";
          default:
            return darkmode ? "cyan" : "blue";
        }
      };

      // Determine metrics to render based on selection
      const metricsForDots =
        selectedMetric === "aqi"
          ? [
              "temperature",
              "humidity",
              "nh3",
              "no2",
              "mq131",
              "mq7",
              "pm25",
              "pm10",
              "aqi",
            ]
          : [selectedMetric];

      // Render lines and dots for selected metrics
      metricsForDots.forEach((metric) => {
        const lineGenerator = d3
          .line()
          .x((d) => xScale(d.originalTimestamp))
          .y((d) => yScale(d[metric]))
          .curve(d3.curveMonotoneX);

        // Render line with animation
        svg
          .append("path")
          .datum(sortedData)
          .attr("fill", "none")
          .attr("stroke", dotColor(metric))
          .attr("stroke-width", 2)
          .attr("opacity", 0.7)
          .attr("d", lineGenerator)
          .attr("stroke-dasharray", function () {
            const totalLength = this.getTotalLength();
            return `${totalLength} ${totalLength}`;
          })
          .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
          })
          .transition() // Add transition for animation
          .duration(3000) // Animation duration in milliseconds
          .ease(d3.easeCubicInOut) // Easing function
          .attr("stroke-dashoffset", 0);

        // Render dots
        svg
          .selectAll(`circle.${metric}`)
          .data(sortedData)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d.originalTimestamp))
          .attr("cy", (d) => yScale(d[metric]))
          .attr("r", 3)
          .style("cursor", "pointer")
          .attr("fill", dotColor(metric))
          .attr("opacity", 0.7)
          .on("mouseover", (event, d) => {
            tooltip
              .style("visibility", "visible")
              .style("left", `${event.pageX + 5}px`)
              .style("top", `${event.pageY - 28}px`)
              .html(
                `<strong>${metric}:</strong> ${d[metric]}<br/><strong>Time:</strong> ${d.timestamp}`
              );
          })
          .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
          });
      });
    }
  }, [data, selectedMetric, darkmode]); // Dependencies

  const metrics = [
    "temperature",
    "humidity",
    "nh3",
    "no2",
    "mq131",
    "mq7",
    "pm25",
    "pm10",
    "aqi",
  ]; // List of metrics

  return (
    <div className="text-center  mt-5">
      {/* Title */}
      <h1
        className={`mb-5 font-sans text-2xl font-bold ${
          darkmode ? "text-white" : "text-black"
        }`}
      >
        Sensor Data Graph
      </h1>

      {/* Metric selection buttons */}
      <div
        className={`flex p-2 justify-center ${
          darkmode ? "bg-gray-500 text-gray-200" : "bg-gray-300 text-gray-800"
        } gap-4 sm:gap-2 md:gap-8 lg:gap-[20px] text-xs text-wrap lg:text-2xl sm:text-[2px] lg:px-10 rounded-2xl items-center mb-6`}
      >
        {metrics.map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 text-xs lg:text-xl cursor-pointer rounded-2xl w-[60px] lg:w-[160px] md:w-[120px] sm:w-[20px] ${
              selectedMetric === metric
                ? "bg-blue-700 text-white"
                : darkmode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-400 text-gray-800"
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
  
        {/* SVG container for D3 chart */}
        <div className="flex">

      
        <svg ref={svgRef} width="1200" height="500" className="mx-auto"></svg>
  
        {/* Tooltip for hover interactions */}
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "5px",
            borderRadius: "3px",
            visibility: "hidden",
            pointerEvents: "none",
          }}
        ></div>
         <div
        className={` my-2 text-xl ${
          darkmode ? "text-white" : "text-black"
        }`}
        
      >
       
        <table className="table-auto text-center">
  <thead>
    <tr>
      <th>Color</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ color: "yellow" }}>■</td>
      <td>Temperature</td>
    </tr>
    <tr>
      <td style={{ color: "pink" }}>■</td>
      <td>Humidity</td>
    </tr>
    <tr>
      <td style={{ color: "black" }}>■</td>
      <td>MQ7</td>
    </tr>
    <tr>
      <td style={{ color: "purple" }}>■</td>
      <td>MQ131</td>
    </tr>
    <tr>
      <td style={{ color: "green" }}>■</td>
      <td>NO2</td>
    </tr>
    <tr>
      <td style={{ color: "orange" }}>■</td>
      <td>NH3</td>
    </tr>
    <tr>
      <td style={{ color: "gold" }}>■</td>
      <td>PM2.5</td>
    </tr>
    <tr>
      <td style={{ color: "red" }}>■</td>
      <td>/ PM10</td>
    </tr>
    <tr>
      <td style={{ color: "violet" }}>■</td>
      <td>AQI</td>
    </tr>
  </tbody>
</table>


      </div>
      </div>
      </div>
    );
  };
  
  export default SensorData;
  