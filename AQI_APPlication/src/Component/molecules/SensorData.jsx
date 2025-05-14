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
        for (let i = 0; i < sensorData.length; i += 120) {
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
        .attr("y", height - 5)
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
          .attr("r", 2)
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
    <div className="mt-5 px-4">
  {/* Title */}
  <h2
    className={`text-2xl lg:text-5xl font-semibold mt-20 mb-10  ${
      darkmode ? "text-white" : "text-black"
    }`}
  >
    Historical Air Quality Values
  </h2>

  {/* Metric selection buttons */}
  <div
    className={`flex flex-wrap justify-center gap-3 p-4 rounded-2xl mb-6 
      ${darkmode ? "bg-gray-600 text-gray-100 border border-gray-500" : "bg-gray-200 text-gray-900 border border-gray-300"}
      shadow-md`}
  >
    {metrics.map((metric) => (
      <button
        key={metric}
        onClick={() => setSelectedMetric(metric)}
        className={`px-3 py-2 text-sm sm:text-base lg:text-md rounded-2xl transition-all duration-300 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] lg:min-w-[140px]
          ${
            selectedMetric === metric
              ? "bg-blue-700 text-white shadow-lg"
              : darkmode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-400 text-gray-800 hover:bg-gray-300"
          }`}
      >
        {metric}
      </button>
    ))}
  </div>

  {/* Chart and legend layout */}
  <div className="flex flex-col lg:flex-row gap-8 items-start">
    {/* Chart container with scrollbars */}
    <div className="w-full lg:w-3/4 border rounded-xl shadow-xl bg-white dark:bg-gray-800 p-4 relative overflow-hidden">
  <div className="max-h-100 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 max-h-[500px]">
    <svg
      ref={svgRef}
      width={1250}
      height={500}
      className="block"
      style={{ minWidth: "1000px", minHeight: "400px" }}
    ></svg>
  </div>


      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          padding: "4px",
          borderRadius: "3px",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 10,
        }}
      ></div>
    </div>

    {/* Legend */}
    <div
      className={`w-full lg:w-1/4 text-sm sm:text-base lg:text-lg border rounded-xl shadow-md p-4 
        ${darkmode ? "text-white bg-gray-800 border-gray-600" : "text-black bg-white border-gray-300"}`}
    >
      <table className="table-auto w-full text-center">
        <thead>
          <tr>
            <th className="py-2">Color</th>
            <th className="py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ color: "yellow" }}>■</td><td>Temperature</td></tr>
          <tr><td style={{ color: "pink" }}>■</td><td>Humidity</td></tr>
          <tr><td style={{ color: "black" }}>■</td><td>MQ7</td></tr>
          <tr><td style={{ color: "purple" }}>■</td><td>MQ131</td></tr>
          <tr><td style={{ color: "green" }}>■</td><td>NO2</td></tr>
          <tr><td style={{ color: "orange" }}>■</td><td>NH3</td></tr>
          <tr><td style={{ color: "gold" }}>■</td><td>PM2.5</td></tr>
          <tr><td style={{ color: "red" }}>■</td><td>PM10</td></tr>
          <tr><td style={{ color: "violet" }}>■</td><td>AQI</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>





    );
  };
  
  export default SensorData;
  
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
// import { IoIosArrowUp } from "react-icons/io";
// import { MdKeyboardArrowDown } from "react-icons/md";
// // Main SensorData component that accepts a dark mode prop
// const SensorData = ({ darkmode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [data, setData] = useState([]); // State to store sensor data
//   const [selectedMetric, setSelectedMetric] = useState("temperature"); // State for selected metric
//   const svgRef = useRef(); // Reference to the SVG element for D3 rendering
//   const tooltipRef = useRef(); // Reference to the tooltip element

//   const dropdownRef = useRef();
//   // Effect to load and process CSV data
//   useEffect(() => {
//     d3.csv("/Images/bus_2.csv") // Load CSV file
//       .then((sensorData) => {
//         const selectedData = [];
//         // Select every 10th data point for reduced rendering load
//         for (let i = 50; i < sensorData.length; i += 150) {
//           selectedData.push(sensorData[i]);
//         }

//         // Convert data fields to appropriate formats
//         const modifiedData = selectedData.map((d) => ({
//           ...d,
//           temperature: +d.temperature,
//           humidity: +d.humidity,
//           nh3: +d.nh3,
//           no2: +d.no2,
//           mq131: +d.mq131,
//           mq7: +d.mq7,
//           pm25: +d.pm25,
//           pm10: +d.pm10,
//           aqi: +d.aqi,
//           originalTimestamp: new Date(+d.timestamp), // Convert timestamp to Date
//           timestamp: new Date(+d.timestamp).toLocaleString("en-IN", {
//             timeZone: "Asia/Kolkata", // Format timestamp
//           }),
//         }));
//         setData(modifiedData); // Update state with processed data
//       })
//       .catch((error) => console.error("Error loading CSV file:", error)); // Error handling
//   }, []);

//   // Define colors for different metrics
//   const dotColor = (metric) => {
//     switch (metric) {
//       case "temperature":
//         return "yellow";
//       case "humidity":
//         return "pink";
//       case "mq7":
//         return "black";
//       case "mq131":
//         return "purple";
//       case "no2":
//         return "green";
//       case "nh3":
//         return "orange";
//       case "pm25":
//         return "gold";
//       case "pm10":
//         return "red";
//       case "aqi":
//         return "violet";
//       default:
//         return darkmode ? "cyan" : "blue";
//     }
//   };

//   // Effect to render chart whenever data, metric, or dark mode changes
//   useEffect(() => {
//     if (data.length > 0) {
//       const sortedData = [...data].sort(
//         (a, b) => a.originalTimestamp - b.originalTimestamp
//       ); // Sort data by timestamp

//       const width = 1200; // SVG width
//       const height = 500; // SVG height
//       const margin = { top: 20, right: 20, bottom: 50, left: 80 }; // Chart margins

//       const svg = d3.select(svgRef.current); // Select SVG
//       svg.selectAll("*").remove(); // Clear previous chart

//       const tooltip = d3.select(tooltipRef.current); // Select tooltip element
      
//       // Create scales for X and Y axes
//       const xScale = d3
//         .scaleTime()
//         .domain(d3.extent(sortedData, (d) => d.originalTimestamp))
//         .range([margin.left, width - margin.right]);

//       let yScale = d3
//         .scaleLinear()
//         .domain([0, d3.max(sortedData, (d) => d[selectedMetric])])
//         .nice()
//         .range([height - margin.bottom, margin.top]);

//       // Define axes
//       const xAxis = d3
//         .axisBottom(xScale)
//         .ticks(d3.timeHour.every(1))
//         .tickFormat(d3.timeFormat("%H"));

//       const yAxis = d3.axisLeft(yScale);

//       // Render X axis
//       svg
//         .append("g")
//         .attr("transform", `translate(0, ${height - margin.bottom})`)
//         .call(xAxis)
//         .style("stroke", darkmode ? "#fff" : "#000");

//       // Render Y axis
//       svg
//         .append("g")
//         .attr("transform", `translate(${margin.left}, 0)`)
//         .call(yAxis)
//         .style("stroke", darkmode ? "#fff" : "#000");

//       // Add X axis label
//       svg
//         .append("text")
//         .attr("x", width / 2)
//         .attr("y", height - 10)
//         .attr("text-anchor", "middle")
//         .style("font-size", "16px")
//         .style("fill", darkmode ? "#fff" : "#000")
//         .text("hourly data");

//       // Add Y axis label
//       svg
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("x", -height / 2)
//         .attr("y", 15)
//         .attr("text-anchor", "middle")
//         .style("font-size", "20px")
//         .style("fill", darkmode ? "#fff" : "#333")
//         .text(selectedMetric);

//       // Render lines and dots for selected metrics
//       const lineGenerator = d3
//         .line()
//         .x((d) => xScale(d.originalTimestamp))
//         .y((d) => yScale(d[selectedMetric]))
//         .curve(d3.curveMonotoneX);

//       svg
//         .append("path")
//         .datum(sortedData)
//         .attr("fill", "none")
//         .attr("stroke", dotColor(selectedMetric))
//         .attr("stroke-width", 2)
//         .attr("opacity", 0.7)
//         .attr("d", lineGenerator)
//         .transition()
//         .duration(3000)
//         .ease(d3.easeCubicInOut);

//       svg
//         .selectAll(`circle.${selectedMetric}`)
//         .data(sortedData)
//         .enter()
//         .append("circle")
//         .attr("cx", (d) => xScale(d.originalTimestamp))
//         .attr("cy", (d) => yScale(d[selectedMetric]))
//         .attr("r", 5)
//         .attr("fill", dotColor(selectedMetric))
//         .on("mouseover", (event, d) => {
//           tooltip
//             .style("visibility", "visible")
//             .style("left", `${event.pageX + 5}px`)
//             .style("top", `${event.pageY - 28}px`)
//             .html(
//               `<strong>${selectedMetric}:</strong> ${d[selectedMetric]}<br/><strong>Time:</strong> ${d.timestamp}`
//             );
//         })
//         .on("mouseout", () => {
//           tooltip.style("visibility", "hidden");
//         });
//     }
//   }, [data, selectedMetric, darkmode]);

//   const metrics = [
//     "temperature",
//     "humidity",
//     "nh3",
//     "no2",
//     "mq131",
//     "mq7",
//     "pm25",
//     "pm10",
//     "aqi",
//   ]; // List of metrics

//   const handleCardClick = (metric) => {
//     setSelectedMetric(metric);
//     setIsOpen(false);
//   };
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   return (
//     <div className="mt-5">
//       {/* Title */}
//       <h1
//         className={`text-3xl font-semibold mb-6 text-gray-800 ${darkmode ? "text-white" : "text-black"}`}
//       >
//         Historical Overview of Air Quality Data
//       </h1>

//       {/* Dropdown for selecting metric */}
//       <div
//   ref={dropdownRef}
//   className={`flex mx-auto justify-center  mb-6 relative px-6 py-2 text-xs lg:text-xl cursor-pointer rounded-2xl w-[180px] transition-all
//   ${darkmode ? "bg-gray-300 text-gray-200 border-gray-500 focus:ring-2 focus:ring-gray-200" 
//   : "bg-[#f7f7fc] text-gray-800 border border-gray-200 focus:ring-2 focus:ring-gray-200"}`
//   }
// >
//   <select
//     className={`px-4 w-[180px] py-2 mx-auto capitalize text-center text-xs lg:text-xl cursor-pointer rounded-2xl appearance-none focus:outline-none border-none outline-none hover:outline-none focus:border-none  ${darkmode ? "bg-gray-300 text-gray-200 border-gray-500 focus:ring-2 focus:ring-gray-200" 
//   : "bg-[#f7f7fc] text-gray-800 border border-gray-200 focus:ring-2 focus:ring-gray-200"}`}
  
//           value={selectedMetric}
//           onChange={(e) => setSelectedMetric(e.target.value)}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {metrics.map((metric) => (
//             <option key={metric} value={metric} className="capitalize">
//               {metric}
//             </option>
//           ))}
//         </select>

//         {/* Arrow icon */}
//         <div className="flex justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <IoIosArrowUp className="w-5 h-5 text-gray-500" /> : <MdKeyboardArrowDown className="w-5 h-5 text-gray-500" />}
//         </div>
//       </div>

//       {/* SVG container for D3 chart */}
//       <div className="flex">
//         <svg ref={svgRef} width="1200" height="500" className="mx-auto"></svg>
//       </div>

//       {/* Tooltip for hover interactions */}
//       <div
//         ref={tooltipRef}
//         style={{
//           position: "absolute",
//           background: "rgba(0, 0, 0, 0.7)",
//           color: "#fff",
//           padding: "5px",
//           borderRadius: "3px",
//           visibility: "hidden",
//           pointerEvents: "none",
//         }}
//       ></div>

    
// <div className={`my-2 flex flex-col text-xs ${darkmode ? "text-white bg-slate-900" : "text-black"}`}>
//   <div className={`bg-white text-center flex flex-col rounded-lg  p-8 ${darkmode ? "text-white bg-slate-900" : "text-black"}`}>
//     <h3 className={`text-xl font-semibold ${darkmode ? "text-white bg-slate-800" : "text-black"}`}>Air Quality Metrics</h3>
//     <div className={`mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ${darkmode ? "text-white bg-slate-800" : "text-black"} `}>
//       {metrics.map((metric) => (
//         <div
//           key={metric}
//           className={` border-2 border-gray-900  border-solid border-transparent text-xs flex flex-col justify-center rounded-lg  p-5 cursor-pointer hover:scale-105 transition-all duration-300 w-full ${darkmode ? "text-white bg-slate-950" : "text-black"}`}
//           onClick={() => handleCardClick(metric)}
//         >
//           <div
//             className={`w-[180px] mx-auto h-[6px]  my-10 ${dotColor(metric)}`}
//             style={{
//               backgroundColor: dotColor(metric),
//               transform: "rotate(200deg)", // Apply the rotation here
//             }}
//           ></div>
//           <div className="mt-6 text-center flex justify-center">
//             <span className={`text-xl font-medium ${darkmode ? "text-white" : "text-black"}`}>
//               {metric.charAt(0).toUpperCase() + metric.slice(1)}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

// </div>



//   );
// };

// export default SensorData;
