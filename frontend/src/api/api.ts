import axios, { AxiosInstance } from 'axios'
import { SignupForm, ApiRequestOptions } from '../@types/types';

const BASE_URL = import.meta.env.VITE_BASE_URL

const publicClient = axios.create({
    baseURL: BASE_URL || 'http://localhost:8000',
});

const createPrivateClient = (accessToken: string): AxiosInstance => {
    return axios.create({
        baseURL: `${BASE_URL}/user`,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
};

export const makeRequestWithAccessToken = async (
    accessToken: string,
    url: string,
    options: ApiRequestOptions = {}
): Promise<any> => {
    try {
        const privateClient = createPrivateClient(accessToken);
        const { method = 'GET', data } = options;

        const response = await privateClient({
            method,
            url,
            data,
        });

        return response.data;
    } catch (error) {
        // Handle request errors (e.g., 401 Unauthorized, network issues)
        console.error('Request error:', error);
        // More specific error handling:
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized (token expired)
            // Attempt to refresh the token here
            // ... 
        }
        throw error; // Re-throw the error for handling in the calling function
    }
};


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
    const privateClient = createPrivateClient(decryptedRefreshToken); // Create private client with refresh token

    try {
        const response = await privateClient.post('/api/refresh', {
            refreshToken: decryptedRefreshToken,
        });
        return response.data.accessToken;
    } catch (error) {
        // Handle refresh token error (e.g., log the error, display an error message)
        console.error('Refresh token error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};