import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "./Report.css";
import { FaRupeeSign } from "react-icons/fa";

const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

const Report = () => {
  const [summary, setSummary] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchSummary();
    setTimeout(() => setLoader(true), 200);
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch("https://dms-backend-seven.vercel.app/get_payment_summary");
      if (response.ok) {
        const data = await response.json();
        setSummary(data.data);
      } else {
        toast.error("Failed to fetch payment summary!");
      }
    } catch (error) {
      toast.error("An error occurred while fetching payment summary!");
    }
  };

  if (!summary) {
    return <div className="loading-text">Loading financial report...</div>;
  }

  const grandTotalBill =
    summary.retail.total_bill + summary.prebooked.total_bill;
  const grandCollected =
    summary.retail.cash_received +
    summary.retail.online_received +
    summary.prebooked.cash_received +
    summary.prebooked.online_received;
  const grandCredit = summary.retail.credit + summary.prebooked.credit;

  const pieData = [
    { name: "Total Amount", value: grandTotalBill },
    { name: "Collected", value: grandCollected },
    { name: "Credit", value: grandCredit },
  ];

  const barData = [
    {
      name: "Retail",
      Billed: summary.retail.total_bill,
      Cash: summary.retail.cash_received,
      Online: summary.retail.online_received,
    },
    {
      name: "Prebooked",
      Billed: summary.prebooked.total_bill,
      Cash: summary.prebooked.cash_received,
      Online: summary.prebooked.online_received,
    },
  ];

  const formatCurrency = (value) =>
    `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="report-container">
      <h2 className="page-title">Financial Summary Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        {/* Retail Orders */}
        <div className="summary-card retail">
          <h3>Retail Orders</h3>
          <div className="summary-content">
            <p>
              <span>Total Bill:</span> {formatCurrency(summary.retail.total_bill)}
            </p>
            <p>
              <span>Cash Received:</span>{" "}
              {formatCurrency(summary.retail.cash_received)}
            </p>
            <p>
              <span>Online Received:</span>{" "}
              {formatCurrency(summary.retail.online_received)}
            </p>
            <p>
              <span>Credit (Pending):</span>{" "}
              {formatCurrency(summary.retail.credit)}
            </p>
          </div>
        </div>

        {/* Prebooked Orders */}
        <div className="summary-card prebooked">
          <h3>Prebooked Orders</h3>
          <div className="summary-content">
            <p>
              <span>Total Bill:</span>{" "}
              {formatCurrency(summary.prebooked.total_bill)}
            </p>
            <p>
              <span>Cash Received:</span>{" "}
              {formatCurrency(summary.prebooked.cash_received)}
            </p>
            <p>
              <span>Online Received:</span>{" "}
              {formatCurrency(summary.prebooked.online_received)}
            </p>
            <p>
              <span>Credit (Pending):</span>{" "}
              {formatCurrency(summary.prebooked.credit)}
            </p>
          </div>
        </div>
      </div>

      {/* Grand Totals */}
      <div className="total-summary">
        <div className="report-card">
          <h2>Total Bill Amount</h2>
          <p>{formatCurrency(grandTotalBill)}</p>
        </div>
        <div className="report-card">
          <h2>Amount Collected</h2>
          <p>{formatCurrency(grandCollected)}</p>
        </div>
        <div className="report-card">
          <h2>Total Credit (Pending)</h2>
          <p>{formatCurrency(grandCredit)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <h3 className="chart-title">Collection Breakdown</h3>
        <div className="charts-box">
          {/* Pie Chart */}
          <div className="chart pie-chart">
            {loader && (
              <ResponsiveContainer width="100%" height={370}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={140}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart */}
          <div className="chart bar-chart">
            {loader && (
              <ResponsiveContainer width="100%" height={370}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Legend />
                  <Bar dataKey="Billed" fill="#8884d8" />
                  <Bar dataKey="Cash" fill="#FF7043" />
                  <Bar dataKey="Online" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Report;
