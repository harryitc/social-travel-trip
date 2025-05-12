import { AxiosRequestConfig } from 'axios';

export const axiosRequestConfiguration: AxiosRequestConfig = {
    timeout: 10000,
    // baseURL: 'http://localhost:3000',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
};