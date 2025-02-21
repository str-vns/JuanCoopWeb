import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoopDashboardData } from "@redux/Actions/orderActions";
import { Bar, Pie } from "react-chartjs-2";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/coopdashboard.css";
import Sidebar from "../sidebar";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CoopDashboard = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const { coopdashboards: dashboard, coopdashboardloading: loading, coopdashboarderror: error } = useSelector(
    (state) => state.coopdashboards || {}
  );

  useEffect(() => {
    if (coopId) {
      dispatch(fetchCoopDashboardData(coopId, token));
    }
  }, [dispatch, coopId, token]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const salesTrends = dashboard?.salesTrends || { daily: 0, weekly: 0, monthly: 0 };
  const topSellingProducts = dashboard?.topSellingProducts || [];
  const lowPerformingProducts = dashboard?.lowPerformingProducts || [];
  const salesComparison = dashboard?.salesComparison || { currentMonth: 0, previousMonth: 0, percentageChange: 0 };

  const salesTrendsData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Sales Revenue",
        data: [salesTrends.daily || 0, salesTrends.weekly || 0, salesTrends.monthly || 0],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const topProductsData = {
    labels: topSellingProducts.map((p) => p.productName || "Unknown"),
    datasets: [
      {
        data: topSellingProducts.map((p) => p.totalQuantitySold || 0),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const lowProductsData = {
    labels: lowPerformingProducts.map((p) => p.productName || "Unknown"),
    datasets: [
      {
        data: lowPerformingProducts.map((p) => p.totalQuantitySold || 0),
        backgroundColor: ["#FF9F40", "#9966FF", "#C9CBCF", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="coop-dashboard-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gray-50 p-6">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Cooperative Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-600">
              ₱{(dashboard?.totalRevenue ?? 0).toFixed(2)}
            </p>
          </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
              <p className="text-3xl font-bold text-blue-600">{dashboard?.totalOrders ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold text-gray-600">Avg. Order Value</h2>
              <p className="text-3xl font-bold text-yellow-600">₱{dashboard?.averageOrderValue ?? 0}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center border-l-4 border-blue-500 mb-8">
            <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wide">Sales Comparison</h2>
            <p className="text-lg text-gray-600">
              Current Month: <span className="font-bold text-blue-600">₱{salesComparison.currentMonth}</span>
            </p>
            <p className="text-lg text-gray-600">
              Previous Month: <span className="font-bold text-red-600">₱{salesComparison.previousMonth}</span>
            </p>
            <p className="text-lg text-gray-600">
              Change:{" "}
              <span className={`font-bold ${salesComparison.percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {salesComparison.percentageChange}%
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Sales Trends</h3>
              <Bar data={salesTrendsData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Top-Selling Products</h3>
              <Pie data={topProductsData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Low-Performing Products</h3>
              <Pie data={lowProductsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopDashboard;