import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const SensorDatas = ({ darkMode }) => {
  const [data, setData] = useState("");
  const [groupedData, setGroupedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Initialize with an empty string
  const svgRef = useRef();

  useEffect(() => {
    // Load and process the CSV file
    d3.csv("/Images/bus_1.csv")
      .then((sensorData) => {
        const modifiedData = sensorData.map((d) => ({
          ...d,
          originalTimestamp: new Date(+d.timestamp),  // Convert to Date object for original timestamp
          timestamp: new Date(+d.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),  // Convert to localized string
          temperature: +d.temperature,
          humidity: +d.humidity,
          nh3: +d.nh3,
          no2: +d.no2,
          mq131: +d.mq131,
          mq7: +d.mq7,
          pm25: +d.pm25,
          pm10: +d.pm10,
          aqi: +d.aqi,
        }));

        // Group data by day using d3.groups
        const grouped = d3.groups(modifiedData, (d) => d.timestamp.split(",")[0]); // Group by date (YYYY-MM-DD)

        const formattedGroupedData = grouped.map((group) => ({
          date: group[0],
          meanValues: calculateMeanValues(group[1]),
        }));

        setData(modifiedData);
        setGroupedData(formattedGroupedData);
        setSelectedDate(formattedGroupedData[0]?.date || ""); // Ensure selectedDate is a string
      })
      .catch((error) => {
        console.error("Error loading CSV file:", error);
      });
  }, []);

  const calculateMeanValues = (values) => {
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

    const meanValues = {};
    metrics.forEach((metric) => {
      const total = values.reduce((sum, d) => sum + d[metric], 0);
      meanValues[metric] = total / values.length;
    });
    return meanValues;
  };

  useEffect(() => {
    if (selectedDate && groupedData.length > 0) {
      const selectedData = groupedData.find((d) => d.date === selectedDate);
      if (selectedData) {
        const meanValues = selectedData.meanValues;
        renderChart(meanValues);
      }
    }
  }, [selectedDate, groupedData]);

  const renderChart = (meanValues) => {
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
  
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
  
    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(metrics)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(meanValues))])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    // Append x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
  
    // Append y-axis
    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis);
  
    // Add axes labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", darkMode ? "#fff" : "#333")
      .text("Metrics");
  
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", darkMode ? "#fff" : "#333")
      .text("Mean Value");
  
    // Draw bars with animation
    svg
      .selectAll(".bar")
      .data(Object.entries(meanValues))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", ([metric]) => xScale(metric))
      .attr("y", height - margin.bottom)
      .attr("width", xScale.bandwidth())
      .attr("height", 0) // Start with a height of 0 for animation
      .attr("fill", darkMode ? "#6b7280" : "blue")
      .transition()
      .duration(5000) // Duration of the animation (1 second)
      .attr("y", ([_, value]) => yScale(value))
      .attr("height", ([_, value]) => height - margin.bottom - yScale(value));
  
    // Add values on top of bars with animation
    svg
      .selectAll(".value")
      .data(Object.entries(meanValues))
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", ([metric]) => xScale(metric) + xScale.bandwidth() / 2)
      .attr("y", height - margin.bottom)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", darkMode ? "#fff" : "#333")
      .text(([_, value]) => "")
      .transition()
      .duration(5000) // Same duration as the bars animation
      .attr("y", ([_, value]) => yScale(value) - 5)
      .text(([_, value]) => value.toFixed(2)); // Display value with 2 decimal places
  };
  

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div
      className={`text-center mt-5 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`} // Apply dark mode classes
    >
      <h1 className="mb-5 font-sans text-xl font-bold">Sensor Data Bar Chart</h1>

      {/* Dropdown for selecting the date */}
      <div className="mb-5">
        <select
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        >
          <option value="">Select a Date</option> {/* Empty option to clear the selection */}
          {groupedData.map((data) => (
            <option key={data.date} value={data.date}>
              {data.date}
            </option>
          ))}
        </select>
      </div>
<svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        className="border border-gray-400 mt-5"
      ></svg>

      
    </div>
  );
};

export default SensorDatas;
