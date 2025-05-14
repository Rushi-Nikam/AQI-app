import { useState } from "react";
import { motion } from "framer-motion";


const pollutants = {
  AQI: {
    description: "High AQI levels indicate severe air pollution, affecting respiratory health.",
    causes: "Vehicle emissions, industrial activities, and wildfires.",
    effects: "Increased risk of asthma, lung diseases, and cardiovascular problems.",
    precautions: "Limit outdoor activities, wear masks, and use air purifiers."
  },
  PM10: {
    description: "PM10 particles can penetrate deep into the lungs and cause respiratory issues.",
    causes: "Dust storms, road traffic, and construction activities.",
    effects: "Lung irritation, coughing, and worsened asthma symptoms.",
    precautions: "Avoid dusty areas and use N95 masks."
  },
  PM25: {
    description: "PM2.5 are fine particles that can enter the bloodstream and affect heart health.",
    causes: "Burning fossil fuels, cigarette smoke, and industrial emissions.",
    effects: "Heart attacks, stroke, and respiratory diseases.",
    precautions: "Use HEPA filters indoors and avoid prolonged outdoor exposure."
  },
  NO: {
    description: "High NO levels contribute to acid rain and respiratory problems.",
    causes: "Vehicle exhaust, power plants, and agricultural activities.",
    effects: "Irritated lungs, shortness of breath, and increased infection risk.",
    precautions: "Avoid high-traffic areas and stay indoors during smog alerts."
  },
  CO: {
    description: "Carbon monoxide reduces oxygen transport in the body, leading to dizziness.",
    causes: "Incomplete combustion of fuels, car exhaust, and faulty heating systems.",
    effects: "Headaches, dizziness, confusion, and even death in high exposure.",
    precautions: "Ensure proper ventilation and install CO detectors at home."
  },
  NH3: {
    description: "Ammonia exposure can cause eye and skin irritation.",
    causes: "Agricultural fertilizers, industrial waste, and decomposing materials.",
    effects: "Irritated eyes, difficulty breathing, and skin burns in high exposure.",
    precautions: "Wear protective masks and avoid exposure to strong chemical fumes."
  },
  O3: {
    description: "Ozone at ground level can cause breathing issues and worsen lung diseases.",
    causes: "Reaction of sunlight with pollutants like NOx and VOCs.",
    effects: "Chest pain, coughing, and aggravated asthma.",
    precautions: "Stay indoors on high ozone days and avoid strenuous activities outdoors."
  }
};

export default function PollutantInfo({darkMode}) {
  const [selected, setSelected] = useState("AQI");


  return (
  <div>
  <h2
    className={`text-2xl lg:text-5xl font-bold my-12 text-center ${
      darkMode ? "text-white" : "text-gray-800"
    }`}
  >
    Air Quality Relevant Information
  </h2>

  <div
    className={`min-h-screen flex flex-col items-center px-4 py-10 space-y-12 transition-all duration-500 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
    }`}
  >
    {/* Pollutant Selection Buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      {Object.keys(pollutants).map((key) => (
        <motion.button
          key={key}
          onClick={() => setSelected(key)}
          whileHover={{ scale: 1.05 }}
          className={`relative px-5 py-2 rounded-full font-medium transition-all duration-300 border ${
            selected === key
              ? "bg-blue-600 text-white shadow-md"
              : darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {key}
          {selected === key && (
            <motion.div
              className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 h-[6px] w-[6px] bg-blue-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      ))}
    </div>

    {/* Info Boxes Grid */}
    <div className="grid gap-6 w-full max-w-7xl grid-cols-1 ">
      {[
        {
          key: "overview",
          title: "Overview",
          content: pollutants[selected].description,
        },
        {
          key: "causes",
          title: "Why It Spikes?",
          content: pollutants[selected].causes,
        },
        {
          key: "effects",
          title: "Health Effects",
          content: pollutants[selected].effects,
        },
        {
          key: "precautions",
          title: "How to Stay Safe?",
          content: pollutants[selected].precautions,
        },
      ].map((item, idx) => (
        <motion.div
          key={`${item.key}-${selected}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border shadow-md transition-all duration-300 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          <h3 className="text-lg lg:text-xl font-semibold mb-2">{item.title}</h3>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
            {item.content}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</div>



  );
}
