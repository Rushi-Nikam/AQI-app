import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const SensorData = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    // Load and process the CSV file
    d3.csv("/Images/bus_1.csv")
      .then((sensorData) => {
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
          aqi: +d.aqi,
          originalTimestamp: new Date(+d.timestamp),
          timestamp: new Date(+d.timestamp).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        }));
        setData(modifiedData);
      })
      .catch((error) => {
        console.error("Error loading CSV file:", error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const width = 1200;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 50, left: 80 };

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const tooltip = d3.select(tooltipRef.current);

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
        .call(xAxis)
        .style("stroke", darkmode ? "#fff" : "#000");  // Change axis color based on darkmode

      // Append y-axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .style("stroke", darkmode ? "#fff" : "#000");  // Change axis color based on darkmode

      // Add axes labels
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", darkmode ? '#fff' : '#000') // Use darkmode to set the color
        .text("Time");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", darkmode ? '#fff' : '#333')  // Axis label color based on darkmode
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
        .attr("stroke", darkmode ? "cyan" : "blue")  // Line color based on darkmode
        .attr("stroke-width", 2)
        .attr("d", line);

      // Animate the line
      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        // .transition()
        // .duration(2000)
        // .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Draw scatterplot points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.originalTimestamp))
        .attr("cy", (d) => yScale(d[selectedMetric]))
        .attr("r", 3)
        .attr("fill", darkmode ? "cyan" : "blue")  // Point color based on darkmode
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`)
            .html(
              `<strong>${selectedMetric}:</strong> ${d[selectedMetric]}<br/><strong>Time:</strong> ${d.timestamp}`
            );
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    }
  }, [data, selectedMetric, darkmode]);

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
  ];

  return (
    <div className="text-center mt-5">
      <h1 className={`mb-5 font-sans text-xl font-bold ${darkmode ? "text-white" : "text-black"}`}>
        Sensor Data Graph
      </h1>
      <div
        className={`flex p-2 justify-center ${
          darkmode ? "bg-gray-500 text-gray-200" : "bg-gray-300 text-gray-800"
        } gap-4 sm:gap-2 md:gap-8 lg:gap-[20px] text-xs text-wrap lg:text-2xl sm:text-[2px] lg:px-10 rounded-2xl items-center mb-6`}
      >
        {metrics.map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 text-xs lg:text-xl rounded-2xl w-[60px] lg:w-[160px] md:w-[120px] sm:w-[20px] ${
              selectedMetric === metric
                ? "bg-blue-700 text-white"
                : darkmode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
          >
            <p className="capitalize text-xl">{metric}</p>
          </button>
        ))}
      </div>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "4px",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 10,
        }}
      ></div>
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid meet"
        className="border border-gray-400 mt-5"
      ></svg>
    </div>
  );
};

export default SensorData;
