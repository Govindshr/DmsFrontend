// src/components/AddItems.js
import React, { useState, useEffect } from 'react';
import './AddItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the delete icon

const AddItems = () => {
  const [name, setSweetName] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState([]); // State to store the list of items

  // Function to fetch data from the API
  const fetchItemsFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:2025/getOrderDetails'); // Replace with your actual GET API endpoint
      if (response.ok) {
        const data = await response.json();
        console.log("response", data);
        setItems(data.result); 
      } else {
        console.error('Failed to fetch items from API');
      }
    } catch (error) {
      console.error('Error while fetching items from API:', error);
    }
  };

  // Function to send data to the API
  const sendItemToAPI = async (newItem) => {
    try {
      const response = await fetch('http://localhost:2025/order_details', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        console.log('Item successfully sent to API');
        fetchItemsFromAPI(); // Refresh the items list after adding a new item
      } else {
        console.error('Failed to send item to API');
      }
    } catch (error) {
      console.error('Error while sending item to API:', error);
    }
  };

  // Function to delete an item from the list
  const deleteItemFromAPI = async (itemId) => {
    try {
      const response = await fetch('http://localhost:2025/delete_order_details', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemId),
      });

      if (response.ok) {
        console.log('Item successfully sent to API');
        fetchItemsFromAPI(); // Refresh the items list after adding a new item
      } else {
        console.error('Failed to send item to API');
      }
    } catch (error) {
      console.error('Error while sending item to API:', error);
    }
  };

  const handleDelete = (itemId) => {
    const newItem = {
      order_id:itemId,
     
    };
    deleteItemFromAPI(newItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new item to the list
    const newItem = {
      name,
      price,
    };

    // Call the function to send data to the API
    await sendItemToAPI(newItem);

    // Clear the form fields after submission
    setSweetName('');
    setPrice('');
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchItemsFromAPI();
  }, []);

  return (<>
    <div className="add-items">
      <h2>Add a New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sweetName">Sweet Name</label>
          <input
            type="text"
            id="sweetName"
            value={name}
            onChange={(e) => setSweetName(e.target.value)}
            placeholder="Enter sweet name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (Per/Kg)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
      </div>
   <div className="add-items">
    <h2>Items Available</h2>
      {items.length > 0 && (
        <table className="items-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Sweet Name</th>
              <th>Price (Per/Kg)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}.</td>
                <td>{item.name}</td> 
                <td>{item.price} Rs</td>
                <td>
                  <FontAwesomeIcon 
                    icon={faTrashAlt} 
                    onClick={() => handleDelete(item._id)} 
                    style={{ cursor: 'pointer', color: 'white' }} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
   </div>
 </> );
};

export default AddItems;
