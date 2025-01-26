import { lazy } from "react";

const Signin = lazy(() => import("../Pages/Signin.tsx"));
const Signup = lazy(() => import("../Pages/Signup.tsx"));
const Home = lazy(() => import("../Pages/Home.tsx"));
const Dashboard = lazy(() => import("../Pages/Dashboard.tsx"))


export const publicRoutes = [
    {
        path: '/',
        element: <Home />,
        exact: true,
    },
    {
        path: '/signin',
        element: <Signin />,
        exact: true
    },
    {
        path: '/signup',
        element: <Signup />,
        exact: true
    },

]

export const UserRoutes = [
    {
        path: '/user/dashboard',
        element: <Dashboard />,
        exact: true,
    },
]


