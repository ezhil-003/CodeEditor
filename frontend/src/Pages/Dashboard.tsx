//import React from 'react'

import DocumentList from "../Components/Dashboard/DocumentList";
import StartNewDocument from "../Components/Dashboard/StartNewDocument";


export default function Dashboard() {
  return (
    <div className="p-8  h-screen">
      <div className="flex items-start flex-col gap-6 h-max mb-8">
        <section className="w-full h-max m-3 mb-2 flex flex-row gap-4">
          <StartNewDocument />
          <StartNewDocument />
          <StartNewDocument />
        </section>
        <section className="flex flex-col w-full h-full">
          <h2 className="text-lg font-medium mb-4">Recent documents</h2>
          <DocumentList />
        </section>
      </div>
    </div>
  )
}