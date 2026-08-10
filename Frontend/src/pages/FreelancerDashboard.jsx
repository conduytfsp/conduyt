import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProfileTab from '@/features/profile/ProfileTab';
import PortfolioTab from '@/features/portfolio/PortfolioTab';
import ApplicationsTab from '@/features/applications/ApplicationsTab';
import AnalyticsTab from '@/features/analytics/AnalyticsTab';
import SecurityTab from '@/features/security/SecurityTab';
import FreelancerExtrasView from '@/components/layout/FreelancerExtrasView'; // FIX: Import the new component
import Footer from '../components/layout/Footer';

/**
 * FreelancerDashboard
 * --------------------
 * The single entry point for the freelancer side of Conduyt.
 */
export default function FreelancerDashboard() {
  return <>
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* FIX 1: Use absolute path for index redirect */}
        <Route index element={<Navigate to="/dashboard/profile" replace />} />

        <Route path="profile" element={<ProfileTab />} />
        <Route path="portfolio" element={<PortfolioTab />} />
        <Route path="applications" element={<ApplicationsTab />} />
        <Route path="analytics" element={<AnalyticsTab />} />
        <Route path="security" element={<SecurityTab />} />
        <Route path="extras" element={<FreelancerExtrasView />} /> {/* FIX: Added Extras route */}

        {/* FIX 2: Use absolute path for the catch-all redirect to prevent recursive loops */}
        <Route path="*" element={<Navigate to="/dashboard/profile" replace />} />
      </Route>
    </Routes>
    <Footer/>
  </>
}