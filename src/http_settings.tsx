import axios from "axios";
import { response } from "express";

const URL:string = process.env.REACT_APP_BASE_URL!;

const app = axios.create({
    // baseURL: "http://localhost:8000/",
    baseURL: URL,
    // baseURL: "https://gpsrehiyononse.online/",
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

app.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log(process.env)
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // config.withCredentials = true;
            // config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

app.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;

        if (status === 401 && !originalRequest._retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    window.location.href = '/login';
                    return Promise.reject({ ...error, status });
                }

                try {
                    // const response = await axios.post('https://gpsrehiyononse.online/api/token/refresh/', { refresh: refreshToken });
                    // const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
                    const response = await axios.post(`${URL}api/token/refresh/`, { refresh: refreshToken });
                    const { access: newToken } = response.data;
                    localStorage.setItem('access_token', newToken);
                    isRefreshing = false;

                    originalRequest._retry = true;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return app(originalRequest);
                } catch (refreshError) {
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    refreshSubscribers = [];
                }
            } else {
                return new Promise((resolve) => {
                    refreshSubscribers.push((token: any) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(app(originalRequest));
                    });
                });
            }
        }

        // Pass the error status to the component
        return Promise.reject({ ...error, status });
    }
);


export default app;
