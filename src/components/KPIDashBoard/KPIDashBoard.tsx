import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../../types/KPI';
import KPICard from './KPICard.tsx';
import KPIDonutChart from './KPIDonutChart.tsx';
import KPIBarChart from './KPIBarChart.tsx';


export const KpiDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/kpi/dashboard')
      .then(res => res.json())
      .then(json => {
        console.log("KPI dashboard data:", json)
        setData(json)
      });
  }, []);

  if (!data) return <p>Loading Analytics...</p>;

  return (
    <div className="kpi-grid">
      {/* 1. Stat Cards */}
      <div className="stat-card">
        <KPICard kpi = {data.total_tickets}/>
        <KPICard kpi = {data.avg_res_time}/>
        <KPICard kpi = {data.unresolved_tickets}/>
        <KPICard kpi = {data.resolved_tickets}/>
        <KPICard kpi = {data.overdue_tickets}/>
      </div>

      {/* 2. Status Donut Chart */}
      <div className="chart-card">
        <KPIDonutChart
          title="Tickets by Status"
          data={data.tickets_by_status}
          nameKey="status"
          dataKey="count"
        />

        {/* 3. Category Tier I Donut Chart */}
        <KPIDonutChart
          title="Category Tier 1"
          data={data.category_tier_1}
          nameKey="category"
          dataKey="count"
        />

        {/* 4. Category Tier II Donut Chart */}
        <KPIDonutChart
          title="Category Tier 2"
          data={data.category_tier_2}
          nameKey="category"
          dataKey="count"
        />

        {/* 5. Category Tier III Donut Chart */}
        <KPIDonutChart
          title="Category Tier 3"
          data={data.category_tier_3}
          nameKey="category"
          dataKey="count"
        />
      </div>

      {/* 6. Priority Bar Chart */}
      <div className="chart-card">
        <KPIBarChart
          title="Tickets by Priority"
          data={data.tickets_by_priority}
          xKey="priority"
          yKey="count"
        />

        {/* 7. Tickets Per Team Bar Chart */}
        <KPIBarChart
          title="Tickets per Team"
          data={data.tickets_per_team}
          xKey="team"
          yKey="count"
        />

        {/* 8. Average Resolution Time Per Team Bar Chart */}
        <KPIBarChart
          title="Average Resolution Time per Team"
          data={data.avg_res_time_per_team.data}
          xKey="team"
          yKey="average_resolution_time_hours"
        />
      </div>
    </div>
  );
};