import {
  seedProfile,
  seedPortfolio,
  seedApplications,
  seedAnalytics,
  seedSecurity,
} from '@/lib/mockData';

/**
 * Mock mode lets the whole dashboard run with zero backend calls — no proxy
 * errors, no ECONNREFUSED spam — until your Spring Boot API is ready.
 *
 * Toggle it with an env var:
 *   VITE_API_MODE=live   -> real requests via the axios instance / Vite proxy
 *   (anything else, or unset) -> in-memory mock responses (default)
 *
 * Set VITE_API_MODE=live in a .env.local file once your backend is running
 * at the address configured in vite.config.js.
 */
const IS_MOCK = import.meta.env.VITE_API_MODE !== 'live';

// Small helper to keep mock responses feeling like real network calls
// (so loading states / skeletons are still visible during development).
const mockResolve = (data, ms = 350) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

// In-memory store so edits made in mock mode persist for the session.
const mockStore = {
  profile: { ...seedProfile },
  portfolio: { ...seedPortfolio },
  applications: seedApplications.map((a) => ({ ...a })),
  analytics: { ...seedAnalytics },
  security: { ...seedSecurity },
};

/**
 * Thin API layer. Every function takes the shared axios instance
 * (from useAxiosInstance) so interceptors, CSRF, and auth redirects
 * stay centralized in one place. In mock mode the axios instance is
 * simply ignored and an in-memory response is returned instead.
 */
export const freelancerApi = {
  // ---- Tab 1: Professional Profile -------------------------------------
  getProfile: (axios) => (IS_MOCK ? mockResolve(mockStore.profile) : axios.get('/api/freelancer/profile').then((r) => r.data)),

  updateProfile: (axios, payload) => {
    if (IS_MOCK) {
      mockStore.profile = { ...mockStore.profile, ...payload };
      return mockResolve(mockStore.profile);
    }
    return axios.put('/api/freelancer/profile', payload).then((r) => r.data);
  },

  uploadAvatar: (axios, file) => {
    if (IS_MOCK) {
      const url = URL.createObjectURL(file);
      mockStore.profile.avatarUrl = url;
      return mockResolve({ url });
    }
    const formData = new FormData();
    formData.append('avatar', file);
    return axios
      .post('/api/freelancer/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  // ---- Tab 2: Portfolio & Assets -----------------------------------------
  getPortfolio: (axios) => (IS_MOCK ? mockResolve(mockStore.portfolio) : axios.get('/api/freelancer/portfolio').then((r) => r.data)),

  updatePortfolioLinks: (axios, payload) => {
    if (IS_MOCK) {
      mockStore.portfolio = { ...mockStore.portfolio, ...payload };
      return mockResolve(mockStore.portfolio);
    }
    return axios.put('/api/freelancer/portfolio/links', payload).then((r) => r.data);
  },

  uploadResume: (axios, file) => {
    if (IS_MOCK) {
      const res = { url: URL.createObjectURL(file), fileName: file.name };
      mockStore.portfolio.resumeUrl = res.url;
      mockStore.portfolio.resumeFileName = res.fileName;
      return mockResolve(res);
    }
    const formData = new FormData();
    formData.append('resume', file);
    return axios
      .post('/api/freelancer/portfolio/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  // ---- Tab 3: Applications ------------------------------------------------
  getApplications: (axios) =>
    IS_MOCK ? mockResolve(mockStore.applications) : axios.get('/api/freelancer/applications').then((r) => r.data),

  withdrawApplication: (axios, applicationId) => {
    if (IS_MOCK) {
      mockStore.applications = mockStore.applications.map((a) =>
        a.id === applicationId ? { ...a, status: 'withdrawn' } : a,
      );
      return mockResolve({ success: true });
    }
    return axios.post(`/api/freelancer/applications/${applicationId}/withdraw`).then((r) => r.data);
  },

  // ---- Tab 4: Analytics ----------------------------------------------------
  getAnalytics: (axios) => (IS_MOCK ? mockResolve(mockStore.analytics) : axios.get('/api/freelancer/analytics').then((r) => r.data)),

  // ---- Tab 5: Security -------------------------------------------------------
  getSecuritySettings: (axios) =>
    IS_MOCK ? mockResolve(mockStore.security) : axios.get('/api/freelancer/security').then((r) => r.data),

  changePassword: (axios, payload) => {
    if (IS_MOCK) return mockResolve({ success: true });
    return axios.post('/api/freelancer/security/change-password', payload).then((r) => r.data);
  },

  toggleTwoFactor: (axios, enabled) => {
    if (IS_MOCK) {
      mockStore.security = { ...mockStore.security, twoFactorEnabled: enabled };
      return mockResolve(mockStore.security);
    }
    return axios.post('/api/freelancer/security/2fa', { enabled }).then((r) => r.data);
  },

  verifyTwoFactorOtp: (axios, otp) => {
    if (IS_MOCK) return mockResolve({ success: true, otp });
    return axios.post('/api/freelancer/security/2fa/verify', { otp }).then((r) => r.data);
  },
};
