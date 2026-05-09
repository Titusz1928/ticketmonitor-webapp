export interface StatusKPI {
  status: string;
  count: number;
}

export interface PriorityKPI {
  priority: string;
  count: number;
}

export interface DashboardData {
  total_tickets: { label: string; value: number };
  tickets_by_status: StatusKPI[];
  tickets_by_priority: PriorityKPI[];
}