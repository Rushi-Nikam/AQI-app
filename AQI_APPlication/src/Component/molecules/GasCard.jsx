import React from 'react'

const GasCard = () => {
  return (
    <div>
      <div className="grid lg:rid-cols-1 bg-white sm:grid-cols-2  w-[350px] h-[400px] rounded-lg">
  <div
    className="shadow-md p-4 rounded-lg flex flex-col items-center justify-center"
  >
    {/* Title Section */}
    <div className="flex gap-1 items-center m-auto h-2">
      <div className="text-xs m-auto bg-blue-600 font-bold rounded-full p-2 text-white">O3</div>
      <div className="text-xs text-gray-700 mt-2">Ozone</div>
    </div>

    {/* Progress Bar */}
    <div className="w-full mt-8">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${(120 / 200) * 100}%`, overflow: 'hidden' }} // Example value
        ></div>
      </div>
      <div className="text-xs text-gray-600 mt-2 text-right">
        {`120 µg/m³`}
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default GasCard
