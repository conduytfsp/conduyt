import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ClientDashboardLayout from "@/components/dashboard/ClientDashboardLayout";
import OverviewTab from "@/components/dashboard/OverviewTab";
import ClientProfile from "@/components/dashboard/ClientProfile";
import PersonalDetailsView from "@/components/dashboard/PersonalDetailsView";
import CompanyDetailsView from "@/components/dashboard/CompanyDetailsView";
import JobManagementView from "@/components/dashboard/JobManagementView";
import AnalyticsView from "@/components/dashboard/AnalyticsView";
import SecurityView from "@/components/dashboard/SecurityView";
import ExtrasView from "@/components/dashboard/ExtrasView";

export default function ClientDashboard() {
  return (
    <Routes>
      <Route element={<ClientDashboardLayout />}>
        
        {/* Default dashboard page */}
        <Route
          index
          element={<Navigate to="overview" replace />}
        />

        {/* Child Routes */}
        <Route path="overview" element={<OverviewTab />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="personal" element={<PersonalDetailsView />} />
        <Route path="company" element={<CompanyDetailsView />} />
        <Route path="jobs/*" element={<JobManagementView />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="security" element={<SecurityView />} />
        <Route path="extras" element={<ExtrasView />} />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="overview" replace />}
        />

      </Route>
    </Routes>
  );
}