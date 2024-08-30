import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faBox, faThumbsUp, faShippingFast,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './OrderLife.css';

Modal.setAppElement('#root'); // Bind modal to your app root

const OrderLife = () => {
    const [activeTab, setActiveTab] = useState('initial');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [itempaid, setItempaid] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [receivedMoney, setReceivedMoney] = useState('');

    useEffect(() => {
        fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
    }, []);

    const fetchItemsFromAPI = async (url) => {
        setItems([])
        try {
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                setItems(data.data);
            } else {

            }
        } catch (error) {

        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSearchInputChange = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);


        try {
            const response = await fetch('http://localhost:2025/get_order_based_on_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: query ,type:activeTab }),
            });

            if (response.ok) {
                const result = await response.json();
                setItems(result.data);

                // Process the search results as needed
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('An error occurred while fetching search results:', error);
        }
    };

    const handleViewClick = (item) => {
        console.log("itemess", item)
        setIsModalOpen(true);
        postViewAPI(item._id);
    };

    const postViewAPI = async (id) => {
        const data = { order_id: id };
        try {
            const response = await fetch('http://localhost:2025/view_sweets_orders_by_id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedItem(data.data[0]);
                setOrderData(data.data[0]);
            } else {

            }
        } catch (error) {

        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setIsPaymentModalOpen(false);
        setSelectedItem(null);
        setOrderData(null);
        setReceivedMoney('');
    };

    const handlePackedClick = (itemId) => {
        console.log(itemId)
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to mark this order as packed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark as packed!'
        }).then((result) => {
            if (result.isConfirmed) {
                callPackedAPI(itemId);
            }
        });
    };

    const callPackedAPI = async (itemId) => {
        try {
            const response = await fetch('http://localhost:2025/update_sweet_order_packed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: itemId }),
            });
            if (response.ok) {
                Swal.fire('Success!', 'The order has been marked as packed.', 'success');
                if (activeTab == "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                }else if(activeTab == "all"){
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } 
                else if (activeTab == "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab == "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                }
            } else {
                Swal.fire('Error!', 'Failed to mark the order as packed.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };

    const handleDeliveredClick = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to mark this order as Delivered!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark as Delivered!'
        }).then((result) => {
            if (result.isConfirmed) {
                CallDeliveredAPI(itemId);
            }
        });
    };
    const hadleDeleteData = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to Delete this order !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                callDeleteApi(itemId);
            }
        });
    };

    const CallDeliveredAPI = async (itemId) => {
        try {
            const response = await fetch('http://localhost:2025/update_sweet_order_delivered', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: itemId }),
            });
            if (response.ok) {
                const data = await response.json();
                Swal.fire('Success!', 'The order has been marked as packed.', 'success');
                if (activeTab == "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                }else if(activeTab == "all"){
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } 
                else if (activeTab == "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab == "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                }
            } else {
                Swal.fire('Error!', 'Failed to mark the order as packed.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };
    const callDeleteApi = async (itemId) => {
        try {
            const response = await fetch('http://localhost:2025/delete_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: itemId._id }),
            });
            if (response.ok) {
                const data = await response.json();
                Swal.fire('Success!', 'The order has been Deleted.', 'success');
                if (activeTab == "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                }else if(activeTab == "all"){
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } 
                else if (activeTab == "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab == "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                }
            } else {
                Swal.fire('Error!', 'Failed to mark the order as packed.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };

    const handleBackClick = () => {
        setSelectedItem(null);
        setOrderData(null);
    };

    const handleThumbsUpClick = (item) => {

        setItempaid(item);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSubmit = async () => {
        if (receivedMoney === '') {
            Swal.fire('Error!', 'Please enter the received money amount.', 'error');
            return;
        }

        try {
            // console.log("response")
            const response = await fetch('http://localhost:2025/update_sweet_order_paid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: itempaid._id, received_amount: receivedMoney }),
            });
            if (response.ok) {
                Swal.fire('Success!', 'Payment has been successfully recorded.', 'success');
                closeModal();
                if (activeTab == "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                }else if(activeTab == "all"){
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } 
                else if (activeTab == "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab == "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                }
            } else {
                Swal.fire('Error!', 'Failed to submit payment.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };
    
    return(
        <div className="order-life-container">
            <div className="content-box">
               {!selectedItem &&<> <div>
                    <h1>Order Status</h1>
                </div>
                <div className="tab-section">
                    <div className="tabs">
                        <button
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => { handleTabClick('all'); fetchItemsFromAPI('http://localhost:2025/get_all_orders'); }}
                        >
                            All
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'initial' ? 'active' : ''}`}
                            onClick={() => { handleTabClick('initial'); fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details'); }}
                        >
                            Initial
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'packed' ? 'active' : ''}`}
                            onClick={() => { handleTabClick('packed'); fetchItemsFromAPI('http://localhost:2025/get_packed_orders'); }}
                        >
                            Packed
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'delivered' ? 'active' : ''}`}
                            onClick={() => { handleTabClick('delivered'); fetchItemsFromAPI('http://localhost:2025/get_delivered_orders'); }}
                        >
                            Delivered
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'paid' ? 'active' : ''}`}
                            onClick={() => { handleTabClick('paid'); fetchItemsFromAPI('http://localhost:2025/get_paid_orders'); }}
                        >
                            Completed
                        </button>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search Orders..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                </div></>}

                {selectedItem ? (
                  <div>
                  <div className="order-details">
                      <h2>Order Details</h2>
                  <button style={{marginRight:'100px'}} onClick={handleBackClick} className="back-button">
                  <FontAwesomeIcon icon={faArrowLeft} style={{ cursor: 'pointer', color: 'white', marginRight: '5px' }} />
                  Back</button>
                    <div style={{display:'flex'}}>
                          <div >
                          <p style={{marginRight:'100px', fontSize:'larger'}}><b>Name:</b> {selectedItem.name}</p>
                          <p style={{marginRight:'100px' , fontSize:'larger'}} ><b>Price:</b> ₹{selectedItem.summary.totalPrice}</p>
                          <p style={{marginRight:'100px' , fontSize:'larger'}}><b>Date & Time:</b> {selectedItem.created}</p>
                      </div>
                      <div>
                          <p style={{ fontSize:'larger'}}>
                              <b>Packing</b>
                              {selectedItem?.is_packed === 1 ? (
                                  <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: '#28a745' }}
                                  />
                              ) : (
                                  <FontAwesomeIcon
                                      icon={faX}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                                  />
                              )}
                          </p>
                          <p style={{ fontSize:'larger'}}>
                              <b>Delivery</b>
                              {selectedItem?.is_delivered === 1 ? (
                                  <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: '#28a745' }}
                                  />
                              ) : (
                                  <FontAwesomeIcon
                                      icon={faX}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                                  />
                              )}
                          </p>
                          <p style={{ fontSize:'larger'}}>
                              <b>Payment</b>
                              {selectedItem?.is_paid === 1 ? (
                                  <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: '#28a745' }}
                                  />
                              ) : (
                                  <FontAwesomeIcon
                                      icon={faX}
                                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                                  />
                              )}
                          </p>
                      </div>
                      </div>
              
                      {orderData && (
                          <div className="sweet-details-container">
                              {Object.keys(orderData.sweets).map((sweetName, index) => {
                                  const sweet = orderData.sweets[sweetName];
              
                                  // Check if any of the box values are greater than 0
                                  const hasBoxes = sweet.oneKg > 0 || sweet.halfKg > 0 || sweet.quarterKg > 0 || sweet.otherPackings > 0 || sweet.otherPackings2 > 0;
              
                                  if (!hasBoxes) {
                                      return null; // Skip this sweet if no boxes are present
                                  }
              
                                  return (
                                      <div key={index} className="sweet-details">
                                          <h3> {sweetName}</h3>
                                          <table className="order-table">
                                              <thead>
                                                  <tr>
                                                      <th>Weight</th>
                                                      <th>Boxes</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  {sweet.oneKg > 0 && (
                                                      <tr>
                                                          <td>1 Kg</td>
                                                          <td>{sweet.oneKg}</td>
                                                      </tr>
                                                  )}
                                                  {sweet.halfKg > 0 && (
                                                      <tr>
                                                          <td>1/2 Kg</td>
                                                          <td>{sweet.halfKg}</td>
                                                      </tr>
                                                  )}
                                                  {sweet.quarterKg > 0 && (
                                                      <tr>
                                                          <td>1/4 Kg</td>
                                                          <td>{sweet.quarterKg}</td>
                                                      </tr>
                                                  )}
                                                  {sweet.otherPackings > 0 && (
                                                      <tr>
                                                          <td>{sweet.otherWeight}g</td>
                                                          <td>{sweet.otherPackings}</td>
                                                      </tr>
                                                  )}
                                                  {sweet.otherPackings2 > 0 && (
                                                      <tr>
                                                          <td>{sweet.otherWeight2}g</td>
                                                          <td>{sweet.otherPackings2}</td>
                                                      </tr>
                                                  )}
                                              </tbody>
                                          </table>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>
              </div>
              
                ) : (
                    <>
                        <h2>{activeTab} Orders</h2>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th><b>S.No.</b></th>
                                    <th><b>Name</b></th>
                                    <th><b>Price</b></th>
                                    <th><b>Date & Time</b></th>
                                    <th><b>Action</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td><b>{index + 1}</b></td>
                                        <td><b>{item.name}</b></td>
                                        <td><b>₹{item?.summary?.totalPrice}</b></td>
                                        <td><b>{item.created}</b></td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                style={{ cursor: 'pointer', color: '#333' }}
                                                data-tooltip-id="view-tooltip"
                                                data-tooltip-content="View"
                                                onClick={() => handleViewClick(item)}
                                            />
                                            <Tooltip id="view-tooltip" place="top" type="dark" effect="solid" />
                                            {activeTab === "initial" && (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faBox}
                                                        style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                        data-tooltip-id="packed-tooltip"
                                                        data-tooltip-content="Order Packed"
                                                        onClick={() => handlePackedClick(item._id)}
                                                    />
                                                    <Tooltip id="packed-tooltip" place="top" type="dark" effect="solid" />
                                                </>
                                            )}
                                            {activeTab === "packed" && (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faShippingFast}
                                                        style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                        data-tooltip-id="Deliver-tooltip"
                                                        data-tooltip-content="Order Delivered"
                                                        onClick={() => handleDeliveredClick(item._id)}
                                                    />
                                                    <Tooltip id="Deliver-tooltip" place="top" type="dark" effect="solid" />
                                                </>
                                            )}
                                            {activeTab !== "paid" && activeTab !== "all" && (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faThumbsUp}
                                                        style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                        data-tooltip-id="complete-tooltip"
                                                        data-tooltip-content="Payment Done"
                                                        onClick={() => handleThumbsUpClick(item)}
                                                    />
                                                    <Tooltip id="complete-tooltip" place="top" type="dark" effect="solid" />
                                                </>
                                            )}
                                            {activeTab !== "delivered" && activeTab !== "packed" && activeTab !=="paid" && (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                        data-tooltip-id="delete-tooltip"
                                                        data-tooltip-content="Delete"
                                                        onClick={() => hadleDeleteData(item)}
                                                    />
                                                    <Tooltip id="delete-tooltip" place="top" type="dark" effect="solid" />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <Modal
                isOpen={isPaymentModalOpen}
                onRequestClose={closeModal}
                contentLabel="Payment Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Payment Confirmation</h2>
                {itempaid && (
                    <div>
                        <p><b>Order Name:</b> {itempaid.name}</p>
                        <p><b>Total Price:</b> ₹{activeTab === "all" ? itempaid?.totalPrice : itempaid?.summary?.totalPrice}</p>
                        <div className="form-group">
                            <label htmlFor="receivedMoney"><b>Received Money:</b></label>
                            <input
                                type="number"
                                id="receivedMoney"
                                value={receivedMoney}
                                onChange={(e) => setReceivedMoney(e.target.value)}
                                placeholder="Enter received money"
                                required
                            />
                        </div>
                        <button type='submit' onClick={handlePaymentSubmit}>Submit </button>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default OrderLife;
