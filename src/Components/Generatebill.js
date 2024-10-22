import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './Generatebill.css';

const GenerateBill = ({ sweets, data }) => {
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const deliveryCost = 25.0;
  const invoiceRef = useRef(null);

  // Get the current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB'); // e.g., "22/10/2024"

  let grandTotalPrice = 0;
  let grandTotalWeight = 0;
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
      billDetails.push({
        name: sweetKey.replace('_', ' '),
        qty: totalWeight.toFixed(2),
        unitPrice: price.toFixed(2),
        price: totalPrice.toFixed(2)
      });
    }
  });

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

  return (<>
    <div className="invoice-container" ref={invoiceRef}>
      <header className="invoice-header">
        <img src='./images/logo.jpg' height={100} width={200} style={{ backgroundColor: "#5e5e5e" }} alt="Logo" />
        <div>
          <h1>Invoice</h1>
          <p>Date: {formattedDate}</p>  {/* Current date is displayed here */}
          <p>Bill to: {data?.name}</p>
          <p>Prajapati Colony, Nainwa Road Bundi</p>
          <p>Phone No.: 9694487748</p>
        </div>
      </header>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item Name </th>
            <th>Qty (kg)</th>
            <th>Unit Price (₹)</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {billDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.unitPrice}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Subtotal</td>
            <td>₹{grandTotalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3">
              <label>
                <input
                  type="checkbox"
                  checked={includeDelivery}
                  onChange={(e) => setIncludeDelivery(e.target.checked)}
                /> Add Delivery Cost (₹25)
              </label>
            </td>
            <td>₹{includeDelivery ? deliveryCost.toFixed(2) : "0.00"}</td>
          </tr>
          <tr>
            <td colSpan="3">Total</td>
            <td>₹{finalTotalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <footer>
        <p>Please make all checks payable to Sweet Shop</p>
        <p>Email: shekharshringi@gmail.com</p>
      </footer>
    </div>
    <button onClick={handleDownloadPdf}>Download Invoice</button></>
  );
}

export default GenerateBill;
