//import React from 'react'

import DocumentCardGrid from "../Components/Dashboard/DocumentCardGrid";
import DocumentList from "../Components/Dashboard/DocumentList";
import StartNewProject from "../Components/Dashboard/StartNewProject";


export default function Dashboard() {
  return (
    <div className="p-8  h-screen">
      <div className="flex items-start flex-col gap-6 h-max mb-8">
        <section className="w-full h-max m-3 mb-2 flex flex-row gap-4">
          <StartNewProject />
        </section>
        <section className="flex flex-col w-full h-full">
          <span className="p-2">
            <h2 className="text-xl font-medium mb-3">Recent documents</h2>
          </span>
          <DocumentCardGrid />
        </section>
      </div>
    </div>
  )
}