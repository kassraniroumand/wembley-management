import axios from 'axios';
import { YearlyEventStatsDTO } from './YearlyEventStatsDTO';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getYearlyEventStats = async (year: number): Promise<YearlyEventStatsDTO> => {
    try {
        const response = await api.get<YearlyEventStatsDTO>(`/analytics/events/monthly/${year}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching yearly event stats:', error);
        throw error;
    }
};

export default {
    getYearlyEventStats
};
