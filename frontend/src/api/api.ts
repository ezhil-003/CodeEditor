import axios from 'axios'
import { SignupForm } from '../@types/types';

const BASE_URL = import.meta.env.VITE_BASE_URL

const apiClient = axios.create({
    baseURL: BASE_URL || 'http://localhost:8000',
});

//register User function
export const registerUser = async (userData: SignupForm) => {
    try {
        const response = await apiClient.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Signup API Error:', error);
        throw new Error('Signup Failed check inputs');
    }
};

export const loginUser = async (loginData: { email: string; password: string }) => {
    try {

        const response = await apiClient.post('/login', loginData); // Assuming your login endpoint is '/login'
        return response.data;
    } catch (error) {
        console.error('Login API Error:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
};

export const refreshToken = async (decryptedRefreshToken: string) => {
    const { data } = await axios.post('/api/refresh', {
        refreshToken: decryptedRefreshToken,
    }, {
        headers: {
            'Authorization': `Bearer ${decryptedRefreshToken}`
        }
    });
    return data.accessToken;
}