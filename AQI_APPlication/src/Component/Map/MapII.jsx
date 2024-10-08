import React from 'react'

const MapII = () => {
  return (
    <div className='flex justify-center my-10 '>
       <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.2913669155932!2d73.75010007465421!3d18.605960066561355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b97c138deee7%3A0x5548eed7fc280ee5!2sBhumkar%20Chowk!5e0!3m2!1sen!2sin!4v1728290726535!5m2!1sen!2sin"
        width="1100"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bhumkar Chowk Location"
      ></iframe>
    </div>
  )
}

export default MapII
