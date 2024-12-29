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
          { label: "AQI", value: parseFloat(busData.aqi) },
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

    // Specify chart dimensions
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("margin-top", "50px")
      .style("color", darkMode ? "#fff" : "#000");

    svg.selectAll("*").remove();

    // Create the horizontal scale and its axis generator
    const x = d3
      .scaleBand()
      .domain(d3.sort(data, (d) => -d.value).map((d) => d.label))
      .range([marginLeft, width - marginRight])
      .padding(0.3);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    // Create the vertical scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)]).nice()
      .range([height - marginBottom, marginTop]);

    const yAxis = d3.axisLeft(y);

    // Append bars for the chart with animations
    svg
      .append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", height - marginBottom) // Start from the bottom (no height yet)
      .attr("height", 0) // Set initial height to 0 (hidden)
      .attr("width", x.bandwidth())
      .on("click", (event, d) => {
        const [x, y] = d3.pointer(event);
        setTooltip({
          visible: true,
          x,
          y,
          label: d.label,
          value: d.value,
        });
      })
      .transition()
      .duration(4000) // 1 second animation
      .ease(d3.easeElasticOut) // Ease-out effect
      .attr("y", (d) => y(d.value)) // Animate to the correct height
      .attr("height", (d) => y(0) - y(d.value)); // Animate the height

    // Append the x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .attr("dy", "1em");

    // Append the y-axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(yAxis)
      .selectAll("text")
      .style("fill", darkMode ? "#fff" : "#000");

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .style("fill", darkMode ? "#fff" : "#000")
      .text("Parameters");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .text("Values");

    // Tooltip display with fade-in animation
    svg
      .selectAll(".bar-text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-text")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#fff" : "#000")
      .style("opacity", 0) // Initially set opacity to 0
      .transition()
      .duration(4000) // 1 second fade-in animation
      .style("opacity", 1) // Fade in the text

      .text((d) => d.value);
  }, [data, darkMode]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          className="absolute border rounded p-2 text-sm shadow"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 20,
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            transition: "all 0.3s ease", // Add a transition for the tooltip
          }}
        >
          <strong>{tooltip.label}</strong> : {tooltip.value}
        </div>
      )}
    </div>
  );
};

export default BarChart;
