import React,{useState,useEffect} from 'react'

const Humidity = () => {
    const [humidityData, setHumidityData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("http://192.168.29.191:8000/aqi_values/get-data");
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            const sensor = data.humidity[0];
            console.log(sensor);
            setHumidityData(sensor); // Assuming 'humidity' is the key in the response
          } catch (err) {
            setError(err.message);
          }
        };
    
        fetchData();
      }, []);
  return (
    <div>
    <h1>Humidity Data</h1>
    {error ? (
      <p>Error: {error}</p>
    ) : (
      <ul>
      {humidityData.value}
      </ul>
    )}
  </div>
  )
}

export default Humidity;
