import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ClientDashboardLayout from "@/components/dashboard/ClientDashboardLayout";
import OverviewTab from "@/components/dashboard/OverviewTab";
import PersonalDetailsView from "@/components/dashboard/PersonalDetailsView";
import CompanyDetailsView from "@/components/dashboard/CompanyDetailsView";
import JobManagementView from "@/components/dashboard/JobManagementView";
import AnalyticsView from "@/components/dashboard/AnalyticsView";
import SecurityView from "@/components/dashboard/SecurityView";
import ExtrasView from "@/components/dashboard/ExtrasView";
import Footer from "@/components/Footer.jsx"; // Added to match Freelancer side

export default function ClientDashboard() {
  return (
      <>
        <Routes>
          <Route element={<ClientDashboardLayout />}>

            {/* FIX 1: Use absolute path for index redirect to prevent recursive loops */}
            <Route index element={<Navigate to="/dashboard/personal" replace />}/>

            {/* Child Routes */}
            <Route path="overview" element={<OverviewTab />} />
            <Route path="personal" element={<PersonalDetailsView />} />
            <Route path="company" element={<CompanyDetailsView />} />
            <Route path="jobs/*" element={<JobManagementView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="security" element={<SecurityView />} />
            <Route path="extras" element={<ExtrasView />} />

            {/* FIX 2: Use absolute path for catch-all redirect */}
            <Route
                path="*"
                element={<Navigate to="/dashboard/personal" replace />}
            />

          </Route>
        </Routes>
        <Footer />
      </>
  );
}