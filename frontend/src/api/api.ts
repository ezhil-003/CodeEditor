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

export const refreshToken = async (decryptedRefreshToken: string) => {
    try {
        const response = await privateClient.post('/refresh', {
            refreshToken: decryptedRefreshToken,
        });
        return response.data.accessToken;
    } catch (error) {
        // Handle refresh token error (e.g., log the error, display an error message)
        console.error('Refresh token error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};

export async function createProject(name: string, template: string, Authorization: string) {
    try {
        const response = await privateClient.post('/api/projects', {
          name,
          template,
        }, { // Add the headers object as the third argument to post
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Authorization}`,
          },
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create project';
        throw new Error(errorMessage);
      }
  }

  