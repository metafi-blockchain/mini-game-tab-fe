// src/axiosInstance.ts

import { config } from '@/config';
import { ACCESS_TOKEN } from '@/constants';
import axios, {
	AxiosResponse,
	AxiosError,
	InternalAxiosRequestConfig
} from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
	baseURL: config.BASE_URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Do something before the request is sent
		// For example, add an authorization token to headers
		config.headers['Access-Control-Allow-Origin'] = '*';
		config.headers['Access-Control-Allow-Methods'] =
			'GET,PUT,POST,DELETE,PATCH,OPTIONS';
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		// Handle request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		// Do something with response data
		return response;
	},
	(error: AxiosError) => {
		// Handle response error
		if (error.response?.status === 401) {
			// Handle unauthorized error, e.g., redirect to login
			window.location.href = '/loading';
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
