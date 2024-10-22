import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrashAlt, faBox, faThumbsUp, faShippingFast, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { Tooltip } from 'react-tooltip';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import GenerateBill from '../Components/Generatebill';
import './OrderLife.css';

Modal.setAppElement('#root');

const OrderLife = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [sweetsfordropdown, setSweetsfordropdown] = useState([])
    const [orderData, setOrderData] = useState(null);
    const [remainingOrder, setRemainingOrder] = useState(null);
    const [raw_id, setId] = useState('');
    const [showsweetsinmodel, setShowSweetsInModel] = useState(null);
    const [itempaid, setItempaid] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [issweetsModalOpen, setIsSweetsModalOpen] = useState(false);
    const [modelonhover, setModelOnHover] = useState(false);
    const [billmodel, setBillmodel] = useState(false);
    const [billData, setBillData] = useState(null);
    const [billData2, setBillData2] = useState(null);
    const [receivedMoney, setReceivedMoney] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [sweetSelections, setSweetSelections] = useState([
        { sweetName: '', weight: '', quantity: 0, availableWeights: [] },
    ]);

    useEffect(() => {
        if (activeTab === "initial") {
            fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
        } else if (activeTab === "all") {
            fetchItemsFromAPI('http://localhost:2025/get_all_orders')
        } else if (activeTab === "partial_packed") {
            fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders')
        }
        else if (activeTab === "packed") {
            fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
        } else if (activeTab === "delivered") {
            fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
        } else if (activeTab === "paid") {
            fetchItemsFromAPI('http://localhost:2025/get_paid_orders');
        }
        if (remainingOrder) {

            const initialSelections = [];

            Object.keys(remainingOrder).forEach((sweetName) => {
                const sweetData = remainingOrder[sweetName];
                const sweet = showsweetsinmodel.sweets[sweetName] || {};
                const weights = [];

                if (sweet.oneKg > 0) weights.push('1 Kg');
                if (sweet.halfKg > 0) weights.push('1/2 Kg');
                if (sweet.quarterKg > 0) weights.push('1/4 Kg');
                if (sweet.otherPackings > 0) weights.push(`${sweet.otherWeight}g`);
                if (sweet.otherPackings2 > 0) weights.push(`${sweet.otherWeight2}g`);

                initialSelections.push({
                    sweetName,
                    weight: '',
                    quantity: 0,
                    availableWeights: weights,
                });
            });

            setSweetSelections(initialSelections);
        }
    }, [remainingOrder, showsweetsinmodel]);

    const handleSweetChange = (index, e) => {
        const sweetName = e.target.value;
        const updatedSelections = [...sweetSelections];
        const sweet = showsweetsinmodel.sweets[sweetName] || {};
        const weights = [];

        if (sweet.oneKg > 0) weights.push('1 Kg');
        if (sweet.halfKg > 0) weights.push('1/2 Kg');
        if (sweet.quarterKg > 0) weights.push('1/4 Kg');
        if (sweet.otherPackings > 0) weights.push(`${sweet.otherWeight}g`);
        if (sweet.otherPackings2 > 0) weights.push(`${sweet.otherWeight2}g`);

        updatedSelections[index] = {
            ...updatedSelections[index],
            sweetName,
            availableWeights: weights,
            weight: '',
            quantity: 0,
        };
        setSweetSelections(updatedSelections);
    };

    const handleWeightChange = (index, e) => {
        const updatedSelections = [...sweetSelections];
        const sweetName = updatedSelections[index].sweetName;
        const weight = e.target.value;
        const sweet = showsweetsinmodel.sweets[sweetName] || {};

        let maxQuantity = 0;

        switch (weight) {
            case '1 Kg':
                maxQuantity = sweet.oneKg;
                break;
            case '1/2 Kg':
                maxQuantity = sweet.halfKg;
                break;
            case '1/4 Kg':
                maxQuantity = sweet.quarterKg;
                break;
            case `${sweet.otherWeight}g`:
                maxQuantity = sweet.otherPackings;
                break;
            case `${sweet.otherWeight2}g`:
                maxQuantity = sweet.otherPackings2;
                break;
            default:
                maxQuantity = 0;
        }

        updatedSelections[index].weight = weight;
        updatedSelections[index].maxQuantity = maxQuantity;
        updatedSelections[index].quantity = Math.min(updatedSelections[index].quantity, maxQuantity);
        setSweetSelections(updatedSelections);
    };

    const handleQuantityChange = (index, e) => {
        const updatedSelections = [...sweetSelections];
        const newQuantity = Number(e.target.value);

        if (newQuantity <= updatedSelections[index].maxQuantity) {
            updatedSelections[index].quantity = newQuantity;
        } else {
            updatedSelections[index].quantity = updatedSelections[index].maxQuantity;
            toast.error(`Cannot exceed maximum available boxes (${updatedSelections[index].maxQuantity}) for this weight!`);
        }

        setSweetSelections(updatedSelections);
    };

    const addSelection = () => {
        setSweetSelections([
            ...sweetSelections,
            { sweetName: '', weight: '', quantity: 0, availableWeights: [] },
        ]);
    };

    const deleteSelection = (index) => {
        const updatedSelections = sweetSelections.filter((_, i) => i !== index);
        setSweetSelections(updatedSelections);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = sweetSelections.reduce((acc, { sweetName, weight, quantity }) => {
            if (sweetName && weight && quantity > 0) {
                if (!acc[sweetName]) {
                    acc[sweetName] = {
                        oneKg: 0,
                        halfKg: 0,
                        quarterKg: 0,
                        otherWeight: 0,
                        otherPackings: 0,
                        otherWeight2: 0,
                        otherPackings2: 0,
                        totalWeight: 0,
                        price: showsweetsinmodel.sweets[sweetName].price,
                    };
                }

                switch (weight) {
                    case '1 Kg':
                        acc[sweetName].oneKg += Number(quantity);
                        break;
                    case '1/2 Kg':
                        acc[sweetName].halfKg += Number(quantity);
                        break;
                    case '1/4 Kg':
                        acc[sweetName].quarterKg += Number(quantity);
                        break;
                    case `${showsweetsinmodel.sweets[sweetName].otherWeight}g`:
                        acc[sweetName].otherPackings += Number(quantity);
                        acc[sweetName].otherWeight = showsweetsinmodel.sweets[sweetName].otherWeight;
                        break;
                    case `${showsweetsinmodel.sweets[sweetName].otherWeight2}g`:
                        acc[sweetName].otherPackings2 += Number(quantity);
                        acc[sweetName].otherWeight2 = showsweetsinmodel.sweets[sweetName].otherWeight2;
                        break;
                    default:
                        break;
                }

                const oneKgWeight = acc[sweetName].oneKg * 1;
                const halfKgWeight = acc[sweetName].halfKg * 0.5;
                const quarterKgWeight = acc[sweetName].quarterKg * 0.25;
                const otherWeightKg = (acc[sweetName].otherWeight / 1000) * acc[sweetName].otherPackings;
                const otherWeightKg2 = (acc[sweetName].otherWeight2 / 1000) * acc[sweetName].otherPackings2;

                acc[sweetName].totalWeight = oneKgWeight + halfKgWeight + quarterKgWeight + otherWeightKg + otherWeightKg2;
            }
            return acc;
        }, {});

        try {
            const response = await fetch('http://localhost:2025/update_remaining_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: raw_id, remaining_order: payload, is_half_packed: 1 }),
            });

            if (response.ok) {
                toast.success('Operation was successful!');
                setIsSweetsModalOpen(false);
            } else {
                toast.error('Operation Failed!');
            }
        } catch (error) {
            toast.error('An error occurred!');
        }
    };

    const handlereset = () => {
        setSweetSelections([
            { sweetName: '', weight: '', quantity: 0, availableWeights: [] },
        ]);
    }
    useEffect(() => {
        if (remainingOrder && showsweetsinmodel) {
            const initialSelections = [];

            Object.keys(remainingOrder).forEach((sweetName) => {
                const sweetData = remainingOrder[sweetName]; // This is the object with weights and quantities
                const sweet = showsweetsinmodel.sweets[sweetName] || {};
                const weights = [];

                // Gather available weights
                if (sweet.oneKg > 0) weights.push('1 Kg');
                if (sweet.halfKg > 0) weights.push('1/2 Kg');
                if (sweet.quarterKg > 0) weights.push('1/4 Kg');
                if (sweet.otherPackings > 0) weights.push(`${sweet.otherWeight}g`);
                if (sweet.otherPackings2 > 0) weights.push(`${sweet.otherWeight2}g`);

                // Add the data into initialSelections for each weight
                if (sweetData.oneKg > 0) {
                    initialSelections.push({
                        sweetName,
                        weight: '1 Kg',
                        quantity: sweetData.oneKg,
                        availableWeights: weights,
                    });
                }
                if (sweetData.halfKg > 0) {
                    initialSelections.push({
                        sweetName,
                        weight: '1/2 Kg',
                        quantity: sweetData.halfKg,
                        availableWeights: weights,
                    });
                }
                if (sweetData.quarterKg > 0) {
                    initialSelections.push({
                        sweetName,
                        weight: '1/4 Kg',
                        quantity: sweetData.quarterKg,
                        availableWeights: weights,
                    });
                }
                if (sweetData.otherPackings > 0) {
                    initialSelections.push({
                        sweetName,
                        weight: `${sweet.otherWeight}g`,
                        quantity: sweetData.otherPackings,
                        availableWeights: weights,
                    });
                }
                if (sweetData.otherPackings2 > 0) {
                    initialSelections.push({
                        sweetName,
                        weight: `${sweet.otherWeight2}g`,
                        quantity: sweetData.otherPackings2,
                        availableWeights: weights,
                    });
                }
            });

            // Set the pre-filled selections
            setSweetSelections(initialSelections);
        }
    }, [remainingOrder, showsweetsinmodel]);











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
                body: JSON.stringify({ name: query, type: activeTab }),
            });

            if (response.ok) {
                const result = await response.json();
                setItems(result.data);

                // Process the search results as needed
            } else {

            }
        } catch (error) {

        }
    };

    const handleViewClick = (item) => {


        postViewAPI(item._id, '');
    };
    const handleTableRowClick = (item) => {
        setModelOnHover(true)
        postViewAPI(item._id, '');
    }

    const postViewAPI = async (id, type) => {
        const data = { order_id: id };
        try {
            const response = await fetch('http://localhost:2025/view_sweets_orders_by_id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();

                if (type === "model") {

                    getSweetsWithPositiveWeight(data.data[0].sweets)
                    setShowSweetsInModel(data.data[0])
                    setId(id);
                    setRemainingOrder(data.data[0].remaining_order)

                } else {
                    setSelectedItem(data.data[0]);
                    setOrderData(data.data[0]);

                }
            } else {

            }
        } catch (error) {

        }
    };
    const getSweetsWithPositiveWeight = (sweets) => {
        const sweetNames = [];

        Object.keys(sweets).forEach(sweetName => {
            if (sweets[sweetName].totalWeight > 0) {
                sweetNames.push(sweetName);
            }
        });
        setSweetsfordropdown(sweetNames)

        return sweetNames;
    };



    const handlegenereatebill = (item,data) => {
        setBillData(item);
        setBillData2(data)
        setBillmodel(true);
    };

    const closeModal = () => {

        setIsPaymentModalOpen(false);
        setIsSweetsModalOpen(false)
        setSelectedItem(null);
        setOrderData(null);
        setReceivedMoney('');
        setPaymentMode('')
        setModelOnHover(false)
        setBillmodel(false)
    };

    const handlePackedClick = (itemId, obj) => {


        Swal.fire({
            title: 'Are you sure?',
            text: "Is This Order Cmpletely Packed Or Any Item is Remaining?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "Not Complete",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark as packed!'
        }).then((result) => {
            if (result.isConfirmed) {
                callPackedAPI(itemId);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                setIsSweetsModalOpen(true);
                postViewAPI(itemId, "model");
            }
        });

        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: "You want to mark this order as packed!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes, mark as packed!'
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         callPackedAPI(itemId);
        //     }
        // });
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
                if (activeTab === "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('http://localhost:2025/get_paid_orders');
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

                Swal.fire('Success!', 'The order has been marked as packed.', 'success');
                if (activeTab === "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('http://localhost:2025/get_paid_orders');
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

                Swal.fire('Success!', 'The order has been Deleted.', 'success');
                if (activeTab === "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('http://localhost:2025/get_paid_orders');
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

            const response = await fetch('http://localhost:2025/update_sweet_order_paid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: itempaid._id, received_amount: receivedMoney ,payment_mode:paymentMode }),
            });
            if (response.ok) {
                Swal.fire('Success!', 'Payment has been successfully recorded.', 'success');
                closeModal();
                if (activeTab === "initial") {
                    fetchItemsFromAPI('http://localhost:2025/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('http://localhost:2025/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('http://localhost:2025/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('http://localhost:2025/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('http://localhost:2025/get_paid_orders');
                }
            } else {
                Swal.fire('Error!', 'Failed to submit payment.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };
    const handleEditClick = (route, id) => {
        navigate(`${route}/${id}`);
    };




    return (
        <div className="order-life-container">
            <div className="content-box">
                {!selectedItem && <> <div>
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
                                className={`tab-button ${activeTab === 'partial_packed' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('partial_packed'); fetchItemsFromAPI('http://localhost:2025/get_half_packed_orders'); }}
                            >
                                Partial Packed
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



                <h2>
                    {activeTab.replace(/_/g, ' ').charAt(0).toUpperCase() + activeTab.replace(/_/g, ' ').slice(1)} Orders
                </h2>

                <table className="order-table">
                    <thead>
                        <tr>
                            <th><b>S.No.</b></th>
                            <th><b>Name</b></th>
                            <th><b>Price</b></th>
                            {activeTab === 'all' && <th><b>Amount Received</b></th>}
                            {activeTab === 'all' && <th><b>Difference Amount</b></th>}
                            <th><b>Date & Time</b></th>
                            <th><b>Action</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={item._id}

                            >

                                <td><b>{index + 1}</b></td>
                                <td><b>{item.name}</b></td>
                                <td><b>₹{item?.summary?.totalPrice}</b></td>
                                {activeTab === 'all' && <td><b>₹{item.received_amount ? item.received_amount : " NA"}</b></td>}
                                {activeTab === 'all' && <td className={
                                    activeTab === 'all' &&
                                        item.received_amount !== null &&
                                        typeof item.received_amount === 'number' &&
                                        item.summary &&
                                        item.summary.totalPrice !== undefined &&
                                        item.received_amount < item.summary.totalPrice
                                        ? 'highlight-row'
                                        : ''
                                }><b>₹{item.received_amount && item?.summary?.totalPrice ? item?.summary?.totalPrice - item.received_amount.toFixed(2) : " NA"}</b></td>}
                                <td><b>{item.created}</b></td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faEye}
                                        style={{ cursor: 'pointer', color: '#333' }}
                                        data-tooltip-id="view-tooltip"
                                        data-tooltip-content="View"
                                        onClick={() => handleTableRowClick(item)}
                                    />
                                    <Tooltip id="view-tooltip" place="top" type="dark" effect="solid" />
                                    {activeTab === "initial" && (
                                        <>
                                            <FontAwesomeIcon
                                                icon={faBox}
                                                style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                data-tooltip-id="packed-tooltip"
                                                data-tooltip-content="Order Packed"
                                                onClick={() => handlePackedClick(item._id, item)}
                                            />
                                            <Tooltip id="packed-tooltip" place="top" type="dark" effect="solid" />
                                        </>
                                    )}
                                    {(activeTab === "packed" || activeTab === "partial_packed") && (
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
                                    {activeTab !== "paid" && (
                                        <>
                                            <FontAwesomeIcon
                                                icon={faFileInvoice}
                                                style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                data-tooltip-id="complete-tooltip"
                                                data-tooltip-content="Generate Bill"
                                                onClick={() => handlegenereatebill(item.sweets,item)}
                                            />
                                            <Tooltip id="complete-tooltip" place="top" type="dark" effect="solid" />
                                        </>
                                    )}
                                    {activeTab === "initial" && (
                                        <>
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                data-tooltip-id="edit-tooltip"
                                                data-tooltip-content="Edit Order"
                                                onClick={() => handleEditClick('/edit-order', item._id)}
                                            />
                                            <Tooltip id="edit-tooltip" place="top" type="dark" effect="solid" />
                                        </>
                                    )}
                                    {activeTab === "all" && activeTab !== "packed" && activeTab !== "paid" && (
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
                        <p><b>Total Price:</b> ₹{activeTab === "all" ? itempaid?.totalPric : itempaid?.summary?.totalPrice}</p>
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
                        <div className="form-group">
                            <label htmlFor="paymentmode"><b>Payment Mode:</b></label>
                          
                               <select
                            id="paymentmode"
                            name="Paymentmode"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            // style={{width:'100%'}}
                          
                        >
                            <option value="" disabled>Select type*</option>
                            <option value="online">Online</option>
                            <option value="cash">Cash</option>
                          
                        </select>
                        </div>
                        <button type='submit' onClick={handlePaymentSubmit}>Submit </button>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
            <Modal
                isOpen={issweetsModalOpen}
                onRequestClose={closeModal}
                contentLabel="Pack Sweets Modal"
                className="custom-sweets-modal"
                overlayClassName="custom-sweets-overlay"
            >
                <h2>Remaining Sweets</h2>
                {showsweetsinmodel && sweetSelections.map((selection, index) => (
                    <div key={index} className="unique-sweet-selection-box">
                        <div className="unique-sweet-field">
                            <label htmlFor={`sweetName-${index}`}>Select Sweet:</label>
                            <select
                                id={`sweetName-${index}`}
                                className="unique-form-control"
                                value={selection.sweetName}
                                onChange={(e) => handleSweetChange(index, e)}
                            >
                                <option value="" disabled>Select a sweet</option>
                                {sweetsfordropdown.map((sweetName, i) => (
                                    <option key={i} value={sweetName}>
                                        {sweetName.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="unique-sweet-field">
                            <label htmlFor={`weight-${index}`}>Select Weight:</label>

                            <select
                                id={`weight-${index}`}
                                className="unique-form-control"
                                value={selection.weight}
                                onChange={(e) => handleWeightChange(index, e)}
                                disabled={!selection.availableWeights.length}
                            >
                                <option value="" disabled>Select a weight</option>
                                {selection.availableWeights.map((weight, i) => (
                                    <option key={i} value={weight}>
                                        {weight}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="unique-sweet-field">
                            <label htmlFor={`quantity-${index}`}>Enter Quantity:</label>
                            <input
                                type="number"
                                id={`quantity-${index}`}
                                className="unique-form-control"
                                value={selection.quantity}
                                onChange={(e) => handleQuantityChange(index, e)}
                                min="0"
                                disabled={!selection.weight}
                            />
                        </div>

                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ cursor: 'pointer', color: '#333', marginTop: '34px', marginRight: '15px' }}
                            data-tooltip-id="delete-item-tooltip"
                            data-tooltip-content="Delete"
                            onClick={() => deleteSelection(index)}
                        />
                    </div>
                ))}

                <FontAwesomeIcon
                    icon={faPlus}
                    className="unique-add-button"
                    style={{ cursor: 'pointer', color: '#333', marginLeft: '919px', fontSize: '25px' }}
                    data-tooltip-id="add-tooltip"
                    data-tooltip-content="Add"
                    onClick={addSelection}
                />
                <div className="button-group">
                    <button type="submit" onClick={handleSubmit}>Submit Order</button>
                </div>
            </Modal>
            <Modal
                isOpen={modelonhover}
                onRequestClose={closeModal}
                contentLabel="Pack Sweets Modal"
                className="custom-sweets-modal"
                overlayClassName="custom-sweets-overlay"
            >
                <div>
                    <div className="order-details">
                        <h2>Order Details</h2>

                        <div style={{ display: 'flex' }}>
                            <div >
                                <p style={{ marginRight: '100px', fontSize: 'larger' }}><b>Name:</b> {selectedItem?.name}</p>
                                <p style={{ marginRight: '100px', fontSize: 'larger' }} ><b>Price:</b> ₹{selectedItem?.summary.totalPrice}</p>
                                <p style={{ marginRight: '100px', fontSize: 'larger' }}><b>Date & Time:</b> {selectedItem?.created}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 'larger' }}>

                                    {selectedItem?.is_packed === 1 ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: '#28a745' }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faX}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
                                        />
                                    )}
                                    <b>Packing</b>
                                </p>
                                <p style={{ fontSize: 'larger' }}>

                                    {selectedItem?.is_delivered === 1 ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: '#28a745' }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faX}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
                                        />
                                    )}
                                    <b>Delivery</b>
                                </p>
                                <p style={{ fontSize: 'larger' }}>

                                    {selectedItem?.is_paid === 1 ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: '#28a745' }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faX}
                                            style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
                                        />
                                    )}
                                    <b>Payment</b>
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
                                            <h3> {sweetName.replace(/_/g, ' ')}</h3>
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


            </Modal>

            <Modal
                isOpen={billmodel}
                onRequestClose={closeModal}
                contentLabel="Pack Sweets Modal"
                className="custom-sweets-modal"
                overlayClassName="custom-sweets-overlay"
            >

                <GenerateBill sweets={billData} data={billData2} />

            </Modal>

            <ToastContainer />
        </div>
    );
};

export default OrderLife;
