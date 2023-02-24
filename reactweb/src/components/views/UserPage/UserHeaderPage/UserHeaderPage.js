import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbUsb } from "react-icons/tb";

function UserHeaderPage() {
  return (
    <div className='w-full h-1/10 mx-auto my-1 border-b-2 flex'>
      <div className='w-1/5 h-full'>
        <div className='w-16 h-16 border-2 border-gray-500 rounded-full bg-gray-300 float-left mt-1 ml-2 '>
          <p className='w-auto h-auto text-xs font-extrabold font-sans text-black text-center mt-3.5'>Common</p>
          <p className='w-auto h-auto text-xs font-extrabold font-sans text-black text-center'>Alarm</p>
        </div>
      </div>

      <div className='w-3/5 h-full'>
        <p className='w-full h-auto text-4xl font-black font-sans text-indigo-900 text-center mt-3'>
          Public Safety Repeater
        </p>
      </div>

      <div className='w-1/5 h-full'>
        <div className='w-20 h-4/5 float-right border-2 border-gray-500 rounded-xl mt-1'>
          <TbUsb className='text-stone-700 mx-auto' size="60" />
        </div>
      </div>
    </div>
  )
}

export default UserHeaderPage