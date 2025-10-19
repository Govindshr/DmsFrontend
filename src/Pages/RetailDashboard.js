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
  const [selectedOrder, setSelectedOrder] = useState(null);

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

      {/* Chart */}
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
            <Tooltip />
            <Legend />
            <Bar dataKey="oneKg" stackId="a" fill="#2563EB" name="1 Kg Boxes" />
            <Bar dataKey="halfKg" stackId="a" fill="#10B981" name="500 g Boxes" />
            <Bar
              dataKey="quarterKg"
              stackId="a"
              fill="#F59E0B"
              name="250 g Boxes"
            />
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.order_no}</td>
                <td>{order.name}</td>
                <td>{order.payment_mode}</td>
                <td>{order.summary?.totalWeight}</td>
                <td>{order.summary?.totalBoxes}</td>
                <td>{order.created}</td>
                <td>
                  <button
                    className="rtdash-view-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="rtdash-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="rtdash-modal"
            onClick={(e) => e.stopPropagation()} // prevent overlay click
          >
            <h3>
              {selectedOrder.order_no} — {selectedOrder.name}
            </h3>
            <div className="rtdash-modal-content">
              {Object.entries(selectedOrder.sweets)
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
            <button className="rtdash-close-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default RetailDashboard;
