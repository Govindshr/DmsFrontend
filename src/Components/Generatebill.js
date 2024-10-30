import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './Generatebill.css';

const GenerateBill = ({ sweets, data }) => {
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const invoiceRef = useRef(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');
  const formattedTime = today.toLocaleTimeString('en-GB');

  let grandTotalPrice = 0;
  let grandTotalWeight = 0;  // To store the total quantity of sweets
  const billDetails = [];

  Object.keys(sweets).forEach(sweetKey => {
    const { price, oneKg, halfKg, quarterKg, otherWeight, otherPackings, otherWeight2, otherPackings2 } = sweets[sweetKey];
    const otherWeightKg = otherWeight / 1000;
    const otherWeight2Kg = otherWeight2 / 1000;
    const totalPrice = (oneKg * price) + (halfKg * price * 0.5) + (quarterKg * price * 0.25) +
                       (otherWeightKg * otherPackings * price) + (otherWeight2Kg * otherPackings2 * price);
    const totalWeight = oneKg + (halfKg * 0.5) + (quarterKg * 0.25) +
                        (otherWeightKg * otherPackings) + (otherWeight2Kg * otherPackings2);
    
    if (totalPrice > 0) {
      grandTotalPrice += totalPrice;
      grandTotalWeight += totalWeight;  // Accumulate the total quantity
      billDetails.push({
        name: sweetKey.replace('_', ' '),
        qty: totalWeight.toFixed(2),
        unitPrice: price.toFixed(2),
        price: totalPrice.toFixed(2)
      });
    }
  });

  // Function to calculate delivery cost based on weight
  const calculateDeliveryCost = (weight) => {
    if (weight >= 1 && weight <= 3) return 25;
    if (weight >= 4 && weight <= 6) return 50;
    if (weight >= 7 && weight <= 15) return 100;
    if (weight > 15) return 150;
    return 0; // In case weight is less than 1 kg or zero
  };

  const deliveryCost = calculateDeliveryCost(grandTotalWeight);
  const finalTotalPrice = includeDelivery ? grandTotalPrice + deliveryCost : grandTotalPrice;

  const handleDownloadPdf = async () => {
    setShowDownloadButton(false);
    const canvas = await html2canvas(invoiceRef.current);
    const dataImg = canvas.toDataURL('image/jpeg');
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(dataImg, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Invoice-${data?.name || 'Customer'}-${data?.phone || ''}.pdf`);
    setShowDownloadButton(true);
  };

  return (
    <>
      <div className="invoice-container" ref={invoiceRef}>
        <header className="invoice-header">
          <div className="header-left">
            <h2>Shringi Food Services</h2>
            <p>Prajapat Colony, Near Algoja Resort, Nainwa Road, Bundi</p>
            <p>Phone: 9694487748</p>
            <p>Email: shekharshringi@gmail.com</p>
          </div>
          <div className="header-right">
            <h1>Tax Invoice</h1>
            <p><strong>Order No:</strong> {data?.order_no}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Time:</strong> {formattedTime}</p>
          </div>
        </header>

        <section className="bill-to">
          <p><strong>Bill To:</strong> {data?.name}</p>
          <p><strong>Contact No:</strong> {data?.number}</p>
        </section>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              {/* <th>HSN/SAC</th> */}
              <th>Quantity (Kg)</th>
              <th>Unit Price (₹)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {billDetails.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name.replace(/_/g, ' ')}</td>
                {/* <td></td> */}
                <td>{item.qty}</td>
                <td>{item.unitPrice}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">Total Quantity</td>
              <td>{grandTotalWeight.toFixed(2)} Kg</td>
            </tr>
            <tr>
              <td colSpan="4">Subtotal</td>
              <td>₹{grandTotalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4">
                <label>
                  <input
                    type="checkbox"
                    checked={includeDelivery}
                    onChange={(e) => setIncludeDelivery(e.target.checked)}
                  /> Add Delivery Cost (₹{deliveryCost.toFixed(2)})
                </label>
              </td>
              <td>₹{includeDelivery ? deliveryCost.toFixed(2) : "0.00"}</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ fontWeight: 'bold' }}>Total</td>
              <td style={{ fontWeight: 'bold' }}>₹{finalTotalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <footer className="invoice-footer">
          <p><strong>Payment Mode:</strong> Cash</p>
        </footer>
      </div>
      <div>
        {showDownloadButton && <button onClick={handleDownloadPdf}>Download Invoice</button>}
      </div>
    </>
  );
};

export default GenerateBill;
