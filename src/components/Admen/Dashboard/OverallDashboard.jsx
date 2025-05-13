import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverallDashboardData } from "@redux/Actions/orderActions";
import { getToken } from "@utils/helpers";
import Sidebar from "../sidebar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const OverallDashboard = () => {
  const dispatch = useDispatch();
  const token = getToken();

  const {
    overalldashboards: dashboard,
    overalldashboardloading: loading,
    overalldashboarderror: error,
  } = useSelector((state) => state.overalldashboards || {});

  useEffect(() => {
    if (token) {
      dispatch(fetchOverallDashboardData(token));
    }
  }, [dispatch, token]);

  if (loading) return <p className="text-center text-yellow-600 font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const COLORS = ["#FFD700", "#FFEA00", "#FFCC00", "#FFB800", "#F9A825"];

  const topCoops = dashboard?.topCoops || [];
  const rankedProducts = dashboard?.rankedProducts || [];

  const topCoopsData = topCoops.map((coop) => ({
    name: coop.coopName || "Unknown",
    revenue: coop.totalRevenue || 0,
  }));

  const topProductsData = rankedProducts.map((p) => ({
    name: p.productName || "Unknown",
    value: p.totalQuantitySold || 0,
  }));

  return (
    <div className="flex bg-white-50 min-h-screen  ml-[200px]">
      <Sidebar />
      <div className="p-8 w-full space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Overall Dashboard</h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-yellow-300 shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-black-600 mt-2">₱ {Number(dashboard?.totalRevenue || 0).toFixed(2)}</p>
          </div>
          <div className="bg-yellow-300 shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black-700">Total Orders</h3>
            <p className="text-3xl font-bold text-black-600 mt-2">{dashboard?.totalOrders || 0}</p>
          </div>
        </div>

        {/* Sales Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-yellow-200 shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black-700">Daily Sales</h3>
            <p className="text-2xl font-bold text-black-600 mt-2">₱ {Number(dashboard?.salesTrends?.daily || 0).toFixed(2)}</p>
          </div>
          <div className="bg-yellow-200 shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black-700">Weekly Sales</h3>
            <p className="text-2xl font-bold text-black-600 mt-2">₱ {Number(dashboard?.salesTrends?.weekly || 0).toFixed(2)}</p>
          </div>
          <div className="bg-yellow-200 shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black-700">Monthly Sales</h3>
            <p className="text-2xl font-bold text-black-600 mt-2">₱ {Number(dashboard?.salesTrends?.monthly || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Top Cooperatives BarChart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Cooperatives by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCoopsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  itemStyle={{ color: "#000" }}  
                  />
                <Bar dataKey="revenue" fill="#FFFA8D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products PieChart */}
          <div className="bg-white p-6 rounded-lg shadow-md flex">
            <div className="w-2/3">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProductsData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    labelLine={false}
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 pl-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Legend</h4>
              <ul>
                {topProductsData.map((entry, index) => (
                  <li key={`legend-${index}`} className="flex items-center mb-2">
                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-700">{entry.name} ({entry.value})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallDashboard;
