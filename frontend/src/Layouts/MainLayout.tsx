// import React from 'react'
import Header from '../Components/UI/Header.tsx'
import Footer from '../Components/UI/Footer.tsx'
import { Outlet } from 'react-router'



export default function MainLayout() {
  return (
    <div className="m-0 p-0 box-border w-full min-h-screen h-full flex flex-1 flex-col fixed">
      <header className="w-full h-auto sticky top-0 left-0 ">
        <Header />
      </header>
      <div className="w-full h-full flex flex-1  flex-row gap-3 p-5 overflow-auto ">
        <main className="w-full  flex-1 flex-col ">
          <Outlet />
        </main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

// function Layout() {
//   return (
//     <div className="m-0 p-0 box-border font-sans  bg-blue1 w-full min-h-screen h-full flex flex-1 flex-col fixed ">
//       <div className="w-full h-auto sticky top-0 left-0 ">
//         <TopBar />
//       </div>
//       <div className="w-full h-full flex flex-1  flex-row gap-3 p-5 overflow-auto ">
//         <div className="w-full  flex-1 flex-col  ">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }