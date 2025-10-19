// src/components/RetailDashboard.js
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Retaildashboard.css";

const RetailDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [sweetTotals, setSweetTotals] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalWeight: 0,
    totalBoxes: 0,
  });
  const [hoveredOrder, setHoveredOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("https://dms-backend-seven.vercel.app/get_all_retail_orders");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      const ordersData = json.data || [];
      setOrders(ordersData);
      processData(ordersData);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching retail orders");
    }
  };

  const processData = (data) => {
    const sweetMap = {};
    let totalWeight = 0;
    let totalBoxes = 0;

    data.forEach((order) => {
      totalWeight += order.summary?.totalWeight || 0;
      totalBoxes += order.summary?.totalBoxes || 0;

      Object.entries(order.sweets).forEach(([sweetName, sweetData]) => {
        if (!sweetMap[sweetName])
          sweetMap[sweetName] = {
            name: sweetName.replace(/_/g, " "),
            oneKg: 0,
            halfKg: 0,
            quarterKg: 0,
            totalWeight: 0,
          };

        sweetMap[sweetName].oneKg += sweetData.oneKg || 0;
        sweetMap[sweetName].halfKg += sweetData.halfKg || 0;
        sweetMap[sweetName].quarterKg += sweetData.quarterKg || 0;
        sweetMap[sweetName].totalWeight += sweetData.totalWeight || 0;
      });
    });

    const sweetTotalsArr = Object.values(sweetMap).sort(
      (a, b) => b.totalWeight - a.totalWeight
    );

    setSweetTotals(sweetTotalsArr);
    setSummary({
      totalOrders: data.length,
      totalWeight,
      totalBoxes,
    });
  };

  return (
    <div className="rtdash-container">
      <h1 className="rtdash-title">Retail Orders Dashboard</h1>

      {/* Summary Cards */}
      <div className="rtdash-summary">
        <div className="rtdash-card">
          <h3>Total Orders</h3>
          <p>{summary.totalOrders}</p>
        </div>
        <div className="rtdash-card">
          <h3>Total Weight (Kg)</h3>
          <p>{summary.totalWeight.toFixed(2)}</p>
        </div>
        <div className="rtdash-card">
          <h3>Total Boxes</h3>
          <p>{summary.totalBoxes}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rtdash-chart-full">
        <h3>Sweet-wise Box Distribution by Weight</h3>
      <ResponsiveContainer width="100%" height={450}>
  <BarChart data={sweetTotals.slice(0, 15)}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="name"
      angle={-30}
      textAnchor="end"
      interval={0}
      height={90}
    />
    <YAxis />
    <Tooltip
      content={({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload;
          const totalBoxes = data.oneKg + data.halfKg + data.quarterKg;
          return (
            <div
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#111" }}>
                {label}
              </h4>
              <p style={{ margin: "5px 0", fontSize: "0.85rem", color: "#374151" }}>
                <strong>Total Boxes:</strong> {totalBoxes}
              </p>
              <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "#374151" }}>
                <strong>Total Weight:</strong> {data.totalWeight.toFixed(2)} kg
              </p>
              <hr style={{ borderTop: "1px solid #e5e7eb", margin: "6px 0" }} />
              <p style={{ margin: "2px 0", color: "#2563EB" }}>
                1 Kg Boxes: {data.oneKg}
              </p>
              <p style={{ margin: "2px 0", color: "#10B981" }}>
                500 g Boxes: {data.halfKg}
              </p>
              <p style={{ margin: "2px 0", color: "#F59E0B" }}>
                250 g Boxes: {data.quarterKg}
              </p>
            </div>
          );
        }
        return null;
      }}
    />
    <Legend />
    <Bar dataKey="oneKg" stackId="a" fill="#2563EB" name="1 Kg Boxes" />
    <Bar dataKey="halfKg" stackId="a" fill="#10B981" name="500 g Boxes" />
    <Bar dataKey="quarterKg" stackId="a" fill="#F59E0B" name="250 g Boxes" />
  </BarChart>
</ResponsiveContainer>

      </div>

      {/* Orders Table */}
      <div className="rtdash-table-section">
        <h3>All Retail Orders</h3>
        <table className="rtdash-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Name</th>
              <th>Payment Mode</th>
              <th>Total Weight (Kg)</th>
              <th>Total Boxes</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                onMouseEnter={() => setHoveredOrder(order)}
                onMouseLeave={() => setHoveredOrder(null)}
              >
                <td>{order.order_no}</td>
                <td>{order.name}</td>
                <td>{order.payment_mode}</td>
                <td>{order.summary?.totalWeight}</td>
                <td>{order.summary?.totalBoxes}</td>
                <td>{order.created}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hover Tooltip */}
        {hoveredOrder && (
          <div className="rtdash-tooltip">
            <h4>
              {hoveredOrder.order_no} — {hoveredOrder.name}
            </h4>
            <div className="rtdash-tooltip-content">
              {Object.entries(hoveredOrder.sweets)
                .filter(([_, s]) => s.totalWeight > 0)
                .map(([sweetName, s], idx) => (
                  <div key={idx} className="rtdash-tooltip-item">
                    <span className="sweet-name">{sweetName.replace(/_/g, " ")}</span>
                    <span className="sweet-info">
                      {s.totalWeight} kg × ₹{s.price} = ₹
                      {(s.totalWeight * s.price).toFixed(0)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default RetailDashboard;
