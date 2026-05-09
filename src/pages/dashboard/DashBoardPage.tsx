import React, { useEffect, useState } from 'react';
import { Header } from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { KpiDashboard } from '../../components/KPIDashBoard/KPIDashBoard'; // Import your new component
import type { Ticket } from '../../types/Ticket';
import './DashBoardPage.css';

export const DashboardPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/tickets')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Network Operations Center</h1>
          <p>Real-time Incident Ticket Overview</p>
        </header>

        {/* 1. High-Level Analytics (KPIs) */}
        <section className="analytics-section">
          <KpiDashboard />
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