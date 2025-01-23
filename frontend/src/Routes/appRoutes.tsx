import { Children, lazy } from "react";
import { Navigate, useLocation } from 'react-router';
import { useAuth } from "../Contexts/AuthContext.tsx";

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
        path: '/dashboard',
        element: <Dashboard />,
        exact: true,
    },
]



export function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const location = useLocation();
    if (!token) {
        // Redirect to the login page with the current location as the 'from' parameter
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    return children;
}

