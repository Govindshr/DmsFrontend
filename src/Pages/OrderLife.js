import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrashAlt, faBox, faThumbsUp, faShippingFast, faArrowLeft, faL } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// removed navigate
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import GenerateBill from '../Components/Generatebill';
import './OrderLife.css';
import Pagination from '../Components/Pagination';
import Loader from '../Components/Loader';
import EditOrder from './EditOrder';

Modal.setAppElement('#root');

const OrderLife = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);



    const [receivedMoney, setReceivedMoney] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [sweetSelections, setSweetSelections] = useState([
        { sweetName: '', weight: '', quantity: 0, availableWeights: [] },
    ]);
    // const [currentPage, setCurrentPage] = useState(1);
    let currentPage = 1
    const totalPages = 10; // Example total pages

    const handlePageChange = (pageNumber) => {
// console.log("hanfle page change ",pageNumber)
    currentPage=pageNumber;
        if (activeTab === "initial") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
        } else if (activeTab === "all") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
        } else if (activeTab === "partial_packed") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
        }
        else if (activeTab === "packed") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
        } else if (activeTab === "delivered") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
        } else if (activeTab === "paid") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
        }
        // Fetch new data based on `pageNumber` if needed
    };

    useEffect(() => {
        if (activeTab === "initial") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
        } else if (activeTab === "all") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
        } else if (activeTab === "partial_packed") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
        }
        else if (activeTab === "packed") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
        } else if (activeTab === "delivered") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
        } else if (activeTab === "paid") {
            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
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
        setLoading(true)
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/update_remaining_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: raw_id, remaining_order: payload, is_half_packed: 1 }),
            });

            if (response.ok) {
                toast.success('Operation was successful!');
                setIsSweetsModalOpen(false);
                setLoading(false)
            } else {
                toast.error('Operation Failed!');
                setLoading(false)
            }
        } catch (error) {
            toast.error('An error occurred!');
        }
    };
    const handleSelectChange = (sweetName, weightType, value) => {
        setSelectedValues((prevSelected) => ({
            ...prevSelected,
            [sweetName]: {
                ...prevSelected[sweetName],
                [weightType]: value,
            },
        }));
    };
    const handlePack = async (sweetName, weightType, id) => {
        const selectedValue = selectedValues[sweetName]?.[weightType] || 0;
        console.log(`Packing ${selectedValue} boxes of ${weightType} for ${sweetName}`);


        setLoading(true)

        try {
         const response = await fetch('https://dms-backend-seven.vercel.app/update_sweets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ order_id: id, count: selectedValue, sweet_name: sweetName, box: weightType }),
});

if (response.ok) {
  const result = await response.json();
  toast.success('Packed successfully!');
  
  // ✅ Step 1: Refresh the current modal data live
  const refreshed = await fetch('https://dms-backend-seven.vercel.app/view_sweets_orders_by_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: id }),
  });
  if (refreshed.ok) {
    const updated = await refreshed.json();
    setOrderData(updated.data[0]);
    setShowSweetsInModel(updated.data[0]);
    setRemainingOrder(updated.data[0].remaining_order);
  }

  // ✅ Step 2: Refresh visible table (move to Partial Packed)
  if (activeTab === 'initial') {
    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders');
    setActiveTab('partial_packed');
  } else {
    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders');
  }

  setLoading(false);
} else {
  toast.error('Failed to update packing!');
  setLoading(false);
}


        } catch (error) {

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
        console.log("api ke just pehle ",currentPage)
        setLoading(true)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ page: currentPage }),
            });

            if (response.ok) {
                setLoading(false)
                const data = await response.json();

                setItems(data);
            } else {
                setLoading(false)

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

        setLoading(true)
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/get_order_based_on_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: query, type: activeTab, page: currentPage }),
            });

            if (response.ok) {

                const result = await response.json();
                setItems(result);
                setLoading(false)

                // Process the search results as needed
            } else {
                setLoading(false)
            }
        } catch (error) {

        }
    };

    const handleorderinput = async (event) => {
        // const query = event.target.value;
        // setSearchQuery(query);
        setLoading(true)

        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/get_order_based_on_order_no', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_no: event.target.value, type: activeTab, page: currentPage }),
            });

            if (response.ok) {
                const result = await response.json();
                setItems(result);
                setLoading(false)

                // Process the search results as needed
            } else {
                setLoading(false)
            }
        } catch (error) {

        }
    };
    const handlesweetnamesearch = async (event) => {
        // const query = event.target.value;
        // setSearchQuery(query);
        // console.log("chal rah ahe ")
        setLoading(true)
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/get_data_by_Sweetname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sweetname: event.target.value }),
            });

            if (response.ok) {
                const result = await response.json();
                setItems(result);
                setLoading(false)

                // Process the search results as needed
            } else {
                setLoading(false)
            }
        } catch (error) {

        }
    };
    const handleViewClick = (item) => {


        postViewAPI(item._id, '');
    };
    const handleTableRowClick = (item) => {
        setModelOnHover(true)
        setSelectedValues({})
        postViewAPI(item._id, '');
    }

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const postViewAPI = async (id, type) => {
        const data = { order_id: id };
        setLoading(false)
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/view_sweets_orders_by_id', {
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
                setLoading(false)
            } else {
                setLoading(false)
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



    const handlegenereatebill = (item, data) => {
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
        setIsEditModalOpen(false)
    };

    const handlePackedClick = (itemId, obj) => {

        console.log(obj)
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
                callPackedAPI(itemId, obj.sweets);
            } else if (result.dismiss === Swal.DismissReason.cancel) {

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
    const updateispacked = async (itemId) => {
        
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/update_sweet_order_packed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: itemId }),
            });
            if (response.ok) {
                Swal.fire('Success!', 'The order has been marked as packed.', 'success');
                if (activeTab === "initial") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
                }
            } else {
                Swal.fire('Error!', 'Failed to mark the order as packed.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };
    const callPackedAPI = async (itemId, sweets) => {
        console.log("Sweets", sweets)
        let order_data = {
            sweets: sweets,
        }
        
        try {
            const response = await fetch('https://dms-backend-seven.vercel.app/update_stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_data: order_data }),
            });
            if (response.ok) {
                updateispacked(itemId)
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
            const response = await fetch('https://dms-backend-seven.vercel.app/update_sweet_order_delivered', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: itemId }),
            });
            if (response.ok) {

                Swal.fire('Success!', 'The order has been marked as packed.', 'success');
                if (activeTab === "initial") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
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
            const response = await fetch('https://dms-backend-seven.vercel.app/delete_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: itemId._id }),
            });
            if (response.ok) {

                Swal.fire('Success!', 'The order has been Deleted.', 'success');
                if (activeTab === "initial") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
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

            const response = await fetch('https://dms-backend-seven.vercel.app/update_sweet_order_paid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: itempaid._id, received_amount: receivedMoney, payment_mode: paymentMode }),
            });
            if (response.ok) {
                Swal.fire('Success!', 'Payment has been successfully recorded.', 'success');
                closeModal();
                if (activeTab === "initial") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
                } else if (activeTab === "all") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders')
                } else if (activeTab === "partial_packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders')
                }
                else if (activeTab === "packed") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders')
                } else if (activeTab === "delivered") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders')
                } else if (activeTab === "paid") {
                    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
                }
            } else {
                Swal.fire('Error!', 'Failed to submit payment.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while processing your request.', 'error');
        }
    };
    // removed navigate-based edit handler (editing happens via modal now)




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
                                onClick={() => { handleTabClick('all'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders'); }}
                            >
                                All
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'initial' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('initial'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details'); }}
                            >
                                Initial
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'partial_packed' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('partial_packed'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders'); }}
                            >
                                Partial Packed
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'packed' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('packed'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders'); }}
                            >
                                Packed
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'delivered' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('delivered'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders'); }}
                            >
                                Delivered
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'paid' ? 'active' : ''}`}
                                onClick={() => { handleTabClick('paid'); fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders'); }}
                            >
                                Completed
                            </button>
                            <button
  className={`tab-button ${activeTab === 'retail' ? 'active' : ''}`}
  onClick={() => { 
    handleTabClick('retail'); 
    fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_retail_orders'); 
  }}
>
  Retail Orders
</button>

                        </div>

                    </div>
                    <div>
                        <div className="search-container" style={{marginRight:"10px"}}>
                            <input
                                type="text"
                                placeholder="Customer Name"
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        </div>

                        {/* <div className="search-container" style={{marginRight:"10px"}}>
                            <input
                                type="number"
                                placeholder="Order Number"
                                className="search-input"

                                onChange={handleorderinput}
                            />
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        </div> */}

                        <div className="search-container">
                            <div className="form-group ml-3">
                                <select
                                    id="sweet_name"
                                    name="sweet_name"

                                    onChange={handlesweetnamesearch}
                                    style={{ width: '70%' }}

                                >
                                    <option value="" >Select Sweet*</option>
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
                            {/* <FontAwesomeIcon icon={faSearch} className="search-icon" /> */}
                        </div>
                    </div></>}



                <h2>
                    {activeTab.replace(/_/g, ' ').charAt(0).toUpperCase() + activeTab.replace(/_/g, ' ').slice(1)} Orders
                </h2>
                <div>
                    <table className="order-table">
                        <thead>
                            <tr>
                                {/* <th><b>Serial.No.</b></th> */}
                                <th><b>Order.No.</b></th>
                                <th><b>Name</b></th>
                                <th><b>Price</b></th>
                                {activeTab === 'all' && <th><b>Amount Received</b></th>}
                                {activeTab === 'all' && <th><b>Difference Amount</b></th>}
                                <th><b>Date & Time</b></th>
                                <th><b>Action</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.data?.map((item, index) => (
                                <tr
                                    key={item._id}
                                    style={{
                                        backgroundColor: item?.is_delivered == 1 && item?.is_packed == 1 && item?.is_paid == 1 
                                            ? "#99f79994" // Green color if all conditions are met
                                            : item?.is_packed == 1 && item?.is_delivered == 0
                                            ? "#e7e7abe8"    // Yellow color if only is_packed is 1
                                            : item?.is_packed == 1 && item?.is_delivered == 1
                                             ?
                                            "#45d4dc8a"
                                            :"inherit",  // Default color
                                    }}
                                    
                                >
                                    {/* <td><b>{index + 1}</b></td> */}
                                    <td><b>{item?.order_no}</b></td>
                                    <td><b>{item?.name}</b></td>
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
                                        {(activeTab === "packed" || activeTab === "partial_packed" || activeTab === "all" || activeTab === "initial") && (
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    style={{ cursor: 'pointer', color: '#333' }}
                                                    data-tooltip-id="view-tooltip"
                                                    data-tooltip-content="View"
                                                    onClick={() => handleTableRowClick(item)}
                                                />
                                                <Tooltip id="view-tooltip" place="top" type="dark" effect="solid" />
                                            </>)}
                                        {(activeTab === "initial"  ) && (
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faBox}
                                                    style={{ cursor: 'pointer', color: '#333', marginLeft: '7px' }}
                                                    data-tooltip-id="packed-tooltip"
                                                    data-tooltip-content="Order Packed"
                                                    onClick={() => handlePackedClick(item._id, item)}
                                                />
                                                <Tooltip id="packed-tooltip" place="top" type="dark" effect="solid" />
                                            </>)}

                                        {(activeTab === "packed" ) && (
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


                                        {activeTab !== "paid" && activeTab !== "all" && activeTab !== "partial_packed"  && (
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
                                                    onClick={() => handlegenereatebill(item.sweets, item)}
                                                />
                                                <Tooltip id="complete-tooltip" place="top" type="dark" effect="solid" />
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
                    <Pagination
                        totalPages={items?.total_pages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Order Details</h2>
                            {selectedItem && (activeTab === 'initial' || activeTab === 'packed') && (
                                <button onClick={openEditModal}  className="download-btn">Edit Order</button>
                            )}
                        </div>

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

                        {console.log("order Data", orderData)}
                        {orderData && (
                            <div className="sweet-details-container">
                                {Object.keys(orderData.sweets).map((sweetName, index) => {
                                    const sweet = orderData.sweets[sweetName];
                                    const remainingSweet = orderData.remaining_order[sweetName] || {};

                                    const hasBoxes = sweet.oneKg > 0 || sweet.halfKg > 0 || sweet.quarterKg > 0 || sweet.otherPackings > 0 || sweet.otherPackings2 > 0;

                                    if (!hasBoxes) {
                                        return null;
                                    }

                                    return (
                                        <div key={index} className="sweet-details">
                                            <h3>{sweetName.replace(/_/g, ' ')}</h3>
                                            <table className="order-table">
                                                <thead>
                                                    <tr>
                                                        <th>Weight</th>
                                                        <th>Total Boxes</th>
                                                           <th>Remaining</th>
                                                         <th>Packed</th>
                                                        {activeTab !== "all" && <th>Select Quantity</th>}
                                                        {activeTab !== "all" && <th>Action</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sweet.oneKg > 0 && (
                                                        <tr
                                                            style={{
                                                                backgroundColor: sweet.oneKg === (sweet.oneKg - (remainingSweet.oneKg || 0)) ? "#99f79994" : "inherit",
                                                            }}
                                                        >
                                                            <td>1 Kg</td>
                                                            <td>{sweet.oneKg}</td>
                                                            { <td>{remainingSweet.oneKg || 0}</td>}
                                                            { <td>{sweet.oneKg - (remainingSweet.oneKg || 0)}</td>}
                                                            {activeTab !== "all" && <td> {remainingSweet.oneKg > 0 &&
                                                                <div className="form-group">
                                                                    <select
                                                                        value={selectedValues[sweetName]?.oneKg || 0}
                                                                        onChange={(e) => handleSelectChange(sweetName, "oneKg", parseInt(e.target.value))}
                                                                    >
                                                                        {[...Array(remainingSweet.oneKg + 1 || 1).keys()].map((n) => (
                                                                            <option key={n} value={n}>{n}</option>
                                                                        ))}
                                                                    </select></div>
                                                            }</td>}
                                                            {activeTab !== "all" &&
                                                             <td> {remainingSweet.oneKg > 0 &&
                                                               <button
                                                               className="download-btn"
  disabled={!selectedValues[sweetName]?.oneKg || selectedValues[sweetName]?.oneKg === 0}
  onClick={() => handlePack(sweetName, "oneKg", orderData._id)}
  style={{
    opacity: !selectedValues[sweetName]?.oneKg || selectedValues[sweetName]?.oneKg === 0 ? 0.5 : 1,
    cursor: !selectedValues[sweetName]?.oneKg || selectedValues[sweetName]?.oneKg === 0 ? "not-allowed" : "pointer",
  }}
>
  Packed
</button>

                                                            } </td>}
                                                        </tr>
                                                    )}
                                                    {sweet.halfKg > 0 && (
                                                        <tr style={{
                                                            backgroundColor: sweet.halfKg === (sweet.halfKg - (remainingSweet.halfKg || 0)) ? "#99f79994" : "inherit",
                                                        }}>
                                                            <td>1/2 Kg</td>
                                                            <td>{sweet.halfKg}</td>
                                                            {<td>{remainingSweet.halfKg || 0}</td>}
                                                            {<td>{sweet.halfKg - (remainingSweet.halfKg || 0)}</td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.halfKg > 0 &&
                                                                    <div className="form-group">
                                                                        <select
                                                                            value={selectedValues[sweetName]?.halfKg || 0}
                                                                            onChange={(e) => handleSelectChange(sweetName, "halfKg", parseInt(e.target.value))}
                                                                        >
                                                                            {[...Array(remainingSweet.halfKg + 1 || 1).keys()].map((n) => (
                                                                                <option key={n} value={n}>{n}</option>
                                                                            ))}
                                                                        </select></div>
                                                                } </td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.halfKg > 0 &&
                                                                   <button
                                                                   className="download-btn"
  disabled={!selectedValues[sweetName]?.halfKg || selectedValues[sweetName]?.halfKg === 0}
  onClick={() => handlePack(sweetName, "halfKg", orderData._id)}
  style={{
    opacity: !selectedValues[sweetName]?.halfKg || selectedValues[sweetName]?.halfKg === 0 ? 0.5 : 1,
    cursor: !selectedValues[sweetName]?.halfKg || selectedValues[sweetName]?.halfKg === 0 ? "not-allowed" : "pointer",
  }}
>
  Packed
</button>

                                                                }</td>}
                                                        </tr>
                                                    )}
                                                    {sweet.quarterKg > 0 && (
                                                        <tr style={{
                                                            backgroundColor: sweet.quarterKg === (sweet.quarterKg - (remainingSweet.quarterKg || 0)) ? "#99f79994" : "inherit",
                                                        }}>
                                                            <td>1/4 Kg</td>
                                                            <td>{sweet.quarterKg}</td>
                                                            { <td>{remainingSweet.quarterKg || 0}</td>}
                                                            { <td>{sweet.quarterKg - (remainingSweet.quarterKg || 0)}</td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.quarterKg > 0 &&
                                                                    <div className="form-group">
                                                                        <select
                                                                            value={selectedValues[sweetName]?.quarterKg || 0}
                                                                            onChange={(e) => handleSelectChange(sweetName, "quarterKg", parseInt(e.target.value))}
                                                                        >
                                                                            {[...Array(remainingSweet.quarterKg + 1 || 1).keys()].map((n) => (
                                                                                <option key={n} value={n}>{n}</option>
                                                                            ))}
                                                                        </select></div>
                                                                } </td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.quarterKg > 0 &&
                                                                    // <button onClick={() => handlePack(sweetName, "quarterKg", orderData._id)}>Packed</button>
                                                                    <button
                                                                    className="download-btn"
  disabled={!selectedValues[sweetName]?.quarterKg || selectedValues[sweetName]?.quarterKg === 0}
  onClick={() => handlePack(sweetName, "quarterKg", orderData._id)}
  style={{
    opacity: !selectedValues[sweetName]?.quarterKg || selectedValues[sweetName]?.quarterKg === 0 ? 0.5 : 1,
    cursor: !selectedValues[sweetName]?.quarterKg || selectedValues[sweetName]?.quarterKg === 0 ? "not-allowed" : "pointer",
  }}
>
  Packed
</button>

                                                                } </td>}
                                                        </tr>
                                                    )}
                                                    {sweet.otherPackings > 0 && (
                                                        <tr style={{
                                                            backgroundColor: sweet.otherPackings === (sweet.otherPackings - (remainingSweet.otherPackings || 0)) ? "#99f79994" : "inherit",
                                                        }}>
                                                            <td>{sweet.otherWeight}g</td>
                                                            <td>{sweet.otherPackings}</td>
                                                            {<td>{remainingSweet.otherPackings || 0}</td>}
                                                            {<td>{sweet.otherPackings - (remainingSweet.otherPackings || 0)}</td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.otherPackings > 0 &&
                                                                    <div className="form-group">
                                                                        <select
                                                                            value={selectedValues[sweetName]?.otherPackings || 0}
                                                                            onChange={(e) => handleSelectChange(sweetName, "otherPackings", parseInt(e.target.value))}
                                                                        >
                                                                            {[...Array(remainingSweet.otherPackings + 1 || 1).keys()].map((n) => (
                                                                                <option key={n} value={n}>{n}</option>
                                                                            ))}
                                                                        </select></div>
                                                                } </td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.otherPackings > 0 &&
                                                                    // <button onClick={() => handlePack(sweetName, "otherPackings", orderData._id)}>Packed</button>
                                                                    <button
                                                                     className="download-btn"
  disabled={!selectedValues[sweetName]?.otherPackings || selectedValues[sweetName]?.otherPackings === 0}
  onClick={() => handlePack(sweetName, "otherPackings", orderData._id)}
  style={{
    opacity: !selectedValues[sweetName]?.otherPackings || selectedValues[sweetName]?.otherPackings === 0 ? 0.5 : 1,
    cursor: !selectedValues[sweetName]?.otherPackings || selectedValues[sweetName]?.otherPackings === 0 ? "not-allowed" : "pointer",
  }}
>
  Packed
</button>

                                                                }
                                                            </td>}
                                                        </tr>
                                                    )}
                                                    {sweet.otherPackings2 > 0 && (
                                                        <tr style={{
                                                            backgroundColor: sweet.otherPackings2 === (sweet.otherPackings2 - (remainingSweet.otherPackings2 || 0)) ? "#99f79994" : "inherit",
                                                        }}>
                                                            <td>{sweet.otherWeight2}g</td>
                                                            <td>{sweet.otherPackings2}</td>
                                                            {<td>{remainingSweet.otherPackings2 || 0}</td>}
                                                            {<td>{sweet.otherPackings2 - (remainingSweet.otherPackings2 || 0)}</td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.otherPackings2 > 0 &&
                                                                    <div className="form-group">
                                                                        <select
                                                                            value={selectedValues[sweetName]?.otherPackings2 || 0}
                                                                            onChange={(e) => handleSelectChange(sweetName, "otherPackings2", parseInt(e.target.value))}
                                                                        >
                                                                            {[...Array(remainingSweet.otherPackings2 + 1 || 1).keys()].map((n) => (
                                                                                <option key={n} value={n}>{n}</option>
                                                                            ))}
                                                                        </select></div>
                                                                }</td>}
                                                            {activeTab !== "all" && <td>
                                                                {remainingSweet.otherPackings2 > 0 &&
                                                                    // <button onClick={() => handlePack(sweetName, "otherPackings2", orderData._id)}>Packed</button>
                                                                    <button
                                                                     className="download-btn"
  disabled={!selectedValues[sweetName]?.otherPackings2 || selectedValues[sweetName]?.otherPackings2 === 0}
  onClick={() => handlePack(sweetName, "otherPackings2", orderData._id)}
  style={{
    opacity: !selectedValues[sweetName]?.otherPackings2 || selectedValues[sweetName]?.otherPackings2 === 0 ? 0.5 : 1,
    cursor: !selectedValues[sweetName]?.otherPackings2 || selectedValues[sweetName]?.otherPackings2 === 0 ? "not-allowed" : "pointer",
  }}
>
  Packed
</button>

                                                                }
                                                            </td>}
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

            {/* Nested Edit Modal overlaying the view modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Order Modal"
                className="custom-sweets-modal edit-order-modal"
                overlayClassName="custom-sweets-overlay"
            >
                {selectedItem && (
                    <EditOrder orderId={selectedItem._id} onClose={closeEditModal} activeTab={activeTab} onUpdated={() => {
                        // refresh the table after editing
                        if (activeTab === 'initial') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_sweet_order_details');
                        } else if (activeTab === 'partial_packed') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_half_packed_orders');
                        } else if (activeTab === 'packed') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_packed_orders');
                        } else if (activeTab === 'delivered') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_delivered_orders');
                        } else if (activeTab === 'paid') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_paid_orders');
                        } else if (activeTab === 'all') {
                            fetchItemsFromAPI('https://dms-backend-seven.vercel.app/get_all_orders');
                        }
                        // refresh current modal data too
                        if (selectedItem?._id) {
                            postViewAPI(selectedItem._id, '');
                        }
                    }} />
                )}
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
            <Loader loading={loading} />
        </div>
    );
};

export default OrderLife;
