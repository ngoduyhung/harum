import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AccessLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full relative">
      <div className="">
        <Outlet/>
    </div>
   </div>
  )
}
