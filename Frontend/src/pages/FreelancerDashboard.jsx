import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProfileTab from '@/features/profile/ProfileTab';
import PortfolioTab from '@/features/portfolio/PortfolioTab';
import ApplicationsTab from '@/features/applications/ApplicationsTab';
import AnalyticsTab from '@/features/analytics/AnalyticsTab';
import SecurityTab from '@/features/security/SecurityTab';
import FreelancerNav from "../components/layout/FreelancerNav"
import Footer from '../components/layout/Footer';

/**
 * FreelancerDashboard
 * --------------------
 * The single entry point for the freelancer side of Conduyt. It wraps the
 * sidebar shell (DashboardLayout — nav, avatar, Freelancer/Client mode
 * switch) around the five assigned tabs and owns the routing between them:
 *
 *   /profile        Tab 1 — Professional Profile (storefront)
 *   /portfolio       Tab 2 — Portfolio & Assets
 *   /applications    Tab 3 — My Applications
 *   /analytics       Tab 4 — Analytics
 *   /security        Tab 5 — Security
 *
 * Mount this once under a parent route (see App.jsx), e.g.
 *   <Route path="/dashboard/*" element={<FreelancerDashboard />} />
 * and every path below is relative to that base.
 */
export default function FreelancerDashboard() {
  return <>
    <FreelancerNav/>
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="portfolio" element={<PortfolioTab />} />
        <Route path="applications" element={<ApplicationsTab />} />
        <Route path="analytics" element={<AnalyticsTab />} />
        <Route path="security" element={<SecurityTab />} />
        <Route path="*" element={<Navigate to="profile" replace />} />
      </Route>
    </Routes>
    <Footer/>
  </>
}
