import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "../css/coopdashboard.css";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const CoopDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Sales",
        data: [500, 700, 800, 600, 900, 1100],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        <div className="flex-1 overflow-y-auto coop-dashboard-container">
          <div className="coop-main">
            <main className="coop-main-content">
              
              {/* Sales Overview Section */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Sales Overview</h3>
                <div className="dashboard-chart-wrapper flex">
                  {/* Total Sales Line Chart */}
                  <div className="dashboard-chart-container">
                    <Line data={salesData} options={salesOptions} />
                  </div>

                  {/* Weekly Sales Bar Chart */}
                  <div className="dashboard-chart-container">
                    <Bar
                      data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        datasets: [
                          {
                            label: "Weekly Sales",
                            data: [100, 150, 200, 250, 300, 350, 400], // Replace with your actual data
                            backgroundColor: "rgba(33, 150, 243, 0.7)",
                            borderColor: "#2196f3",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                          tooltip: {
                            enabled: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Order Management and Customer Management in One Row */}
              <section className="dashboard-sections-wrapper">
                {/* Order Management Section */}
                <section className="dashboard-section order-management">
                  <h3 className="dashboard-section-title">Order Management</h3>
                  <div className="dashboard-table-container">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>#12345</td>
                          <td>Shipped</td>
                          <td>2024-12-18</td>
                          <td>$150</td>
                        </tr>
                        <tr>
                          <td>#12346</td>
                          <td>Pending</td>
                          <td>2024-12-17</td>
                          <td>$200</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Customer Management Section */}
                <section className="dashboard-section customer-management">
                  <h3 className="dashboard-section-title">Customer Management</h3>
                  <div className="dashboard-table-container">
                    <table className="table table-striped w-full">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Email</th>
                          <th>Total Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>John Doe</td>
                          <td>john@example.com</td>
                          <td>5</td>
                        </tr>
                        <tr>
                          <td>Jane Smith</td>
                          <td>jane@example.com</td>
                          <td>3</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </section>



              {/* Product Management Section */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Product Management</h3>
                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <h4>Active Products</h4>
                    <p className="dashboard-card-highlight">120</p>
                  </div>
                  <div className="dashboard-card">
                    <h4>Inactive Products</h4>
                    <p className="dashboard-card-highlight">15</p>
                  </div>
                  <div className="dashboard-card">
                    <h4>Low Stock Alerts</h4>
                    <p className="dashboard-card-highlight">10</p>
                  </div>
                </div>
              </section>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopDashboard;