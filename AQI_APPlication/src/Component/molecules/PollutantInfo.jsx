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
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col items-center p-6 space-y-8 transition-all`}>
      
    

      {/* Buttons */}
      <div className="flex space-x-4">
        {Object.keys(pollutants).map((key) => (
          <motion.button
            key={key}
            onClick={() => setSelected(key)}
            className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selected === key 
                ? "bg-blue-600 text-white" 
                : darkMode 
                  ? "bg-gray-700 text-gray-300" 
                  : "bg-gray-200 text-gray-800"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {key}
            {selected === key && (
              <motion.div
                className="absolute left-1/2 top-full h-16 w-1 bg-blue-600"
                initial={{ height: 0 }}
                animate={{ height: 30 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      
      {/* Information Box */}
      <motion.div 
            key={`overview-${selected}`} 
            className={`p-6 w-[50%] border rounded-lg shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl w-[50%] font-bold mb-2">Overview</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {pollutants[selected].description}
            </p>
          </motion.div>

          {/* Why It Spikes */}
          <motion.div 
            key={`causes-${selected}`} 
            className={`p-6 border w-[50%] rounded-lg shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl w-[50%] font-bold mb-2">Why It Spikes?</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {pollutants[selected].causes}
            </p>
          </motion.div>

          {/* Health Effects */}
          <motion.div 
            key={`effects-${selected}`} 
            className={`p-6 border  w-[50%] rounded-lg shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl w-[50%] font-bold mb-2">Health Effects</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {pollutants[selected].effects}
            </p>
          </motion.div>

          {/* How to Stay Safe */}
          <motion.div 
            key={`precautions-${selected}`} 
            className={`p-6 border rounded-lg w-[50%] shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold w-[50%] mb-2">How to Stay Safe?</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {pollutants[selected].precautions}
            </p>
          </motion.div>
    </div>
  );
}
