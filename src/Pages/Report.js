import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  
import './Report.css';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const Report = () => {
  const [allorders, setAllOrders] = useState([]);
  const [allexpense, setAllExpense] = useState([]);
  const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
  const [totalbilledAmount, setTotalbilledAmount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loader, setLoader] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchData();
    fetchExpenses();
    setTimeout(() => {
      setLoader(1)
    }, 200)
  }, []);

  useEffect(() => {
    const total = allorders.reduce((sum, order) => {
      return sum + (order.received_amount || 0);
    }, 0);
    setTotalReceivedAmount(total);

    const totalbill = allorders.reduce((sum, order) => {
      return sum + (order.summary.totalPrice || 0);
    }, 0);
    setTotalbilledAmount(totalbill);
  }, [allorders]);

  useEffect(() => {
    const totalExp = allexpense.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return sum + (amount || 0);
    }, 0);
    setTotalExpenses(totalExp);
  }, [allexpense]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://dms-backend-seven.vercel.app/get_all_orders');
      if (response.ok) {
        const result = await response.json();
        setAllOrders(result.data);
      } else {
        toast.error('Failed to fetch data!');
      }
    } catch (error) {
      toast.error('An error occurred while fetching data!');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://dms-backend-seven.vercel.app/getExpence');
      if (response.ok) {
        const data = await response.json();
        setAllExpense(data.result);
      } else {
        toast.error('Failed to fetch expenses!');
      }
    } catch (error) {
      toast.error('An error occurred while fetching expenses!');
    }
  };

  const pieData = [
    { name: 'Total Amount', value: totalbilledAmount },
    { name: 'Amount Collected', value: totalReceivedAmount },
    { name: 'Total Expense', value: totalExpenses }
  ];

  const barData = [
    { name: 'Billed', Amount: totalbilledAmount },
    { name: 'Collected', Amount: totalReceivedAmount },
    { name: 'Expenses', Amount: totalExpenses }
  ];

  
  const handleCardClick = (route) => {
    navigate(route); 
  };

  return (
    <div >
      <div className="report-container">
        {/* <div className="report-header">
          <h1>Report</h1>
        </div> */}
        <div className="report-grid">
          <div className="report-card" onClick={() => handleCardClick('/order-life')}>
            <h2>Total Bill Amount</h2>
            <p>₹{totalbilledAmount.toLocaleString()}</p>
          </div>
          <div className="report-card" onClick={() => handleCardClick('/order-life')}>
            <h2>Amount Collected</h2>
            <p>₹{totalReceivedAmount.toLocaleString()}</p>
          </div>
          <div className="report-card" onClick={() => handleCardClick('/expense')}>
            <h2>Total Expenses</h2>
            <p>₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="charts-container">
          <h3 style={{marginBottom:'70px'}}>Financial Overview</h3>
          <div className="charts-box" >
            <div className="chart pie-chart">
            {loader===1 && <ResponsiveContainer width="100%" height={370}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>}
            </div>

            <div className="chart bar-chart">
              {loader===1&&
              <ResponsiveContainer width="100%" height={370}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Report;
