import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Load and process the CSV data
    d3.csv("/Images/bus_1.csv").then((sensorData) => {
      const processedData = sensorData.map((d) => ({
        timestamp: new Date(+d.timestamp),
        temperature: +d.temperature,
        humidity: +d.humidity,
        aqi: +d.aqi,
      }));

      // Group data into 3-hour intervals
      const candlestickData = d3.rollup(
        processedData,
        (values) => {
          const sorted = values.sort((a, b) => a.timestamp - b.timestamp);
          return {
            open: sorted[0].temperature,
            close: sorted[sorted.length - 1].temperature,
            high: d3.max(sorted, (d) => d.temperature),
            low: d3.min(sorted, (d) => d.temperature),
            humidity: d3.mean(sorted, (d) => d.humidity),
            aqi: d3.mean(sorted, (d) => d.aqi),
            timestamp: sorted[0].timestamp,
          };
        },
        (d) => {
          // Group by 3-hour intervals
          const time = new Date(d.timestamp);
          time.setMinutes(0, 0, 0); // Reset minutes and seconds
          time.setHours(Math.floor(time.getHours() / 3) * 3); // Round down to nearest 3-hour block
          return time;
        }
      );

      setData(Array.from(candlestickData.values()));
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const width = 1200;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 50, left: 80 };
  
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
  
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.timestamp))
        .range([margin.left, width - margin.right])
        .padding(0.3);
  
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.high)])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      // Axes
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b %d, %H:%M"))
        .ticks(6);
      const yAxis = d3.axisLeft(yScale);
  
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
  
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);
  
      // Candlesticks
      svg
        .selectAll(".candle")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.timestamp))
        .attr("y", (d) => yScale(Math.max(d.open, d.close)))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
        .attr("fill", (d) => (d.close > d.open ? "green" : "red"));
  
      // Wicks
      svg
        .selectAll(".wick")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d.timestamp) + xScale.bandwidth() / 2)
        .attr("x2", (d) => xScale(d.timestamp) + xScale.bandwidth() / 2)
        .attr("y1", (d) => yScale(d.high))
        .attr("y2", (d) => yScale(d.low))
        .attr("stroke", (d) => (d.close > d.open ? "green" : "red"))
        .attr("stroke-width", 1);
    }
  }, [data]);
  

  return (
    <div>
      <h1
        className={`text-center ${
          darkmode ? "text-white" : "text-black"
        } font-bold text-2xl mb-5`}
      >
        Candlestick Chart with Multiple Parameters (3-Hour Intervals)
      </h1>
      <svg ref={svgRef} width="100%" height="500" />
    </div>
  );
};

export default CandlestickChart;
