import { useEffect, useState } from 'react';
import type { DashboardData } from '../../types/KPI';
import KPICard from './KPICard.tsx';
import KPIDonutChart from './KPIDonutChart.tsx';
import KPIBarChart from './KPIBarChart.tsx';
import './KPIDashBoard.css';

interface KpiDashboardProps {
  filters: {
    status?: string;
    priority?: string;
    team?: string;
    assigned_person?: string;
    startDate?: string;
    endDate?: string;
  };
  onChartSelection?: (selection: {
    key: 'STATUS' | 'PRIORITY' | 'TEAM' | 'CATEGORY_TIER_1' | 'CATEGORY_TIER_2' | 'CATEGORY_TIER_3';
    value: string;
    source: string;
  } | null) => void;
}

type TabType = 'all' | 'overview' | 'categories' | 'teams';

export const KpiDashboard = ({ filters, onChartSelection }: KpiDashboardProps) => {
const [data, setData] = useState<DashboardData | null>(null);
const [activeTab, setActiveTab] = useState<TabType>('all');

  const topCategoryTier2 = (data?.category_tier_2 ?? []).slice(0, 10);
  const topCategoryTier3 = (data?.category_tier_3 ?? []).slice(0, 10);

  useEffect(() => {
    // 1. Instantly clear data to show user that an active update is happening
    setData(null); 
    
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.team) params.append('team', filters.team);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    fetch(`http://127.0.0.1:8000/kpi/dashboard?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .catch(err => {
        console.error("Failed to fetch KPIs:", err);
      });
  }, [filters]);

  // 2. If data is null, it means we are actively waiting on a fetch request!
  if (!data) return <p>Updating Analytics...</p>;


return (
    <div className="kpi-dashboard-container">
      {/* Tab Navigation */}
      <div className="tabs">
        {(['all', 'overview', 'categories', 'teams'] as TabType[]).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="kpi-grid">
        {/* Tab 1: Overview */}
        {(activeTab === 'all' || activeTab === 'overview') && (
          <>
            <div className="stat-card">
              <KPICard kpi={data.total_tickets} />
              <KPICard kpi={data.avg_res_time} />
              <KPICard kpi={data.unresolved_tickets} />
              <KPICard kpi={data.resolved_tickets} />
              <KPICard kpi={data.overdue_tickets} />
            </div>
            <div className="chart-card">
              <KPIDonutChart
                title="Tickets by Status"
                data={data.tickets_by_status}
                nameKey="status"
                dataKey="count"
                onItemClick={(item) => {
                  if (onChartSelection) {
                    onChartSelection({
                      key: 'STATUS',
                      value: item.status,
                      source: 'Tickets by Status',
                    });
                  }
                }}
              />
              <KPIBarChart
                title="Tickets by Priority"
                data={data.tickets_by_priority}
                xKey="priority"
                yKey="count"
                onItemClick={(item) => {
                  if (onChartSelection) {
                    onChartSelection({
                      key: 'PRIORITY',
                      value: item.priority,
                      source: 'Tickets by Priority',
                    });
                  }
                }}
              />
            </div>
          </>
        )}

        {/* Tab 2: Categories */}
        {(activeTab === 'all' || activeTab === 'categories') && (
          <div className="chart-card">
            <KPIDonutChart
              title="Category Tier 1"
              data={data.category_tier_1}
              nameKey="category"
              dataKey="count"
              onItemClick={(item) => {
                if (onChartSelection) {
                  onChartSelection({
                    key: 'CATEGORY_TIER_1',
                    value: item.category,
                    source: 'Category Tier 1',
                  });
                }
              }}
            />
            <KPIBarChart
              title="Category Tier 2 (Top 10)"
              data={topCategoryTier2}
              xKey="category"
              yKey="count"
              onItemClick={(item) => {
                if (onChartSelection) {
                  onChartSelection({
                    key: 'CATEGORY_TIER_2',
                    value: item.category,
                    source: 'Category Tier 2',
                  });
                }
              }}
            />
            <KPIBarChart
              title="Category Tier 3 (Top 10)"
              data={topCategoryTier3}
              xKey="category"
              yKey="count"
              onItemClick={(item) => {
                if (onChartSelection) {
                  onChartSelection({
                    key: 'CATEGORY_TIER_3',
                    value: item.category,
                    source: 'Category Tier 3',
                  });
                }
              }}
            />
          </div>
        )}

        {/* Tab 3: Teams */}
        {(activeTab === 'all' || activeTab === 'teams') && (
          <div className="chart-card">
            <KPIBarChart
              title="Tickets per Team"
              data={data.tickets_per_team}
              xKey="team"
              yKey="count"
              onItemClick={(item) => {
                if (onChartSelection) {
                  onChartSelection({
                    key: 'TEAM',
                    value: item.team,
                    source: 'Tickets per Team',
                  });
                }
              }}
            />
            <KPIBarChart title="Avg Resolution Time per Team" data={data.avg_res_time_per_team} xKey="team" yKey="average_resolution_time_hours" />
          </div>
        )}
      </div>
    </div>
  );
};