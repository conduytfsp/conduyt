import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosInstance } from '@/config/axiosConfig';

export default function Logout() {
    const navigate = useNavigate();
    const axios = useAxiosInstance();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // 1. Tell Spring Security to invalidate the session and clear HttpOnly cookies
                await axios.post('/api/auth/logout');
            } catch (error) {
                console.warn("Backend logout failed or session already expired. Forcing local cleanup...", error);
            } finally {
                // 2. Wipe all frontend storage
                localStorage.clear();
                sessionStorage.clear();

                // 3. Wipe any frontend-accessible cookies (just to be thorough)
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                // 4. Redirect to the homepage, replacing the history state so they can't hit "Back"
                navigate('/', { replace: true });
            }
        };

        performLogout();
    }, [navigate, axios]);

    // Render a minimal spinner while the cleanup happens (usually takes < 200ms)
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] font-sans">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1798D7] border-t-transparent mb-4"></div>
            <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">Logging out...</p>
        </div>
    );
}