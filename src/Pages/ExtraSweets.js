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
    const [editid, setEditId] = useState('')
    const [newSweet, setNewSweet] = useState({
        sweet_name: '',
        price: '',
        amount: ''
    });
    const [selectedSweet, setSelectedSweet] = useState('');
const [price, setPrice] = useState(0);
const [quantity, setQuantity] = useState(0);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSweet, setEditSweet] = useState(null); // State to hold the sweet being edited

    const SWEET_PRICES = {
  Dry_Fruit_Barfi: 1000,
  Dry_Fruit_Kaju_Patisa: 1000,
  Sangam_Barfi: 900,
  Kaju_Katli: 850,
  Kaju_Katli_Bina_Work: 850,
  Badam_Katli: 850,
  Badam_Katli_Bina_Work: 850,
  Makhan_Bada: 550,
  Nainwa_Ka_Petha: 500,
  Bundi_Ke_Laddu_Kesar: 500,
  Giri_Pak: 500,
  Gulab_Jamun: 500,
  Namkeen: 250,
  Papdi: 250,
};

    // Fetch the existing sweets from the API
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:2025/get_extra_sweets');
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
            const response = await fetch('http://localhost:2025/delete_extra_sweets', {
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
   // Handle form submit to send data to the API
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate input before submitting
  if (!selectedSweet) {
    toast.error('Please select a sweet!');
    return;
  }

  if (!price || price <= 0) {
    toast.error('Invalid sweet price!');
    return;
  }

  if (!newSweet.amount || newSweet.amount <= 0) {
    toast.error('Quantity must be greater than 0!');
    return;
  }

  // Check if sweet already exists in DB (prevent duplicates)
  const duplicateSweet = sweets.find(
    (s) => s.sweet_name === selectedSweet
  );
  if (duplicateSweet) {
    toast.error('This sweet already exists in stock!');
    return;
  }

  const stockData = {
    sweet_name: selectedSweet,
    price: price,
    amount: Number(newSweet.amount),
  };

  try {
    const response = await fetch('http://localhost:2025/add_extra_sweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockData),
    });

    if (response.ok) {
      toast.success('Sweet added successfully!');
      setNewSweet({ sweet_name: '', price: '', amount: '' });
      setSelectedSweet('');
      setPrice(0);
      setShowForm(false);
      fetchData();
    } else {
      toast.error('Failed to add sweet!');
    }
  } catch (error) {
    toast.error('Error adding sweet!');
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
        editSweet.extra_id = editid


        try {
            const response = await fetch('http://localhost:2025/update_extra_sweets', {
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
                    <h1>Stock </h1>
                    <button className="add-sweet-button" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                        {showForm ? 'Back to List' : 'Add Sweet'}
                    </button>
                </div>
                <div className="extra-sweets-box">
                    {showForm ? (
                        <form onSubmit={handleSubmit} className="sweet-form">

                            <div className="form-group">
                                <label htmlFor="type">Sweet Name*</label>
                              <select
  value={selectedSweet}
  onChange={(e) => {
    const sweet = e.target.value;
    setSelectedSweet(sweet);
    setPrice(SWEET_PRICES[sweet] || 0);
  }}
  required
>
  <option value="" disabled>Select Sweet</option>
  {Object.keys(SWEET_PRICES).map((sweet) => (
    <option key={sweet} value={sweet}>
      {sweet.replace(/_/g, ' ')}
    </option>
  ))}
</select>

                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
  type="number"
  value={price}
  readOnly
  placeholder="Auto-filled price"
/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Quantity (In KG)</label>
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
                                <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map((sweet,index) => (
                                    <tr key={sweet?._id}>
                                        <td>{index + 1}</td>
                                        <td>{sweet?.sweet_name?.replace(/_/g, ' ')}</td>
                                        <td>₹{sweet.price} / Kg</td>
                                        <td>{sweet.amount} Kg</td>
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
                           
                       
                        <select
                               
                                  id="edit_sweet_name"
                                  name="sweet_name"
                                  value={editSweet.sweet_name}
                                  onChange={handleEditInputChange}
                                  required
                                    style={{ width: '70%' }}
                                    
                                >
                                    <option value="" disabled>Select type*</option>
                                    <option value="Dry_Fruit_Barfi">Dry Fruit Barfi</option>
                                    <option value="Dry_Fruit_Kaju_Patisa">Dry Fruit Kaju Patisa</option>
                                    <option value="Sangam_Barfi">Sangam Barfi</option>
                                    <option value="Kaju_Katli">Kaju Katli</option>
                                    <option value="Kaju_Katli_Bina_Work">Kaju Katli(Bina Work)</option>
                                    <option value="Badam_Katli">Badam Katli</option>
                                    <option value="Badam_Katli_Bina_Work">Badam Katli(Bina Work)</option>
                                    <option value="Makhan_Bada">Makhan Bada</option>
                                    <option value="Nainwa_Ka_Petha">Nainwa Ka Petha</option>
                                    <option value="Bundi_Ke_Laddu_Kesar">Bundi Ke Laddu Kesar</option>
                                    <option value="Giri_Pak">Giri Pak</option>
                                    <option value="Gulab_Jamun">Gulab Jamun</option>
                                    <option value="Namkeen">Namkeen</option>
                                    <option value="Papdi">Papdi</option>
                                </select>
                                </div>
                        <div className="form-group">
                            <label htmlFor="edit_price">Price</label>
                           <input
  type="number"
  id="edit_price"
  name="price"
  value={editSweet.price}
  readOnly
  style={{ backgroundColor: '#f3f3f3', cursor: 'not-allowed' }}
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
