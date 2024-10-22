import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import './ExtraSweets.css';

Modal.setAppElement('#root'); // Required for accessibility

const ExtraSweets = () => {
    const [sweets, setSweets] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const[editid,setEditId]=useState('')
    const [newSweet, setNewSweet] = useState({
        sweet_name: '',
        price: '',
        amount: ''
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSweet, setEditSweet] = useState(null); // State to hold the sweet being edited

    // Fetch the existing sweets from the API
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/get_extra_sweets');
            if (response.ok) {
                const result = await response.json();
                setSweets(result.result);
            } else {
                toast.error('Failed to fetch data!');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data!');
        }
    };

    // Handle delete action
    const handleDelete = async (id) => {
           try {
            const response = await fetch('https://dms-backend-seven.vercel.app/delete_extra_sweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ extra_id: id }),
            });
           
            if (response.ok) {
                const updatedSweets = sweets.filter(sweet => sweet.id !== id);
                setSweets(updatedSweets);
                fetchData()
                toast.success('Sweet deleted successfully!');
            } else {
                toast.error('Failed to delete sweet!');
            }
        } catch (error) {
        }
    };

    // Handle input change for form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSweet({ ...newSweet, [name]: value });
    };

    // Handle form submit to send data to the API
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/add_extra_sweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSweet),
            });

            if (response.ok) {
                const addedSweet = await response.json();
                setSweets([...sweets, addedSweet]);
                setNewSweet({ sweet_name: '', price: '', amount: '' });
                setShowForm(false);
                fetchData();
                toast.success('Sweet added successfully!');
            } else {
                toast.error('Failed to add sweet!');
            }
        } catch (error) {
            toast.error('An error occurred while adding the sweet!');
        }
    };

    // Handle Edit Sweet action, open modal and prefill values
    const handleEdit = (sweet) => {
        setEditSweet(sweet);
        setEditId(sweet._id)
        setIsEditModalOpen(true); // Open the modal
    };

    // Handle form submission for the edited sweet
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        editSweet.extra_id=editid
        

        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/update_extra_sweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editSweet),
            });

            if (response.ok) {
                setSweets(sweets.map(s => s._id === editSweet._id ? editSweet : s));
                setIsEditModalOpen(false);
                toast.success('Sweet updated successfully!');
            } else {
                toast.error('Failed to add sweet!');
            }
        } catch (error) {
            toast.error('An error occurred while adding the sweet!');
        }

    };

    // Handle edit form input changes
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditSweet({ ...editSweet, [name]: value });
    };

    return (
        <>
            <div className="extra-sweets-container">
                <div className="extra-sweets-header-box">
                    <h1>Extra Sweets</h1>
                    <button className="add-sweet-button" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                        {showForm ? 'Back to List' : 'Add Sweet'}
                    </button>
                </div>
                <div className="extra-sweets-box">
                    {showForm ? (
                        <form onSubmit={handleSubmit} className="sweet-form">
                            <div className="form-group">
                                <label htmlFor="sweet_name">Sweet Name</label>
                                <input
                                    type="text"
                                    id="sweet_name"
                                    name="sweet_name"
                                    value={newSweet.sweet_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter sweet name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={newSweet.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Quantity</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={newSweet.amount}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    required
                                />
                            </div>
                            <div className="button-group">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setNewSweet({ sweet_name: '', price: '', amount: '' })}>
                                    Reset
                                </button>
                            </div>
                        </form>
                    ) : (
                        <table className="extra-sweets-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map((sweet) => (
                                    <tr key={sweet._id}>
                                        <td>{sweet.sweet_name}</td>
                                        <td>₹{sweet.price}</td>
                                        <td>{sweet.amount}</td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="action-icon"
                                                onClick={() => handleEdit(sweet)}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                className="action-icon"
                                                onClick={() => handleDelete(sweet._id)}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editSweet && (
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    contentLabel="Payment Modal"
                className="Modal"
                overlayClassName="Overlay"
                >
                    <h2>Edit Sweet</h2>
                    <form onSubmit={handleEditSubmit} className="edit-sweet-form">
                        <div className="form-group">
                            <label htmlFor="edit_sweet_name">Sweet Name</label>
                            <input
                                type="text"
                                id="edit_sweet_name"
                                name="sweet_name"
                                value={editSweet.sweet_name}
                                onChange={handleEditInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit_price">Price</label>
                            <input
                                type="number"
                                id="edit_price"
                                name="price"
                                value={editSweet.price}
                                onChange={handleEditInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit_amount">Quantity</label>
                            <input
                                type="number"
                                id="edit_amount"
                                name="amount"
                                value={editSweet.amount}
                                onChange={handleEditInputChange}
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit">Update</button>
                            <button type="button" className='reset-button' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        </div> 
                    </form>
                </Modal>
            )}

            <ToastContainer />
        </>
    );
};

export default ExtraSweets;
