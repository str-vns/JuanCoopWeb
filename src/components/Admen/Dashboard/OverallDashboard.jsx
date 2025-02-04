import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverallDashboardData } from "@redux/Actions/orderActions";
import { Bar, Pie } from "react-chartjs-2";
import { getToken } from "@utils/helpers";
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

const OverallDashboard = () => {
  const dispatch = useDispatch();
  const token = getToken();

  const { 
    overalldashboards: dashboard, 
    overalldashboardloading: loading, 
    overalldashboarderror: error 
  } = useSelector((state) => state.overalldashboards || {});

  useEffect(() => {
    dispatch(fetchOverallDashboardData(token));
  }, [dispatch, token]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const salesTrends = dashboard?.salesTrends || { daily: 0, weekly: 0, monthly: 0 };
  const rankedProducts = dashboard?.rankedProducts || [];

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
    labels: rankedProducts.length > 0 ? rankedProducts.map((p) => p.productName || "Unknown") : ["No Data"],
    datasets: [
      {
        data: rankedProducts.length > 0 ? rankedProducts.map((p) => p.totalQuantitySold || 0) : [0],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="coop-dashboard-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gray-50 p-6">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Overall Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-gray-600">Daily Sales</h2>
                <p className="text-3xl font-bold text-green-600">₱{salesTrends.daily}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-gray-600">Weekly Sales</h2>
                <p className="text-3xl font-bold text-blue-600">₱{salesTrends.weekly}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-gray-600">Monthly Sales</h2>
                <p className="text-3xl font-bold text-yellow-600">₱{salesTrends.monthly}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wide">Total Orders</h2>
              <p className="text-4xl font-extrabold text-blue-500">{dashboard?.totalOrders ?? 0}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Sales Trends</h3>
                <Bar data={salesTrendsData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Top Selling Products</h3>
                <Pie data={topProductsData} />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default OverallDashboard;