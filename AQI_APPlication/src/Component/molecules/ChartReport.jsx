import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChartReport = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 928;
    const height = 500;
    const n = 6;  // Number of pollutants (layers)
    const m = 7;  // Number of data points (rows in your CSV)

    // Read the CSV file (replace with the actual file path or use a server to fetch it)
    const fetchData = async () => {
      const data = await d3.csv("/Images/bus_1.csv", d3.autoType);

      // Preprocess the data: we will use the pollutants (nh3, no2, mq131, etc.)
      const pollutants = ["nh3", "no2", "mq131", "mq7", "pm25", "pm10"];
      
      // Transform the data for the stacked area chart
      const layers = d3.stack()
        .keys(pollutants) // Pollutants as the layers
        (data.map(d => pollutants.map(key => d[key])));

      const x = d3.scaleLinear([0, m - 1], [0, width]);
      const y = d3.scaleLinear([0, 1], [height, 0]);
      const z = d3.interpolateCool; // Color scale for the layers
      const area = d3.area()
      .x((d, i) => x(i))  // Set the x coordinate of the area
      .y0(d => y(d[0]))    // Bottom of the area (start of stack)
      .y1(d => y(d[1]));   // Top of the area (end of stack)
      
      // Create SVG element and append it to the DOM
      const svg = d3.select(svgRef.current)
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
    //   console.log("Path data:", pathData)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

      // Create the path elements for each layer (stacked area)
      const path = svg.selectAll("path")
        .data(layers)
        .join("path")
        .attr("d", area)
        .attr("fill", () => z(Math.random()));

      // Randomize the layers for the animation effect
      const randomize = () => {
        const newLayers = d3.stack()
          .keys(pollutants)
          (data.map(d => pollutants.map(key => Math.random() * 100))); // Random values for animation
        y.domain([
          d3.min(newLayers, l => d3.min(l, d => d[0])),
          d3.max(newLayers, l => d3.max(l, d => d[1])),
        ]);
        return newLayers;
      };

      // Animation loop to transition between different stacked areas
      const animateChart = async () => {
        while (true) {
          path
            .data(randomize()) // Update with new randomized data
            .transition()
            .delay(1000)
            .duration(1500)
            .attr("d", area) // Transition to new area
            .end();
          await new Promise(resolve => setTimeout(resolve, 2000)); // Pause before next transition
        }
      };

      animateChart();
    };

    fetchData();
  }, []);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ChartReport;
