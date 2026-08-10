import { create } from 'zustand';

// Helper to check cookie on initial load
const getInitialMode = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; active_mode=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return 'freelancer'; // Default fallback
};

export const useAppStore = create((set) => ({
    // Initialize directly from the cookie for zero-delay rendering
    mode: getInitialMode(),

    // Toggle flips it
    toggleMode: () => set((state) => {
        const newMode = state.mode === 'freelancer' ? 'client' : 'freelancer';
        document.cookie = `active_mode=${newMode}; path=/; SameSite=Lax; max-age=604800`; // Keep cookie in sync (7 days)
        return { mode: newMode };
    }),

    // setMode explicitly sets it
    setMode: (newMode) => set({ mode: newMode }),
}));