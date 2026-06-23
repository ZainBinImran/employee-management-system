import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.data))
      .catch(() => setError('Could not load dashboard. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-status">Loading dashboard...</div>;
  if (error)   return <div className="page-status error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Employee Management System Overview</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Employees"  value={stats.totalEmployees}  icon="👤" color="#3b82f6" />
        <StatCard label="Departments"      value={stats.totalDepartments} icon="🏢" color="#10b981" />
        <StatCard label="New This Month"   value={stats.newThisMonth}    icon="🆕" color="#f59e0b" />
        <StatCard label="Avg Salary"       value={`$${Number(stats.avgSalary).toLocaleString()}`} icon="💰" color="#8b5cf6" />
      </div>

      {stats.recentHires && stats.recentHires.length > 0 && (
        <div className="card">
          <h2>Recent Hires</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Department</th><th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentHires.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.department_name}</td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;