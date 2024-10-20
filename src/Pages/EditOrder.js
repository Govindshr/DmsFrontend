import React, { useState, useEffect, useMemo } from 'react';
import './EditOrder.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';  
import 'react-toastify/dist/ReactToastify.css';

const EditOrder = () => {
  const { id } = useParams(); // Get the dynamic id from the URL
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [number, setNumber] = useState('');
  const [orderData, setOrderData] = useState({
    Kaju_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 700 },
    Badam_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 700 },
    Gulab_Jamun: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 300 },
    Ras_Gulla: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
    Laddoo_Milk: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 350 },
    Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
    Ladoo_Kesar: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
  });

  // Fetch order details based on the id from the route
  useEffect(() => {
    if (id) {
      getEditedData(id);
    }
  }, [id]);

  const getEditedData = async (id) => {
    try {
      const response = await fetch('https://dms-backend-seven.vercel.app/view_sweets_orders_by_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data",data)
        // Set the fetched order data to state
        setOrderData(data.data[0].sweets);
        setName(data.data[0].name);
        setNumber(data.data[0].number);
      } else {
        toast.error('Failed to fetch order details!');
      }
    } catch (error) {
      toast.error('An error occurred while fetching order details!');
    }
  };

  const handleChange = (sweet, field, value) => {
    setOrderData(prevData => ({
      ...prevData,
      [sweet]: {
        ...prevData[sweet],
        [field]: Number(value),
      },
    }));
  };

  const calculateSummary = useMemo(() => {
    let totalPrice = 0;
    let totalWeight = 0;
    let totalBoxes = 0;

    Object.keys(orderData).forEach(sweet => {
      const sweetData = orderData[sweet];
      const sweetPrice = sweetData.price;
      const oneKgWeight = sweetData.oneKg * 1;
      const halfKgWeight = sweetData.halfKg * 0.5;
      const quarterKgWeight = sweetData.quarterKg * 0.25;
      const otherWeightKg = (sweetData.otherWeight / 1000) * sweetData.otherPackings;
      const otherWeightKg2 = (sweetData.otherWeight2 / 1000) * sweetData.otherPackings2;

      const sweetTotalWeight = oneKgWeight + halfKgWeight + quarterKgWeight + otherWeightKg + otherWeightKg2;
      const sweetTotalPrice = sweetTotalWeight * sweetPrice;
      const sweetTotalBoxes = sweetData.oneKg + sweetData.halfKg + sweetData.quarterKg + sweetData.otherPackings + sweetData.otherPackings2;

      totalWeight += sweetTotalWeight;
      totalPrice += sweetTotalPrice;
      totalBoxes += sweetTotalBoxes;
    });

    return {
      totalPrice,
      totalWeight,
      totalBoxes,
    };
  }, [orderData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedOrderData = { ...orderData };
    Object.keys(updatedOrderData).forEach(sweet => {
      const sweetData = updatedOrderData[sweet];
      const oneKgWeight = sweetData.oneKg * 1;
      const halfKgWeight = sweetData.halfKg * 0.5;
      const quarterKgWeight = sweetData.quarterKg * 0.25;
      const otherWeightKg = (sweetData.otherWeight / 1000) * sweetData.otherPackings;
      const otherWeightKg2 = (sweetData.otherWeight2 / 1000) * sweetData.otherPackings2;

      const totalWeight = oneKgWeight + halfKgWeight + quarterKgWeight + otherWeightKg + otherWeightKg2;
      updatedOrderData[sweet].totalWeight = totalWeight;
    });

    const finalOrder = {
      order_id:id,
      name,
      number,
      sweets: updatedOrderData,
      summary: calculateSummary,
    };
console.log("finalOrder",finalOrder)
    try {
      const response = await fetch('https://dms-backend-seven.vercel.app/update_sweet_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalOrder),
      });

      if (response.ok) {
        navigate('/order-life'); 
        toast.success('Order updated successfully!');
       
      } else {
        toast.error('Failed to update order!');
      }
    } catch (error) {
      toast.error('An error occurred while updating order!');
    }
  };

  const handleReset = () => {
    setName('');
    setNumber('');
    setOrderData({
      Kaju_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 700 },
      Badam_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 700 },
      Gulab_Jamun: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 300 },
      Ras_Gulla: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
      Laddoo_Milk: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 350 },
      Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
      Ladoo_Kesar: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 400 },
    });
  };
  return (
    <>
      <div className="add-order-container">
        <div className="add-order-wrapper">
          <div className="add-order">
            <h1>Edit Order</h1>
            <form onSubmit={handleSubmit}>
              <div className='extra'>
                <div className="form-group">
                  <label htmlFor="name"><b>Customer Name* </b>:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    // size={100}
                    // style={{width:'50%'}}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="form-group" >
                  <label htmlFor="number"><b>Customer Number* </b>:</label>
                  <input
                    type="text"
                    id="number"
                    value={number}
                    // style={{width:'50%'}}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter customer number"
                    required
                  />
                </div>
              </div>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Item Name</th>
                    <th>Price<br></br>(Per/Kg)</th>
                    <th>1Kg <br></br>Packing</th>
                    <th>1/2Kg Packing</th>
                    <th>1/4Kg Packing</th>
                    <th>Other<br></br> (weight x Quant)</th>
                    <th>Other2<br></br> (weight x Quant)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(orderData).map((sweet, index) => (
                    <tr key={sweet}>
                      <td><b>{index + 1}</b></td>
                      <td><b>{sweet.replace(/_/g, ' ')}</b></td>
                      <td><b>{orderData[sweet].price}</b></td>
                      <td>
                        <input
                          type="number"
                          value={orderData[sweet].oneKg}
                          onChange={(e) => handleChange(sweet, 'oneKg', e.target.value)}
                          onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                          min="0"
                          placeholder="Enter quantity"
                        />

                      </td>
                      <td>
                        <input
                          type="number"
                          value={orderData[sweet].halfKg}
                          onChange={(e) => handleChange(sweet, 'halfKg', e.target.value)}
                          onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                          min="0"
                          placeholder="Enter quantity"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={orderData[sweet].quarterKg}
                          onChange={(e) => handleChange(sweet, 'quarterKg', e.target.value)}
                          onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                          min="0"
                          placeholder="Enter quantity"
                        />
                      </td>
                      <td>
                        <div className="custom-packing">
                          <input
                            type="number"
                            value={orderData[sweet].otherWeight}
                            onChange={(e) => handleChange(sweet, 'otherWeight', e.target.value)}
                            min="0"
                            onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                            placeholder="Weight (g)"
                            className="custom-packing-weight"
                          />
                          <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer', color: 'Black', margin: '4px' }} />
                          <input
                            type="number"
                            value={orderData[sweet].otherPackings}
                            onChange={(e) => handleChange(sweet, 'otherPackings', e.target.value)}
                            min="0"
                            onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                            placeholder="No. of packs"
                            className="custom-packing-quantity"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="custom-packing">
                          <input
                            type="number"
                            value={orderData[sweet].otherWeight2}
                            onChange={(e) => handleChange(sweet, 'otherWeight2', e.target.value)}
                            min="0"
                            onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                            placeholder="Weight (g)"
                            className="custom-packing-weight"
                          />
                          <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer', color: 'Black', margin: '4px' }} />
                          <input
                            type="number"
                            value={orderData[sweet].otherPackings2}
                            onChange={(e) => handleChange(sweet, 'otherPackings2', e.target.value)}
                            min="0"
                            onWheel={(e) => e.target.blur()} // Prevent scroll interaction
                            placeholder="No. of packs"
                            className="custom-packing-quantity"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="order-table">
                <thead>
                  <tr>
                    <th>Total Price </th>
                    <th>Total Weight</th>
                    <th>Total Boxes</th>

                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td><b>₹{calculateSummary.totalPrice.toFixed(2)}</b></td>
                    <td><b> {calculateSummary.totalWeight.toFixed(2)} Kg</b></td>
                    <td><b>{calculateSummary.totalBoxes}</b></td>

                  </tr>

                </tbody>
              </table>

              <div className="button-group">
                <button type="submit">Submit Order</button>
                
              </div>
            </form>
          </div>

          {/* <div className="order-summary">
            <div style={{ marginTop: '60%' }}>
              <h2>Order Summary</h2>
              <p><b>Total Price : ₹{calculateSummary.totalPrice.toFixed(2)}</b></p>
              <p><b>Total Weight : {calculateSummary.totalWeight.toFixed(2)} Kg</b></p>
              <p><b>Total Boxes : {calculateSummary.totalBoxes}</b></p>
            </div>
          </div> */}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditOrder;
