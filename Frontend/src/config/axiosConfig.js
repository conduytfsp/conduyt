import { useMemo } from 'react';
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

    const axiosInstance = useMemo(() => {
        // 1. Create the base instance
        const instance = axios.create({
            baseURL: '/backend_url',
            timeout: 60000,
            withCredentials: true, // CRITICAL: Ensures Cookies (JWT & XSRF) are sent/received
        });

        // 2. Request Interceptor: Handle CSRF Token
        instance.interceptors.request.use((config) => {
            // We no longer need to manually add the Authorization header.
            // The HttpOnly cookie handles the JWT automatically.

            // However, we MUST handle CSRF for non-GET requests (usually).
            // Spring expects the token from the 'XSRF-TOKEN' cookie to be in the 'X-XSRF-TOKEN' header.
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

                // Check for 401 (Unauthorized) or 403 (Forbidden)
                if (status === 401 || status === 403) {
                    console.warn("Axios Interceptor: Auth error detected. Redirecting to login.");

                    // Note: We cannot remove the HttpOnly cookie from here (client-side).
                    // We just redirect. The backend 'logout' endpoint is responsible for clearing it.

                    if (typeof window !== 'undefined') {
                        navigate('/login', { state: { showAuthErrorModal: true } });
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }, [navigate]);

    return axiosInstance;
}