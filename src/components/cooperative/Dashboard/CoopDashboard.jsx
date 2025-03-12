import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoopDashboardData } from "@redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, BarChart, Bar
} from "recharts";

const CoopDashboard = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const { coopdashboards: dashboard, coopdashboardloading: loading } = useSelector(
    (state) => state.coopdashboards || {}
  );

  const [selectedPeriod, setSelectedPeriod] = useState("day");

  useEffect(() => {
    if (coopId) {
      dispatch(fetchCoopDashboardData(coopId, token));
    }
  }, [dispatch, coopId, token]);

  if (loading) return <p className="text-center text-lg font-semibold text-yellow-600">Loading...</p>;

  const COLORS = ["#FFD700", "#FFA500", "#FF6347", "#32CD32", "#1E90FF"];
  const orderStatusData = Object.entries(dashboard?.orderStatusCounts || {}).map(([status, count], index) => ({
    name: status,
    value: count,
    color: COLORS[index % COLORS.length],
  }));

  const revenueData = [
    { name: "This Week", revenue: dashboard?.revenueThisWeek || 0 },
    { name: "Last Week", revenue: dashboard?.revenueLastWeek || 0 },
  ];

  const salesData = {
    day: dashboard?.salesPerDay || [],
    week: dashboard?.salesPerWeek || [],
    month: dashboard?.salesPerMonth || [],
    year: dashboard?.salesPerYear || [],
  };

  return (
    <div className="flex bg-yellow-50 min-h-screen  ml-[200px]">
      <Sidebar />
      <div className="p-8 w-full">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Total Revenue", "Total Orders", "Total Customers"].map((title, index) => (
            <div key={index} className="bg-yellow-300 p-6 rounded-xl shadow-lg flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-3xl font-bold mt-2 text-gray-800">
                {index === 0 ? `₱ ${dashboard?.totalRevenue || 0}` : index === 1 ? dashboard?.totalOrders || 0 : dashboard?.totalCustomers || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Order Status & Revenue Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Order Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={80}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trends & Top Selling Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Sales Data</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mt-2 p-2 border rounded w-full bg-yellow-100 text-gray-800"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData[selectedPeriod]}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Bar dataKey="totalSales" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Top 5 Selling Products</h3>
            <ul className="mt-2 space-y-2">
              {dashboard?.topSellingProducts?.map((product, index) => (
                <li key={index} className="bg-yellow-100 p-3 rounded-md shadow-sm">
                  <span className="font-medium text-gray-900">{product.productName}</span> - {product.totalSold} sold
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopDashboard;
