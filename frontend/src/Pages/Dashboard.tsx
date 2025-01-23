//import React from 'react'

import DocumentList from "../Components/Dashboard/DocumentList";
import StartNewDocument from "../Components/Dashboard/StartNewDocument";


export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-start flex-col gap-6 mb-8">
        <StartNewDocument />
        <div>
          <h2 className="text-lg font-medium mb-4">Recent documents</h2>
          <DocumentList />
        </div>
      </div>
    </div>
  )
}