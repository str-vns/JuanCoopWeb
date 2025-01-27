import React from 'react';
import Sidebar from "./sidebar";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
        <Sidebar />
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Overview</h2>
          <p>Welcome to the admin dashboard. Here you can manage users, view analytics, and configure settings.</p>
        </section>
        <section className="dashboard-section">
          <h2>Users</h2>
          <p>Manage user accounts, roles, and permissions.</p>
        </section>
        <section className="dashboard-section">
          <h2>Analytics</h2>
          <p>View site performance and user engagement metrics.</p>
        </section>
        <section className="dashboard-section">
          <h2>Settings</h2>
          <p>Configure system preferences and other settings.</p>
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; 2025 Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
