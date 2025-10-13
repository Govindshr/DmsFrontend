import React, { useState, useMemo } from 'react';
import './AddOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import GenerateBill from '../Components/Generatebill';
import ordersData from '../data/ordersData.json'
Modal.setAppElement('#root');

const AddRetailOrders = () => {
 const [suggestions, setSuggestions] = useState([]);
const [billModal, setBillModal] = useState(false);
const [billData, setBillData] = useState(null);
const [paymentModal, setPaymentModal] = useState(false);
const [payLater, setPayLater] = useState(false);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState('');
  const [receivedMoney, setReceivedMoney] = useState('');
  const [paymentMode, setPaymentMode] = useState('');

  const [orderData, setOrderData] = useState({
    Dry_Fruit_Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 1000 },
    Dry_Fruit_Kaju_Patisa: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 1000 },
    Sangam_Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 900 },
    Kaju_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Kaju_Katli_Bina_Work: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Badam_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Badam_Katli_Bina_Work: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Makhan_Bada: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 550 },
    Nainwa_Ka_Petha: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Bundi_Ke_Laddu_Kesar: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Giri_Pak: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Gulab_Jamun: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Namkeen: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 250 },
    Papdi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 250 },
  });


    const handleSearch = (value, field) => {
  let matches = [];

  if (value.trim().length > 0) {
    matches = ordersData.filter(order => {
      const target = field === 'name'
        ? order.name.toLowerCase()
        : order.number.toLowerCase();
      return target.includes(value.toLowerCase());
    });
  }

  setSuggestions(matches.slice(0, 5)); // limit suggestions
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

const handleSubmit = (e) => {
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
    name,
    number,
    sweets: updatedOrderData,
    summary: calculateSummary,
    retail_order: true,
  };

  // Step 1: show bill first
  setBillData(finalOrder);
  setBillModal(true);
};


  const handleReset = () => {
    setName('');
    setNumber('');
    setPaymentMode('');
    setReceivedMoney('')
    setOrderData({
 Dry_Fruit_Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 1000 },
    Dry_Fruit_Kaju_Patisa: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 1000 },
    Sangam_Barfi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 900 },
    Kaju_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Kaju_Katli_Bina_Work: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Badam_Katli: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Badam_Katli_Bina_Work: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 850 },
    Makhan_Bada: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 550 },
    Nainwa_Ka_Petha: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Bundi_Ke_Laddu_Kesar: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Giri_Pak: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Gulab_Jamun: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 500 },
    Namkeen: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 250 },
    Papdi: { oneKg: 0, halfKg: 0, quarterKg: 0, otherWeight: 0, otherPackings: 0, otherWeight2: 0, otherPackings2: 0, price: 250 },
  
    });
  };
  const handlecheckboxChange = (e) => {
   

    
    if(e.target.checked===false){
      setPaymentMode('')
      setReceivedMoney('')
    }
    // setBackgroundColor(getBackgroundColor(item?.is_packed, item?.is_delivered, item?.is_paid));
};
  return (
    <>
      <div className="add-order-container">
        <div className="add-order-wrapper">
          <div className="add-order">
            <h1>Retail Order</h1>
            <form onSubmit={handleSubmit}>
             <div className='extra'>
                {/* --- Customer Name Input --- */}
<div className="form-group" style={{ position: 'relative' }}>
  <label htmlFor="name"><b>Customer Name*</b> :</label>
  <input
    type="text"
    id="name"
    value={name}
    onChange={(e) => {
      setName(e.target.value);
      handleSearch(e.target.value, 'name');
    }}
    placeholder="Enter customer name"
    required
  />

  {suggestions.length > 0 && (
    <ul className="suggestions-list">
      {suggestions.map((sug, index) => (
        <li
          key={index}
          onClick={() => {
            setName(sug.name);
            setNumber(sug.number);
            setSuggestions([]);
          }}
        >
          {sug.name} — {sug.number}
        </li>
      ))}
    </ul>
  )}
</div>

{/* --- Customer Number Input --- */}
<div className="form-group" style={{ position: 'relative' }}>
  <label htmlFor="number"><b>Customer Number*</b> :</label>
  <input
    type="text"
    id="number"
    value={number}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= 10) {
        setNumber(value);
        handleSearch(value, 'number');
      }
    }}
    placeholder="Enter customer number"
    required
  />

  {suggestions.length > 0 && (
    <ul className="suggestions-list">
      {suggestions.map((sug, index) => (
        <li
          key={index}
          onClick={() => {
            setName(sug.name);
            setNumber(sug.number);
            setSuggestions([]);
          }}
        >
          {sug.name} — {sug.number}
        </li>
      ))}
    </ul>
  )}
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
                            onWheel={(e) => e.target.blur()}
                            min="0"
                            placeholder="Enter quantity"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={orderData[sweet].halfKg}
                            onChange={(e) => handleChange(sweet, 'halfKg', e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            min="0"
                            placeholder="Enter quantity"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={orderData[sweet].quarterKg}
                            onChange={(e) => handleChange(sweet, 'quarterKg', e.target.value)}
                            onWheel={(e) => e.target.blur()}
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
                              onWheel={(e) => e.target.blur()}
                              placeholder="Weight (g)"
                              className="custom-packing-weight"
                            />
                            <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer', color: 'Black', margin: '4px' }} />
                            <input
                              type="number"
                              value={orderData[sweet].otherPackings}
                              onChange={(e) => handleChange(sweet, 'otherPackings', e.target.value)}
                              min="0"
                              onWheel={(e) => e.target.blur()}
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
                              onWheel={(e) => e.target.blur()}
                              placeholder="Weight (g)"
                              className="custom-packing-weight"
                            />
                            <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer', color: 'Black', margin: '4px' }} />
                            <input
                              type="number"
                              value={orderData[sweet].otherPackings2}
                              onChange={(e) => handleChange(sweet, 'otherPackings2', e.target.value)}
                              min="0"
                              onWheel={(e) => e.target.blur()}
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

      {/* BILL MODAL */}
<Modal
  isOpen={billModal}
  onRequestClose={() => setBillModal(false)}
  shouldCloseOnOverlayClick={false} // 👈 add this line
  contentLabel="Invoice Modal"
  className="custom-sweets-modal"
  overlayClassName="custom-sweets-overlay"
>

  {billData && (
    <>
      <h2>Invoice Preview</h2>
      <GenerateBill sweets={billData.sweets} data={billData} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          style={{ marginRight: '10px' }}
          onClick={() => setPaymentModal(true)} // open second modal
        >
          Finish Order
        </button>
        <button onClick={() => setBillModal(false)}>Close</button>
      </div>
    </>
  )}
</Modal>

{/* PAYMENT MODAL */}
<Modal
  isOpen={paymentModal}
  onRequestClose={() => setPaymentModal(false)}
  shouldCloseOnOverlayClick={true}
  ariaHideApp={false}
  contentLabel="Payment Modal"
  className="Modal"
  overlayClassName="Overlay"
>
  <h2>Payment Confirmation</h2>

  {billData && billData.summary && (
    <div className="total-amount">
      Total Amount to Pay: ₹{billData.summary.totalPrice.toFixed(2)}
    </div>
  )}

  {/* Pay Later */}
  <div className="paylater-row">
    <input
      type="checkbox"
      checked={payLater}
      onChange={(e) => setPayLater(e.target.checked)}
    />
    <label><b>Pay Later</b></label>
  </div>

  {!payLater && (
    <>
      <div className="form-group">
        <label htmlFor="receivedMoney">Received Money:</label>
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
        <label htmlFor="paymentmode">Payment Mode:</label>
        <select
          id="paymentmode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="" disabled>Select type*</option>
          <option value="online">Online</option>
          <option value="cash">Cash</option>
        </select>
      </div>
    </>
  )}

  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
    <button
      type="button"
      onClick={async () => {
        if (!payLater && (!receivedMoney || !paymentMode)) {
          toast.error("Please fill both fields or select Pay Later");
          return;
        }

        const finalOrder = {
          ...billData,
          received_amount: payLater ? 0 : receivedMoney,
          payment_mode: payLater ? 'pay_later' : paymentMode,
        };

        try {
          setLoading(true);
          const response = await fetch('https://dms-backend-seven.vercel.app/sweet_order_details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalOrder),
          });

          if (response.ok) {
            toast.success(payLater ? 'Order added as Pay Later!' : 'Order saved successfully!');
            setPaymentModal(false);
            setBillModal(false);
            handleReset();
            setPayLater(false);
          } else {
            toast.error('Failed to save order.');
          }
        } catch (error) {
          toast.error('An error occurred.');
        } finally {
          setLoading(false);
        }
      }}
    >
      {payLater ? 'Submit as Pay Later' : 'Submit Payment'}
    </button>

    <button className="cancel-btn" onClick={() => setPaymentModal(false)}>
      Cancel
    </button>
  </div>
</Modal>



      <ToastContainer />
  


      {/* <Loader loading={loading} /> */}
    </>
  );
};

export default AddRetailOrders;
