import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Sparkles, Briefcase, CheckCircle2, ChevronRight } from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
    const axiosInstance = useAxiosInstance();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    // 1. Fetch existing notification history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get("/api/notifications");
                setNotifications(res.data || []);
            } catch (err) {
                console.warn("Could not fetch notification history.");
            }
        };
        fetchHistory();
    }, [axiosInstance]);

    // 2. Connect to SSE Stream for Real-Time Updates
    useEffect(() => {
        const eventSource = new EventSource("/api/notifications/stream", { withCredentials: true });

        eventSource.addEventListener("notification", (event) => {
            const newAlert = JSON.parse(event.data);
            setNotifications((prev) => [newAlert, ...prev]);
        });

        return () => eventSource.close();
    }, [axiosInstance]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Handle clicking a notification
    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read on backend if unread
            if (!notification.isRead) {
                await axiosInstance.patch(`/api/notifications/${notification.id}/read`);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                );
            }
        } catch (err) {
            console.error("Failed to mark notification read", err);
        }

        setIsOpen(false);
        if (notification.targetUrl) {
            navigate(notification.targetUrl);
        }
    };

    // Helper icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "AI_CANDIDATE": return <Sparkles size={16} className="text-[#09D66D]" />;
            case "JOB_MATCH": return <Briefcase size={16} className="text-[#1798D7]" />;
            default: return <CheckCircle2 size={16} className="text-slate-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                        <span className="text-xs font-semibold text-slate-400">
                            {unreadCount} unread
                        </span>
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-4 transition-colors cursor-pointer flex gap-3 items-start hover:bg-slate-50 ${
                                        !n.isRead ? "bg-blue-50/30" : "bg-white"
                                    }`}
                                >
                                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                                        {getNotificationIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-xs font-bold truncate ${!n.isRead ? "text-slate-900" : "text-slate-700"}`}>
                                                {n.title}
                                            </p>
                                            {!n.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-[#1798D7] shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 self-center shrink-0" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}