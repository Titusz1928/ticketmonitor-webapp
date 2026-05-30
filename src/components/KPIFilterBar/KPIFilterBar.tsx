import React from 'react';
import './KPIFilterBar.css';

export interface FiltersState {
  status: string;
  priority: string;
  team: string;
  startDate: string;
  endDate: string;
}

interface KPIFilterBarProps {
  filters: FiltersState;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  onClearFilters: () => void;
}

export const KPIFilterBar = ({ filters, onFilterChange, onClearFilters }: KPIFilterBarProps) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <section className="filter-bar">
      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={onFilterChange}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Priority</label>
        <select name="priority" value={filters.priority} onChange={onFilterChange}>
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Team</label>
        <select name="team" value={filters.team} onChange={onFilterChange}>
          <option value="">All Teams</option>
          <option value="Core Network">Core Network</option>
          <option value="Radio Access Network (RAN)">Radio Access (RAN)</option>
          <option value="Fiber Operations">Fiber Operations</option>
          <option value="Transmission">Transmission</option>
          <option value="Hardware">Hardware</option>
          <option value="Cloud Infrastructure">Cloud Infrastructure</option>
          <option value="Security">Security</option>
          <option value="NOC">NOC</option>
          <option value="OSS BSS">OSS BSS</option>
          <option value="Field Operations">Field Operations</option>
          <option value="QA Testing">QA Testing</option>
          <option value="Communications">Communications</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={onFilterChange}
        />
      </div>

      <div className="filter-group">
        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={onFilterChange}
          min={filters.startDate || undefined}
        />
      </div>

      {hasActiveFilters && (
        <button 
          type="button" 
          className="clear-filters-action-btn" 
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </section>
  );
};