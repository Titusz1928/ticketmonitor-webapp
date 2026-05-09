import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DashboardData } from '../../types/KPI';


const COLORS = ['#0011ff', '#00e5ff', '#ffbb28', '#ff8042', '#000000'];

export const KpiDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/kpi/dashboard')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  if (!data) return <p>Loading Analytics...</p>;

  return (
    <div className="kpi-grid">
      {/* 1. Stat Card */}
      <div className="stat-card">
        <h3>{data.total_tickets.label}</h3>
        <p className="stat-value">{data.total_tickets.value}</p>
      </div>

      {/* 2. Status Donut Chart */}
      <div className="chart-card">
        <h3>Tickets by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data.tickets_by_status}
              nameKey="status"
              dataKey="count"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {data.tickets_by_status.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Priority Bar Chart */}
      <div className="chart-card">
        <h3>Tickets by Priority</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.tickets_by_priority}>
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0011ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};