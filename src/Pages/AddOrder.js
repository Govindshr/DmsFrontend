import React, { useState, useMemo } from 'react';
import './AddOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddOrder = () => {
  const [name, setName] = useState('');
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
      const otherWeightKg = (sweetData.otherWeight / 1000) * sweetData.otherPackings; // Convert grams to kilograms
      const otherWeightKg2 = (sweetData.otherWeight2 / 1000) * sweetData.otherPackings2; // Convert grams to kilograms

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
      const otherWeightKg = (sweetData.otherWeight / 1000) * sweetData.otherPackings; // Convert grams to kilograms
      const otherWeightKg2 = (sweetData.otherWeight2 / 1000) * sweetData.otherPackings2; // Convert grams to kilograms

      const totalWeight = oneKgWeight + halfKgWeight + quarterKgWeight + otherWeightKg + otherWeightKg2;

      updatedOrderData[sweet].totalWeight = totalWeight;
    });

    const finalOrder = {
      name,
      number,
      sweets: updatedOrderData,
      summary: calculateSummary,
    };

    try {
      const response = await fetch('https://dms-backend-seven.vercel.app/sweet_order_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalOrder),
      });

      if (response.ok) {
        toast.success('Operation was successful!');
        handleReset();
      } else {
        toast.error('Operation Failed!');
      }
    } catch (error) {
      toast.error('An error occurred!');
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
            <h1>Add New Order</h1>
            <form onSubmit={handleSubmit}>
              <div className='extra'>
                <div className="form-group">
                  <label htmlFor="name"><b>Customer Name* </b>:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
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
                    <th>Total Weight<br></br>(Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(orderData).map((sweet, index) => {
                    const sweetData = orderData[sweet];
                    const oneKgWeight = sweetData.oneKg * 1;
                    const halfKgWeight = sweetData.halfKg * 0.5;
                    const quarterKgWeight = sweetData.quarterKg * 0.25;
                    const otherWeightKg = (sweetData.otherWeight / 1000) * sweetData.otherPackings;
                    const otherWeightKg2 = (sweetData.otherWeight2 / 1000) * sweetData.otherPackings2;
                    const totalWeight = oneKgWeight + halfKgWeight + quarterKgWeight + otherWeightKg + otherWeightKg2;

                    return (
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
                        <td><b>{totalWeight.toFixed(2)} Kg</b></td>
                      </tr>
                    );
                  })}
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
                <button type="button" onClick={handleReset} className="reset-button"><b>Reset</b></button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddOrder;
