// import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const PieChart = () => {
//   const [data, setData] = useState([]); // State for data
//   const chartRef = useRef(null); // Reference for the SVG element

//   useEffect(() => {
//     // Fetch the JSON file
//     fetch('/MOCK_DATA.json')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setData(data); // Update state with the fetched data
//       })
//       .catch((error) => {
//         console.error('Error fetching the JSON:', error);
//       });
//   }, []);

//   useEffect(() => {
//     // Render the pie chart when data is updated
//     if (data.length > 0) {
//       drawPieChart();
//     }
//   }, [data]);

//   const drawPieChart = () => {
//     const svgWidth = 400;
//     const svgHeight = 400;
//     const radius = Math.min(svgWidth, svgHeight) / 2;

//     // Remove existing SVG
//     d3.select(chartRef.current).selectAll('*').remove();

//     const svg = d3
//       .select(chartRef.current)
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//       .append('g')
//       .attr(
//         'transform',
//         `translate(${svgWidth / 2}, ${svgHeight / 2})`
//       );

//     // Prepare the data for the pie chart (e.g., AQI distribution)
//     const aqiData = data.reduce((acc, item) => {
//       const range = Math.floor(item.aqi / 50) * 50; // Group AQI into ranges of 50
//       acc[range] = (acc[range] || 0) + 1;
//       return acc;
//     }, {});

//     const pieData = Object.entries(aqiData).map(([range, count]) => ({
//       range,
//       count,
//     }));

//     const pie = d3.pie().value((d) => d.count);
//     const arcs = pie(pieData);

//     const color = d3.scaleOrdinal(d3.schemeTableau10);

//     const arc = d3.arc().innerRadius(0).outerRadius(radius);

//     // Draw the pie chart
//     svg
//       .selectAll('path')
//       .data(arcs)
//       .enter()
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', (d, i) => color(i))
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);

//     // Add labels
//     svg
//       .selectAll('text')
//       .data(arcs)
//       .enter()
//       .append('text')
//       .attr('transform', (d) => `translate(${arc.centroid(d)})`)
//       .attr('text-anchor', 'middle')
//       .attr('font-size', '8px')
//       .text((d) => `${d.data.range}-${+d.data.range + 49}: ${d.data.count}`);
//   };

//   return (
//     <div>
//       <h1>Air Quality Index Data</h1>
//       {/* <table border="1">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Location</th>
//             <th>Timestamp</th>
//             <th>AQI</th>
//             <th>PM2.5</th>
//             <th>PM10</th>
//             <th>CO</th>
//             <th>NO2</th>
//             <th>SO2</th>
//             <th>O3</th>
//             <th>Temperature</th>
//             <th>Humidity</th>
//           </tr>
//         </thead>
//         <tbody>
//          {data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.location}</td>
//               <td>{item.timestamp}</td>
//               <td>{item.aqi}</td>
//               <td>{item.pm2_5}</td>
//               <td>{item.pm10}</td>
//               <td>{item.co}</td>
//               <td>{item.no2}</td>
//               <td>{item.so2}</td>
//               <td>{item.o3}</td>
//               <td>{item.temprature}</td>
//               <td>{item.humidity}</td>
//             </tr>
//           ))} 
//         </tbody>
//       </table> */}

//       <div>
//         <h2>AQI Pie Chart</h2>
//         <svg ref={chartRef}></svg>
//       </div>
//     </div>
//   );
// };

// export default PieChart;
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

    // Define color ranges based on value
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

    // Create pie chart
    const pie = d3.pie().value((d) => d.value);
    const dataReady = pie(data);

    // Create arcs
    const arc = d3
      .arc()
      .innerRadius(0) // Full pie chart
      .outerRadius(radius);

    // Add pie slices with animation
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

    // Add labels with values, positioned slightly further from the pie
    container
      .selectAll("text")
      .data(dataReady)
      .enter()
      .append("text")
      .text((d) => `${d.data.label}: ${d.data.value.toFixed(2)}`) // Include the value with the label
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d); // Get the centroid (label position)
        const offset = 1.3; // Adjust offset for spacing
        return `translate(${x * offset}, ${y * offset})`; // Move labels outward
      })
      .style("text-anchor", "middle") // Center the labels
      .style("font-size", "12px") // Set label font size
      .style("opacity", 0) // Start with invisible labels
      .transition()
      .ease(d3.easeCubicInOut)
      .duration(1200)
      .style("opacity", 1); // Fade in the labels

  }, [data]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;



