import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("http://34.30.30.232:8000/aqi_values/get-data/");
        const result = await response.json();

        const busData = result.Bus_data;
        const formattedData = [
          { label: "Temperature", value: parseFloat(busData.temperature) },
          { label: "NH3", value: parseFloat(busData.nh3) },
          { label: "NO2", value: parseFloat(busData.no2) },
          { label: "MQ131", value: parseFloat(busData.mq131) },
          { label: "MQ7", value: parseFloat(busData.mq7) },
          { label: "PM2.5", value: parseFloat(busData.pm25) },
          { label: "PM10", value: parseFloat(busData.pm10) },
          { label: "Humidity", value: parseFloat(busData.humidity) },
        ];
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    // Set up dimensions and margins
    const w = 400;
    const h = 400;
    const radius = Math.min(w, h) / 2;
    const minAngle = 0.2; // Larger minimum angle for slices with zero value

    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .select("g")
      .remove();

    const container = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${w / 2}, ${h / 2})`);

    // Compute total non-zero values and adjust angles
    const total = data.reduce((sum, d) => (d.value > 0 ? sum + d.value : sum), 0);
    const adjustedData = data.map((d) => ({
      ...d,
      adjustedValue: d.value > 0 ? d.value : (minAngle * total) / (2 * Math.PI), // Allocate larger angle for zero values
    }));

    const adjustedTotal = adjustedData.reduce((sum, d) => sum + d.adjustedValue, 0);

    // Create pie chart with adjusted values
    const pie = d3
      .pie()
      .value((d) => d.adjustedValue)
      .sort(null);

    const dataReady = pie(adjustedData);

    // Create arcs
    const arc = d3
      .arc()
      .innerRadius(0) // Full pie chart
      .outerRadius(radius);

    // Define color ranges
    const color = (label, value) => {
      if (label === "Temperature") return value > 30 ? "#e74c3c" : "#3498db";
      if (label === "NH3") return value > 0.5 ? "#e67e22" : "#2ecc71";
      if (label === "NO2") return value > 5 ? "#f39c12" : "#9b59b6";
      if (label === "MQ131") return value > 0.5 ? "#8e44ad" : "#1abc9c";
      if (label === "MQ7") return value > 0.5 ? "#c0392b" : "#16a085";
      if (label === "PM2.5") return value > 50 ? "#e84393" : "#00cec9";
      if (label === "PM10") return value > 100 ? "#d63031" : "#0984e3";
      if (label === "Humidity") return value > 60 ? "#6c5ce7" : "#74b9ff";
      return "#636e72"; // Default color
    };

    // Add pie slices
    container
      .selectAll("path")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.data.label, d.data.value))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .transition()
      .ease(d3.easeCubicInOut)
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Add labels with values
    container
      .selectAll("text")
      .data(dataReady)
      .enter()
      .append("text")
      .text((d) => `${d.data.label}: ${d.data.value.toFixed(2)}`)
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        const offset = 1.3; // Adjust offset for spacing
        return `translate(${x * offset}, ${y * offset})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .transition()
      .ease(d3.easeCubicInOut)
      .duration(1200)
      .style("opacity", 1);
  }, [data]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
