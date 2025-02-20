// src/api/api.ts
import axios from 'axios'
import { SignupForm } from '../@types/types';
import { decryptRefreshToken } from '../utils/encryption';

const BASE_URL = import.meta.env.VITE_BASE_URL

const publicClient = axios.create({
    baseURL: BASE_URL || 'http://localhost:8000',
});

const privateClient = axios.create({
    baseURL: `${BASE_URL}/user`,
});

// Attach Authorization token using interceptors
privateClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



//register User function
export const registerUser = async (userData: SignupForm) => {
    try {
        const response = await publicClient.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Signup API Error:', error);
        throw new Error('Signup Failed check inputs');
    }
};

export const loginUser = async (loginData: { email: string; password: string }) => {
    try {

        const response = await publicClient.post('/login', loginData); // Assuming your login endpoint is '/login'
        return response.data;
    } catch (error) {
        console.error('Login API Error:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
};


// Private client request starts here ❗️❗️
export async function refreshAccessToken(refreshToken: string) {
    try {
      const response = await privateClient.post("/user/refresh", { refreshToken });
      return response.data.accessToken;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || "Token refresh failed");
    }
}

export async function createProject(name: string, template: string) {
    try {
        const response = await privateClient.post(
            '/createProject',
            { name, template },
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error?.message || 'Failed to create project');
    }
}

export const getRecentProjects = async () => {
    try {

        const response = await privateClient.get(`/getAllProjects`, {
            timeout: 10000, // 10s timeout
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        return response.data.projects;
    } catch (error: any) {
        console.error("Error fetching projects:", error.message);

        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                throw new Error("Unauthorized: Please log in again.");
            }
            if (error.response.status === 403) {
                throw new Error("Forbidden: You do not have permission.");
            }
            if (error.response.status === 404) {
                throw new Error("Not Found: Projects not available.");
            }

            throw new Error(`Server Error: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error("Network Error: No response from server");
        } else {
            throw new Error("Unexpected Error: " + error.message);
        }
    }
};

