import React from 'react'
import Navbar from './Navbar'
import { useEffect, useState } from 'react'; 
function Home() {

  // เดี๋ยวดึงมาจาก backend
  const [testObj, settestObj] = useState([]); 
  
  useEffect(() => {      
      fetch('/api/sheet1')
      .then(res => res.json())
      .then(data => settestObj(data))
      .catch(err => console.error(err));
  }, []);
  

  return (
    <div>
      <Navbar />
      <div className='max-w-screen-xl mx-auto'>
        <div className='py-10'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <hr className='my-4' />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Card for Total Applications */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>Total Applications</h2>
              <p className='text-3xl font-bold'>{testObj.length}</p>
            </div>

            {/* Card for Approved Applications */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>Approved Applications</h2>
              <p className='text-3xl font-bold'>567</p>
            </div>

            {/* Card for Pending Applications */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>Pending Applications</h2>
              <p className='text-3xl font-bold'>456</p>
            </div>

            {/* Card for Rejected Applications */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>Rejected Applications</h2>
              <p className='text-3xl font-bold'>211</p>
            </div>
          </div>

          <div className='mt-10'>
            <h2 className='text-xl font-semibold'>Monthly Statistics</h2>
            <hr className='my-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Example Monthly Data */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <h3 className='text-lg font-semibold'>Applications in October</h3>
                <p className='text-2xl font-bold'>123</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow'>
                <h3 className='text-lg font-semibold'>Approvals in October</h3>
                <p className='text-2xl font-bold'>78</p>
              </div>
              {/* Additional data can be added here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home