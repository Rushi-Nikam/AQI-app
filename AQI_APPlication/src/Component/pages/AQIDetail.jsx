import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Helper for individual parameter colors
const getColorForParameter = (param) => {
  const colors = {
    Temperature: "bg-blue-500",
    NH3: "bg-green-500",
    NO2: "bg-yellow-500",
    MQ131: "bg-purple-500",
    MQ7: "bg-red-500",
    "PM2.5": "bg-pink-500",
    PM10: "bg-orange-500",
    AQI: "bg-emerald-600",
  };
  return colors[param] || "bg-gray-400";
};

const AQIDetail = () => {
  const { index } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummyData = Array.from({ length: 24 }, (_, idx) => ({
    Temperature: +(25 + Math.random() * 5).toFixed(2),
    NH3: +(Math.random() * 10).toFixed(2),
    NO2: +(Math.random() * 1).toFixed(2),
    MQ131: +(Math.random() * 0.5).toFixed(2),
    MQ7: +(Math.random() * 0.5).toFixed(2),
    "PM2.5": +(Math.random() * 1).toFixed(2),
    PM10: +(Math.random() * 10).toFixed(2),
    AQI: +(Math.random() * 300).toFixed(2),
    TimestampDays: new Date(Date.now() - idx * 3600000).toISOString(),
  })).reverse();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://34.30.30.232:8000/aqi_values/predict_next_5_days/");
        if (!res.ok) throw new Error("Failed to fetch AQI data");
        const json = await res.json();
        const selected = json[parseInt(index)];
        if (!selected) throw new Error("Invalid index");
        setData(selected);
      } catch (err) {
        console.warn("Using dummy data due to error:", err.message);
        setData(dummyData[parseInt(index)]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [index]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!data) return <div className="p-4 text-center text-red-600">No AQI data available.</div>;

  const metrics = [
    { label: "Temperature", value: `${data.Temperature} °C` },
    { label: "NH3", value: `${data.NH3} ppm` },
    { label: "NO2", value: `${data.NO2} ppm` },
    { label: "MQ131", value: `${data.MQ131} ppm` },
    { label: "MQ7", value: `${data.MQ7} ppm` },
    { label: "PM2.5", value: `${data["PM2.5"]} µg/m³` },
    { label: "PM10", value: `${data.PM10} µg/m³` },
    { label: "AQI", value: Math.round(data.AQI) },
  ];

  return (
   <div className="p-6 max-w-3xl mx-auto">
  <h1 className="text-4xl font-bold text-center mb-6">AQI Details - Hour #{index}</h1>
 <p className="text-center text-gray-500 mb-8">
  Timestamp: {new Date(data.TimestampDays).toISOString().split('T')[0]} {new Date(data.TimestampDays).toTimeString().split(' ')[0]}
</p>
  {/* Table Layout for Metrics */}
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-800 text-center shadow-md rounded-lg">
      <thead>
        <tr className="border-b dark:border-gray-700">
          <th className="p-6 text-xl font-semibold">Parameter</th>
          <th className="p-6 text-xl font-semibold">Indicator</th>
          <th className="p-6 text-xl font-semibold">Value</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => (
          <tr key={metric.label} className="border-b dark:border-gray-700">
            <td className="p-6 text-lg">{metric.label}</td>
            <td className="p-6">
              <div
                className={`w-6 h-6 rounded-full ${getColorForParameter(metric.label)} mx-auto`}
              ></div>
            </td>
            <td className="p-6 text-2xl font-bold">{metric.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


  );
};

export default AQIDetail;
