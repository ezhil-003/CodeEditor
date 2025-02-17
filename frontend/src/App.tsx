import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import Notfound from "./Pages/Notfound";
import Loading from "./Components/utils/Loading";
import { publicRoutes, UserRoutes } from "./Routes/appRoutes";
import { ProtectedRoutes } from "./Routes/ProtectedRoutes.tsx";
import { ThemeProvider } from './Contexts/ThemeContext.tsx';
import { AuthProvider } from "./Contexts/AuthContext.tsx";
import UserLayout from "./Layouts/UserLayout.tsx";
import EditorLayout from "./Layouts/EditorLayout.tsx";

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <MainLayout />
        </Suspense>
      ),  // Use MainLayout directly here
      children: publicRoutes,
    },
    {
      path: "/user",
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedRoutes>
            <UserLayout />
          </ProtectedRoutes>
        </Suspense>
      ),
      children: UserRoutes,
    },
    {
      path:"/user/editor/:project_id",
      element:(
        <Suspense fallback={<Loading />}>
          <ProtectedRoutes>
            <EditorLayout />
          </ProtectedRoutes>
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <>
          <Notfound />
        </>
      ),
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
