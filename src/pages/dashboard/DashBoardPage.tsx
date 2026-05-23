import React, { useEffect, useState } from 'react';
import { Header } from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { KpiDashboard } from '../../components/KPIDashBoard/KPIDashBoard'; // Import your new component
import type { Ticket } from '../../types/Ticket';
import './DashBoardPage.css';

interface FiltersState {
  status: string;
  priority: string;
  team: string;
}

export const DashboardPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<FiltersState>({
    status: '',
    priority: '',
    team: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.team) params.append('team', filters.team);

    fetch(`http://127.0.0.1:8000/tickets?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      });
  }, [filters]);

  return (
    <>
      <Header />
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Network Operations Center</h1>
          <p>Real-time Incident Ticket Overview</p>
        </header>

        <section className="filter-bar">
          <div className="filter-group">
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
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
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Team</label>
            <select name="team" value={filters.team} onChange={handleFilterChange}>
              <option value="">All Teams</option>
              <option value="Core Network">Core Network</option>
              <option value="Radio Access Network (RAN)">Radio Access (RAN)</option>
              <option value="Fiber Operations">Fiber Operations</option>
              {/* <option value="IT Support">IT Support</option> */}
              
              {/* Adaugate dupa executia generatorului de scripturi noi */}
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
        </section>

        <section className="analytics-section">
          <KpiDashboard filters={filters} />
        </section>

        {/* 2. Detailed Ticket View */}
        <section className="data-section">
          <h2 className="section-title">Active Incident Tickets</h2>
          {loading ? (
            <p>Loading telecom data...</p>
          ) : (
            <div className="table-wrapper">
              <table className="nokia-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Service</th>
                    <th>Assigned To</th>
                    <th>Submit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.TICKET_NUMBER}>
                      <td className="bold-blue">{ticket.TICKET_NUMBER}</td>
                      <td>
                        <span className={`status-badge ${ticket.STATUS?.toLowerCase() || 'unknown'}`}>
                          {ticket.STATUS}
                        </span>
                      </td>
                      <td>{ticket.PRIORITY}</td>
                      <td>{ticket.SERVICE}</td>
                      <td>{ticket.ASSIGNED_PERSON}</td>
                      <td>{new Date(ticket.SUBMIT_DATETIME).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};