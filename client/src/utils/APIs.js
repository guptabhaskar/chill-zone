import axios from 'axios';

// To connect frontend to backend APIs
const APIconfig = {
    // baseURL: 'http://localhost:5000',
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }
}

export const API = axios.create(APIconfig);