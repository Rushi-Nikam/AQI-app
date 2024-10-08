import React from "react";
import Circle from "./Circle";

const SideCard = ({ location = "Mumbai" }) => {
  const gases = [
    {
      name: "SO₂",
      label: "Sulfur Dioxide",
      unit: "ppm",
      value: 0.005,
      max: 0.5,
    }, // 0.5 ppm for 10 min
    { name: "CO", label: "Carbon Monoxide", unit: "ppm", value: 1.5, max: 9 }, // 9 ppm for 8 hours
    {
      name: "NO₂",
      label: "Nitrogen Dioxide",
      unit: "ppm",
      value: 0.02,
      max: 0.1,
    }, // 0.1 ppm for 1 hour
    {
      name: "PM2.5",
      label: "Fine Particles (PM2.5)",
      unit: "µg/m³",
      value: 35,
      max: 25,
    }, // 25 µg/m³ for 24 hours
    {
      name: "PM10",
      label: "Coarse Particles (PM10)",
      unit: "µg/m³",
      value: 50,
      max: 50,
    }, // 50 µg/m³ for 24 hours
    { name: "O₃", label: "Ozone", unit: "ppm", value: 0.07, max: 0.08 }, // 0.08 ppm for 8 hours
  ];

  // Calculate AQI based on gases values
  const calculateAQI = () => {
    let totalWeightedValue = 0;

    gases.forEach((gas) => {
      totalWeightedValue += (gas.value / gas.max) * 100;
    });

    return Math.round(totalWeightedValue / gases.length); // Return the average AQI
  };

  const aqiValue = calculateAQI();

  return (
    <main
      className={`w-[320px] bg-white lg:mr-8 max-w-xl h-[400px] p-6 rounded-lg shadow-lg`}
    >
      <div className="text-black text-center mb-4">
        <h1 className="text-xl font-bold">{location} Location</h1>
        <p className="text-sm">Maharashtra, India</p>
      </div>

      <div className="flex flex-col sm:flex-row text-white justify-center sm:items-start">
       

        <div className="flex text-black flex-col items-center  sm:mt-0">
          <div className="text-xl font-semibold ">Air Quality Index</div>
          
          <Circle aqiValue={aqiValue} />
        </div>

       
      </div>
    </main>
  );
};

export default SideCard;
