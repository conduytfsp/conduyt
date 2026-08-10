import { useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Helper function to retrieve a cookie value by name.
 * Necessary for extracting the XSRF-TOKEN.
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export function useAxiosInstance() {
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    const axiosInstance = useMemo(() => {
        // 1. Create the base instance
        const instance = axios.create({
            baseURL: '/api',
            timeout: 60000,
            withCredentials: true, // CRITICAL: Ensures Cookies (JWT & XSRF) are sent/received
        });

        // 2. Request Interceptor: Handle URL Normalization & CSRF Token
        instance.interceptors.request.use((config) => {
            // BULLETPROOF FIX: Prevent double /api/api/ if components request '/api/...'
            if (config.url) {
                if (config.url.startsWith('/api/')) {
                    config.url = config.url.replace(/^\/api/, '');
                } else if (config.url === '/api') {
                    config.url = '';
                }
            }

            // Attach CSRF Token for non-GET requests
            const xsrfToken = getCookie('XSRF-TOKEN');
            if (xsrfToken) {
                config.headers['X-XSRF-TOKEN'] = xsrfToken;
            }

            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // 3. Response Interceptor: Handle Auth Errors
        instance.interceptors.response.use(
            response => response,
            (error) => {
                const status = error.response?.status;

                if (status === 401 || status === 403) {
                    console.warn("Axios Interceptor: Auth error detected. Redirecting to login.");

                    if (typeof window !== 'undefined') {
                        navigateRef.current('/login', { state: { showAuthErrorModal: true } });
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }, []);

    return axiosInstance;
}