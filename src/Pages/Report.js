// src/Components/Report.js

import React from 'react';
import './Report.css';

const Report = () => {
    return (
        <div className="report-container">
            <div className="report-header">
                <h1>Report</h1>
            </div>
            <div className="report-grid">
                <div className="report-card">
                    <h2>Total Amount</h2>
                    <p>₹1,20,000</p>
                </div>
                <div className="report-card">
                    <h2>Total Sweets Status</h2>
                    <p>[Chart Placeholder]</p>
                </div>
                <div className="report-card">
                    <h2>Total Sweets Bill</h2>
                    <p>[Chart Placeholder]</p>
                </div>
                <div className="report-card">
                    <h2>Total Expenses</h2>
                    <p>₹50,000</p>
                </div>
                <div className="report-card">
                    <h2>Total Profit</h2>
                    <p>₹70,000</p>
                </div>
            </div>
        </div>
    );
};

export default Report;
