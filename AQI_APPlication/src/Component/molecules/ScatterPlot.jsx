// import { useState, useRef, useEffect } from "react";
// import * as d3 from "d3";
// import { circle } from "leaflet";
// // import '../../App.css'
// const ScatterPlot = () => {
//   const [data] = useState([
//     [90, 20],
//     [20, 100],
//     [66, 44],
//     [53, 80],
//     [24, 182],
//     [80, 72],
//     [10, 76],
//     [33, 150],
//     [100, 15],
//   ]);
//   const svgRef = useRef();

//   useEffect(() => {
//     //setting up container
//     const w = 400;
//     const h = 300;
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", w)
//       .attr("height", h)
//       .style("overflow", "visible")
//       .style("margin-top", "100px")
//     //setting up scaling
//     const xScale = d3.scaleLinear().domain([0, 100]).range([0, w]);
//     const yScale = d3.scaleLinear().domain([0, 200]).range([h, 0]);

//     //setting up axis
//     const xAxis = d3.axisBottom(xScale).ticks(data.length)
//     const yAxis = d3.axisLeft(yScale).ticks(10)
//     svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`)

//     svg.append("g").call(yAxis);
//     //setting up axis labeling
//     svg
//       .append("text")
//       .attr("x", w / 2)
//       .attr("y", h + 50)
//       .text("x");
//     svg
//       .append("text")
//       .attr("y", h / 2)
//       .attr("x", -50)
//       .text("y");
//     //setting up svg data
//     svg.selectAll()
//        .data(data)
//        .enter()
//        .append('circle')
//          .attr('cx',d=>xScale(d[0]))
//          .attr('cy',d=>yScale(d[1]))
//          .attr('r',2)
//   }, [data]);

//   return(
//   <div className="flex justify-center">

//       <svg ref={svgRef}></svg>
//   </div>
//   )
// };

// export default ScatterPlot;

import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: "", value: "" });
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

    // Setting up container
    const w = 500;
    const h = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "50px");

    svg.selectAll("*").remove(); // Clear previous content

    // Setting up scaling
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, w - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) + 10]) // Adding buffer
      .range([h - margin.bottom, margin.top]);

    // Setting up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis);

    // Adding labels
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .attr("text-anchor", "middle")
      .text("Parameters");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Values");

    // Adding connecting lines
    const line = d3
      .line()
      .x((d) => xScale(d.label) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "teal")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Plotting data points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 6)
      .attr("fill", "teal")
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
  }, [data]);

  return (
    <div className="relative flex justify-center">
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          className="absolute bg-white border rounded p-2 text-sm shadow"
          style={{ left: tooltip.x + 20, top: tooltip.y - 20 }}
        >
          <strong>{tooltip.label}</strong>: {tooltip.value}
        </div>
      )}
    </div>
  );
};

export default ScatterPlot;
