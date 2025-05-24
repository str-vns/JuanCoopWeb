import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoopDashboardData} from "@redux/Actions/orderActions";
import { fetchInventoryDashboard} from "@redux/Actions/inventoryActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { jsPDF } from "jspdf";
import { getSingleCoop } from "@redux/Actions/productActions";
import logoImg from '../../../assets/img/logo.png';
import pesoImg from '../../../assets/img/peso.png';
import Sidebar from "../sidebar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, BarChart, Bar, CartesianGrid} from "recharts";

const CoopDashboard = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;
  

  const { coopdashboards: dashboard, coopdashboardloading: loading } = useSelector(
    (state) => state.coopdashboards || {}
  );
  const { dashboardData} = useSelector((state) => state.inventoryDashboard);
  console.log("Dashboard Data:", dashboardData);
  const { coop } = useSelector((state) => state.singleCoop);

  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  useEffect(() => {
    if (coopId) {
      dispatch(fetchCoopDashboardData(coopId, token));
      dispatch(fetchInventoryDashboard(coopId, selectedPeriod)).then(response => {
        console.log("Fetched Inventory Dashboard:", response);
      });
      dispatch(getSingleCoop(coopId));
    }
  }, [dispatch, coopId, token, selectedPeriod]);  

  if (loading) return <p className="text-center text-lg font-semibold text-yellow-600">Loading...</p>;

  const COLORS = ["#FFD700", "#FFA500", "#FF8C00"]; // Gold, Orange, Dark Orange
  const orderStatusData = Object.entries(dashboard?.orderStatusCounts || {}).map(
    ([status, count], index) => ({
      name: status,
      value: count,
      color: COLORS[index % COLORS.length],
    })
  );

  const revenueData = [
    { name: "This Week", revenue: dashboard?.revenueThisWeek || 0 },
    { name: "Last Week", revenue: dashboard?.revenueLastWeek || 0 },
  ];

  const getChartData = () => {
  switch (selectedPeriod) {
    case "daily":
      return dashboard?.formattedSalesPerDay || [];
    case "monthly":
      return dashboard?.formattedSalesPerMonth || [];
    case "yearly":
      return dashboard?.formattedSalesPerYear || [];
    default:
      return dashboard?.formattedSalesPerDay || [];
  }
};

const getLabelKey = () => {
  switch (selectedPeriod) {
    case "daily":
      return "day"; // "May 1", "May 2", etc.
    case "monthly":
      return "month"; // "April 2025", "May 2025", etc.
    case "yearly":
      return "year"; // "2025"
    default:
      return "day";
  }
};

const getChartTitle = () => {
  switch (selectedPeriod) {
    case "daily":
      return "Sales Per Day";
    case "monthly":
      return "Sales Per Month";
    case "yearly":
      return "Sales Per Year";
    default:
      return "Sales Per Day";
  }
};

const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");
  let y = 20;

  // Load logo and peso images
  const logo = new window.Image();
  logo.src = logoImg;
  const peso = new window.Image();
  peso.src = pesoImg;

  logo.onload = () => {
    // Draw logo at the top center
    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = (210 - logoWidth) / 2; // Centered on A4 width (210mm)
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);
    y = 12 + logoHeight + 4; // Space after logo

    // Farm Name - Centered
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`${coop?.farmName || ""}`, 105, y, { align: "center" });
    y += 10;

    // Address - Centered
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`${coop?.address || ""}`, 105, y, { align: "center" });
    y += 12;

    // "Coop Dashboard Report" (left) and Date+Time (right) on the same line
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Coop Dashboard Report", 14, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const now = new Date();
    const dateTimeString = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   doc.text("Generated:", 160, y, { align: "right" });
    doc.text(dateTimeString, 196, y, { align: "right" });

    y += 10;

    // Divider
    const drawDivider = () => {
      doc.setDrawColor(255, 215, 0); // Gold
      doc.setLineWidth(1);
      doc.line(14, y, 196, y);
      y += 6;
    };

    drawDivider();

    // Dashboard Overview Section
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Dashboard Overview", 14, y);
    y += 9;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total Revenue:`, 18, y);

    // Peso image and revenue value
    const pesoImgWidth = 4;
    const pesoImgHeight = 4;
    const pesoImgX = 65;
    const pesoImgY = y - 3.5;

    peso.onload = () => {
      // Draw peso image
      doc.addImage(peso, 'PNG', pesoImgX, pesoImgY, pesoImgWidth, pesoImgHeight);

      // Draw revenue value with two decimal points, right after the peso image
      const revenue = Number(dashboard?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      doc.text(revenue, pesoImgX + pesoImgWidth + 2, y);

      // Continue with the rest of the PDF logic after the image is loaded

      y += 6;
      doc.text(`• Total Orders:`, 18, y);
      doc.text(`${dashboard?.totalOrders || 0}`, 70, y, { align: "right" });
      y += 6;
      doc.text(`• Total Customers:`, 18, y);
      doc.text(`${dashboard?.totalCustomers || 0}`, 70, y, { align: "right" });
      y += 10;

      drawDivider();

      // Inventory Overview Table
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Inventory Overview", 14, y);
      y += 9;

      if (dashboardData?.length > 0 && dashboardData[0].products?.length > 0) {
        // Table Header
        doc.setFillColor(255, 250, 141); // Light yellow
        doc.rect(14, y - 5, 182, 8, "F");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Product", 16, y);
        doc.text("Unit", 80, y);
        doc.text("Stock", 110, y);
        doc.text("Delivered", 160, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        dashboardData[0].products.forEach((product, idx) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          product.variations.forEach((variation, vIdx) => {
            doc.text(vIdx === 0 ? product.productName : "", 16, y);
            doc.text(String(variation.unitName), 85, y);
            doc.text(String(variation.currentStock), 120, y, { align: "right" });
            doc.text(String(variation.quantityDelivered), 170, y, { align: "right" });
            y += 6;
          });
        });
      } else {
        doc.setFontSize(12);
        doc.text("No inventory data available", 14, y);
        y += 10;
      }

      drawDivider();

      // Order Status Summary Section as Table
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Order Status Summary", 14, y);
      y += 9;

      doc.setFillColor(255, 250, 141);
      doc.rect(14, y - 5, 60, 8, "F");
      doc.rect(80, y - 5, 30, 8, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Status", 16, y);
      doc.text("Count", 90, y);
      y += 8;

      orderStatusData.forEach((status) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "normal");
        doc.text(status.name, 16, y);
        doc.text(String(status.value), 90, y);
        y += 6;
      });

      y += 4;
      drawDivider();

      // Sales Data Section as Table
      const salesData = getChartData();
      const labelKey = getLabelKey();

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Sales Data", 14, y);
      y += 9;

      doc.setFillColor(255, 250, 141);
      doc.rect(14, y - 5, 60, 8, "F");
      doc.rect(80, y - 5, 30, 8, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Period", 16, y);
      doc.text("Total Sales", 90, y);
      y += 8;

      if (salesData.length > 0) {
        doc.setFont("helvetica", "normal");
        let totalSalesSum = 0;
        salesData.forEach((sale) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(sale[labelKey] || "N/A", 16, y);
          doc.text(
            Number(sale.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            90,
            y
          );
          totalSalesSum += Number(sale.totalSales || 0);
          y += 6;
        });

        // Add Total row at the bottom
        y += 2;
        doc.setFont("helvetica", "bold");
        doc.text("Total", 16, y);

        // Peso image before total value
        const pesoImgWidth = 4;
        const pesoImgHeight = 4;
        const pesoImgX = 80;
        const pesoImgY = y - 3.5;

        doc.addImage(peso, 'PNG', pesoImgX, pesoImgY, pesoImgWidth, pesoImgHeight);
        doc.text(
          Number(totalSalesSum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          pesoImgX + pesoImgWidth + 2,
          y
        );
        y += 6;
      } else {
        doc.text("No sales data available", 14, y);
        y += 10;
      }

      drawDivider();

      // Top Selling Products Table
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Top Selling Products", 14, y);
      y += 9;

      if (dashboard?.topSellingProducts?.length > 0) {
        doc.setFillColor(255, 250, 141);
        doc.rect(14, y - 5, 20, 8, "F");
        doc.rect(40, y - 5, 80, 8, "F");
        doc.rect(130, y - 5, 30, 8, "F");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Rank", 16, y);
        doc.text("Product", 50, y);
        doc.text("Total Sold", 140, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        dashboard.topSellingProducts.forEach((product, idx) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          doc.text(String(idx + 1), 16, y);
          doc.text(product.productName, 50, y);
          doc.text(String(product.totalSold), 140, y);
          y += 6;
        });
      } else {
        doc.text("No top-selling product data available", 14, y);
        y += 10;
      }

      // --- At the very end, after all pages are generated ---

      // Footer with page number
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }

      // Add "JuanKooP" at the bottom center of the last page
      doc.setPage(pageCount);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 193, 7); // Gold color
      doc.text("JuanKooP", 105, 285, { align: "center" });

      doc.save("dashboard_report.pdf");
    };
  };
};


  return (
    <div className="flex bg-white-50 min-h-screen  ml-[200px]">
      <Sidebar />
      <div className="p-8 w-full space-y-6">
        {/* Dashboard Overview */ }
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Cooperative Dashboard</h1>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-yellow-300 font-bold text-black rounded-xl hover:bg-yellow-500"
          >Download Report</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Total Revenue", "Total Orders", "Total Customers"].map((title, index) => (
            <div key={index} className="bg-yellow-300 p-6 rounded-xl shadow-lg flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-3xl font-bold mt-2 text-gray-800">
                {index === 0 ? `₱ ${Number(dashboard?.totalRevenue || 0).toFixed(2)}`: index === 1 ? dashboard?.totalOrders || 0 : dashboard?.totalCustomers || 0}
              </p>
            </div>
          ))}
        </div>

          {/* Inventory Dashboard */}
         <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Inventory Overview</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border rounded bg-yellow-100 text-gray-700"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {dashboardData?.length > 0 && dashboardData[0].products?.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto border border-gray-200">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-sm text-gray-600">Product</th>
                    <th className="px-4 py-2 text-left font-bold text-sm text-gray-600">Unit</th>
                    <th className="px-4 py-2 text-left font-bold text-sm text-gray-600">Stock</th>
                    <th className="px-4 py-2 text-left font-bold text-sm text-gray-600">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData[0].products.map((p, idx) =>
                    p.variations.map((v, vIdx) => (
                      <tr key={`${idx}-${vIdx}`} className="border-t">
                        <td className="px-4 py-2">{vIdx === 0 ? p.productName : ""}</td>
                        <td className="px-4 py-2">{v.unitName}</td>
                        <td className="px-4 py-2">{v.currentStock}</td>
                        <td className="px-4 py-2">{v.quantityDelivered}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 mt-4">No inventory data available</p>
          )}
        </div>

        {/* Order Status*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap justify-center mt-4 space-x-4">
              {orderStatusData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className="w-4 h-4 inline-block rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">Top 5 Selling Products</h3>
            
            <ul className="space-y-4">
              {dashboard?.topSellingProducts?.map((product, index) => (
                <li
                  key={index}
                  className="flex items-center bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <img
                    src={product.image?.[0]?.url || "/default-placeholder.png"}
                    alt={product.productName || "Product Image"}
                    className="ml-20 w-14 h-14 object-cover rounded-lg border"
                  />

                  <div className="ml-4 flex flex-col justify-center">
                    <span className="text-base font-semibold text-gray-900">
                      {product.productName}
                    </span>
                    <span className="text-sm text-gray-600">{product.totalSold} sold</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
         {/* Sales Trends*/}
         <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {getChartTitle()}
          </h3>

          {/* Period Filter Buttons */}
          <div className="flex justify-center gap-2 mb-6">
            {["daily", "monthly", "yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200
                  ${selectedPeriod === period
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-yellow-100"}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Sales Chart */}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={getLabelKey()} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₱ ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Total Sales"]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: "#fff8dc",
                    borderRadius: "8px",
                    borderColor: "#ffe082",
                  }}
                  itemStyle={{ color: "#000" }}  
                  cursor={{ fill: "#fffde7" }}
                />
                <Bar dataKey="totalSales" fill="#FFFA8D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoopDashboard;