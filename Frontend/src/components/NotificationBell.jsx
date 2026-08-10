import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Open a persistent HTTP stream connection to Spring Boot
        const eventSource = new EventSource("/api/notifications/stream", { withCredentials: true });

        // Listen for incoming real-time notifications
        eventSource.addEventListener("notification", (event) => {
            const newAlert = JSON.parse(event.data);

            // Instantly update UI without refreshing or polling
            setNotifications((prev) => [newAlert, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        eventSource.onerror = (err) => {
            console.error("SSE connection error. Browser will auto-reconnect...", err);
        };

        // Cleanup connection when component unmounts
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="relative cursor-pointer">
            <Bell className="text-slate-600 hover:text-[#1798D7] transition-colors" size={20} />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                    {unreadCount}
                </span>
            )}
        </div>
    );
}