import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: "", value: "" });
  const svgRef = useRef();

  useEffect(() => {
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

    const w = 500;
    const h = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "50px")
      // .style("background-color", darkMode ? "#333" : "#fff")
      .style("color", darkMode ? "#fff" : "#000");

    svg.selectAll("*").remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, w - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) + 10])
      .range([h - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .selectAll("text")
      .style("fill", darkMode ? "#fff" : "#000");

    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .text("Parameters");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .text("Values");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => h - margin.bottom - yScale(d.value))
      .attr("fill", "blue")
      .on("click", (event, d) => {
        const [x, y] = d3.pointer(event);
        setTooltip({
          visible: true,
          x,
          y,
          label: d.label,
          value: d.value,
        });
      });

    svg
      .selectAll(".bar-text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-text")
      .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .text((d) => d.value);
  }, [data, darkMode]);

  return (
    <div className="flex justify-center relative">
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          className="absolute border rounded p-2 text-sm shadow"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 20,
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <strong>{tooltip.label}</strong>: {tooltip.value}
        </div>
      )}
    </div>
  );
};

export default BarChart;
