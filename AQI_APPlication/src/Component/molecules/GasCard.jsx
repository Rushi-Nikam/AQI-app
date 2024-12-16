import React from 'react'

const GasCard = ({title="Humidity" , value="35",isDarkMode=true }) => {
  return (
    <div>
 <div
  className={`shadow-md rounded-lg flex flex-col justify-between items-center p-4 ${
    isDarkMode
      ? 'bg-gray-700 text-[#82909d] hover:border-[1px] border-solid border-white'
      : 'bg-[#f7f7fc] text-gray-700 hover:border-[1px] border-solid border-black'
  }`}
>
  <div className="flex gap-5 justify-between ">
   
    <div className="text-2xl">{title}</div>
    <div
      className={`text-xl font-bold rounded-full p-2 ${
        isDarkMode ? 'bg-gray-600 text-[#82909d]' : 'bg-blue-600 text-white'
      }`}
    >
      {value}
    </div>
    <div
      className={`text-xl flex flex-col justify-center items-end text-right ${
        isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f7f7fc] text-gray-700'
      }`}
    >
      {/* {`${value.mq7}`} */}
      {/* <div>{value.mq135}</div> */}
    </div>

  </div>

  {/* <div className="w-full mt-4">
    <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
      <div
        className={`h-full ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
        }`}
        style={{
          // width: `${(gas.value / gas.max) * 100}%`,
        }}
      ></div>
    </div>
    <div className="text-xs mt-2 text-right">
      {`(${gas.value} / ${gas.max} ${gas.unit})`}
    </div>
  </div> */}
</div>

    </div>
  )
}

export default GasCard
