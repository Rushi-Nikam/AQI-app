import React from 'react'
import { Link } from 'react-router-dom'

const AQI_Map = () => {
  return (
    <>
      <main>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30242.567297236546!2d73.74791533429325!3d18.649589990536978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e76cf2f9bb%3A0x51c2a6d121bcc6c8!2sNigdi%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1728286294890!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
      <div className='flex justify-center mt-2 uppercase underline text-blue-600'><Link to={'/map'}  >Check Out The realvalue</Link></div>
     
      </main>
    </>
  )
}

export default AQI_Map
