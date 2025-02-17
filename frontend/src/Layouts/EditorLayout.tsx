import { Outlet } from "react-router"


type Props = {}

export default function EditorLayout({}: Props) {
  return (
    <div className="m-0 p-0 box-border w-full min-h-screen h-full flex flex-1 flex-col fixed">
      <header className="w-full h-auto sticky top-0 left-0 ">
        <></>
      </header>
      <div className="w-full h-full flex flex-1  flex-row gap-3 p-5 overflow-auto ">
        <main className="w-full  flex-1 flex-col ">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

