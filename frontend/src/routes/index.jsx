import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { DashboardPage } from "../pages/DashboardPage";
import { TrainingCentresPage } from "../pages/TrainingCentresPage";
import { LiveCameraMonitoringPage } from "../pages/LiveCameraMonitoringPage";
import { AttendanceAnalyticsPage } from "../pages/AttendanceAnalyticsPage";
import { InfrastructureCompliancePage } from "../pages/InfrastructureCompliancePage";
import { AIDetectionEventsPage } from "../pages/AIDetectionEventsPage";
import { EvidenceReportsPage } from "../pages/EvidenceReportsPage";
import { AlertsNotificationsPage } from "../pages/AlertsNotificationsPage";
import { SanctionedInventoryPage } from "../pages/SanctionedInventoryPage";
import { UserManagementPage } from "../pages/UserManagementPage";
import { SettingsPage } from "../pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="centres" element={<TrainingCentresPage />} />
        <Route path="cameras" element={<LiveCameraMonitoringPage />} />
        <Route path="attendance" element={<AttendanceAnalyticsPage />} />
        <Route path="infrastructure" element={<InfrastructureCompliancePage />} />
        <Route path="events" element={<AIDetectionEventsPage />} />
        <Route path="reports" element={<EvidenceReportsPage />} />
        <Route path="alerts" element={<AlertsNotificationsPage />} />
        <Route path="inventory" element={<SanctionedInventoryPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
