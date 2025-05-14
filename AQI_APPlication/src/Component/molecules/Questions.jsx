import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const aqiQA = [
  { question: "What is the AQI?", answer: "AQI is a scale that measures and reports air pollution levels." },
  { question: "Which pollutants does AQI track?", answer: "AQI tracks PM2.5, PM10, O3, NO2, SO2, and CO." },
  { question: "What is a good AQI value?", answer: "An AQI value of 0-50 indicates good air quality." },
  { question: "What does an AQI of 100 mean?", answer: "An AQI of 100 means air quality is acceptable but nearing unhealthy for sensitive groups." },
  { question: "What is PM2.5?", answer: "PM2.5 refers to fine particulate matter smaller than 2.5 microns." },
  { question: "How is AQI categorized?", answer: "AQI is categorized into six levels: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, and Hazardous." },
  { question: "What are the health effects of poor AQI?", answer: "Poor AQI can cause respiratory, cardiovascular issues, and worsen pre-existing conditions." },
  { question: "How is AQI calculated?", answer: "AQI is calculated using pollutant concentrations and converting them into a standardized scale." },
  { question: "What is the highest AQI level?", answer: "AQI levels above 300 are considered hazardous." },
  { question: "How can AQI be improved?", answer: "AQI can be improved by reducing emissions from vehicles, industries, and adopting cleaner energy sources." }
];

const Questions = ({isDarkMode}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
  <div className={`flex flex-col items-start mx-auto mt-16 p-4 max-w-5xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
  <div className={`text-4xl flex mx-auto mb-10`}>
    <h2>Frequently Asked Questions</h2>
  </div>
  {aqiQA.map((item, index) => (
    <div key={index} className="w-full mb-4">
      <div className={`flex items-center justify-between p-4 rounded shadow ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
        <p className="font-semibold text-base sm:text-lg">{item.question}</p>
        <button
          className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-blue-500 hover:text-blue-700'}`}
          onClick={() => toggleAnswer(index)}
        >
          {activeIndex !== index ? <FaPlus /> : <ImCross />}
        </button>
      </div>
      {activeIndex === index && (
        <div className={`p-4 rounded-b shadow-inner mt-2 ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-black'}`}>
          <p className="text-sm sm:text-base">{item.answer}</p>
        </div>
      )}
    </div>
  ))}
</div>

  );
};

export default Questions;
