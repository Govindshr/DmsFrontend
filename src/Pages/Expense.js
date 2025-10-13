import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Expense.css';

const Expense = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, receiver: 'John Doe', amount: 500, type: 'Dairy', remark: 'Milk Purchase' },
        { id: 2, receiver: 'Jane Doe', amount: 200, type: 'General', remark: 'Stationery' }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        type: '',
        receiver: '',
        amount: '',
        remark: '',
        bill: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense({ ...newExpense, [name]: value });
    };
    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleFileChange = (e) => {
        setNewExpense({ ...newExpense, bill: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('type', newExpense.type);
        formData.append('reciver_name', newExpense.receiver);
        formData.append('amount', newExpense.amount);
        formData.append('remarks', newExpense.remark);
        formData.append('image', newExpense.bill);

        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/addExpence', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success('Expense added successfully!');
                setNewExpense({
                    type: '',
                    receiver: '',
                    amount: '',
                    remark: '',
                    bill: null,
                });
                setShowForm(false);
                fetchExpenses();
            } else {
                toast.error('Failed to add expense!');
            }
        } catch (error) {
            toast.error('An error occurred while adding the expense!');
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/getExpence'); // Replace with your API URL
            if (response.ok) {
                const data = await response.json();
                console.log("expense Data ", data)
                setExpenses(data.result);
            } else {
                toast.error('Failed to fetch expenses!');
            }
        } catch (error) {
            toast.error('An error occurred while fetching expenses!');
        }



    };

    const handleDelete = async (id) => {

        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/delete_expence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expence_id: id }),
            });
            if (response.ok) {
                    toast.success('Expense deleted successfully!');
                    fetchExpenses(); // Refresh the expense list
                } else {
                    toast.error('Failed to delete expense!');
                }
        } catch (error) {
        }
    };

  

    return (
        <div className="expense-container">
            <div className="expense-header-box">
                <h1>Expenses</h1>
                <button className="add-expense-button" onClick={() => setShowForm(!showForm)}>
                    <FontAwesomeIcon icon={showForm ? faArrowLeft : faPlus} style={{ marginRight: '5px' }} />
                    {showForm ? 'Back to List' : 'Add Expense'}
                </button>
            </div>
            {showForm ? (
                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-group">
                        <label htmlFor="type">Type of Expense*</label>
                        <select
                            id="type"
                            name="type"
                            value={newExpense.type}
                            onChange={handleInputChange}
                            style={{width:'100%'}}
                            required
                        >
                            <option value="" disabled>Select type*</option>
                            <option value="Dairy">Dairy</option>
                            <option value="General">General</option>
                            <option value="Transport">Transport</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="receiver">Name of Receiver*</label>
                        <input
                            type="text"
                            id="receiver"
                            name="receiver"
                            value={newExpense.receiver}
                            onChange={handleInputChange}
                            style={{width:'100%'}}
                            placeholder="Enter receiver name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount*</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={newExpense.amount}
                            onChange={handleInputChange}
                            style={{width:'100%'}}
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="remark">Remark</label>
                        <textarea
                            id="remark"
                            name="remark"
                            value={newExpense.remark}
                            onChange={handleInputChange}
                            style={{width:'100%'}}
                            placeholder="Enter remark"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bill">Upload Bill/Receipt</label>
                        <input
                            type="file"
                            id="bill"
                            name="bill"
                            accept="image/*"
                            style={{width:'100%'}}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="button-group">
                        <button className='reset-button'>Submit</button>
                        <button type="button" onClick={() => setNewExpense({ type: '', receiver: '', amount: '', remark: '', bill: null })}>Reset</button>
                    </div>
                </form>
            ) : (
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>S.No. </th>
                            <th>Paid To </th>
                            <th>Amount</th>
                            <th>Expense Type</th>
                            <th>Bill/Recipt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={index}>
                                <td><b>{index + 1}</b></td>
                                <td><b>{expense?.reciver_name}</b></td>
                                <td><b>₹{expense?.amount}</b></td>
                                <td><b>{expense.type}</b></td>
                                <td>
                                    <a href={expense.bill_image} target="_blank" rel="noopener noreferrer">
                                        <img src={expense.bill_image} width={50} height={50} alt="Image" />
                                    </a>
                                </td>

                                <td>
                                 
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="action-icon"
                                        onClick={() => handleDelete(expense._id)}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <ToastContainer />
        </div>
    );
};

export default Expense;
