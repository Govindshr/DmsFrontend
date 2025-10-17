import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './Generatebill.css';

const GenerateBill = ({ sweets, data }) => {
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const invoiceRef = useRef(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');
  const formattedTime = today.toLocaleTimeString('en-GB');

  let grandTotalPrice = 0;
  let grandTotalWeight = 0;
  const billDetails = [];

  Object.keys(sweets).forEach((sweetKey) => {
    const {
      price,
      oneKg,
      halfKg,
      quarterKg,
      otherWeight,
      otherPackings,
      otherWeight2,
      otherPackings2,
    } = sweets[sweetKey];

    const otherWeightKg = otherWeight / 1000;
    const otherWeight2Kg = otherWeight2 / 1000;

    const totalPrice =
      oneKg * price +
      halfKg * price * 0.5 +
      quarterKg * price * 0.25 +
      otherWeightKg * otherPackings * price +
      otherWeight2Kg * otherPackings2 * price;

    const totalWeight =
      oneKg +
      halfKg * 0.5 +
      quarterKg * 0.25 +
      otherWeightKg * otherPackings +
      otherWeight2Kg * otherPackings2;

    if (totalPrice > 0) {
      grandTotalPrice += totalPrice;
      grandTotalWeight += totalWeight;
      billDetails.push({
        name: sweetKey.replace('_', ' '),
        qty: totalWeight.toFixed(2),
        unitPrice: price.toFixed(2),
        price: totalPrice.toFixed(2),
      });
    }
  });

const generateInvoicePdf = async () => {
  setShowDownloadButton(false);

  const canvas = await html2canvas(invoiceRef.current, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  setShowDownloadButton(true);

  return { pdfBlob, pdfUrl };
};

const handleDownloadPdf = async () => {
  const { pdfUrl } = await generateInvoicePdf();

  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `Invoice-${data?.name || 'Customer'}.pdf`;
  link.click();
};


const handleShareOnWhatsApp = async () => {
  try {
    // Capture invoice as image
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Option 1: send text + image (works best when uploaded manually)
    const message = `🧾 *Invoice Details*\nOrder No: ${data?.order_no || 'N/A'}\nCustomer: ${data?.name}\nTotal: ₹${grandTotalPrice.toFixed(2)}\n\nInvoice attached below 👇`;

    // Create WhatsApp link (without phone number, so user can choose contact)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Open WhatsApp Web / Mobile app
    window.open(whatsappUrl, "_blank");

    // Optional: download image to share manually in WhatsApp (as file upload)
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `Invoice-${data?.name || 'Customer'}.jpg`;
    link.click();

  } catch (error) {
    console.error("Error generating invoice for WhatsApp:", error);
  }
};
const handleSharePdfOnWhatsApp = async () => {
  try {
    const { pdfBlob } = await generateInvoicePdf();

    const festiveMessage = `🧾 *Shringi Food Services*\n\nThank you for your order, *${data?.name || 'Valued Customer'}*! 💛\n\nWe truly appreciate your trust and support.\n\n🎉 *Wishing you and your family a very Happy Diwali!* 🪔\n\nHere’s your invoice:\n• Order No: ${data?.order_no || 'N/A'}\n• Total Amount: ₹${grandTotalPrice.toFixed(2)}\n\nPlease find the attached PDF below 👇`;

    // ✅ Mobile browsers (Android/iOS) — native share with PDF
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [new File([pdfBlob], 'Invoice.pdf', { type: 'application/pdf' })],
      })
    ) {
      const file = new File(
        [pdfBlob],
        `Invoice-${data?.name || 'Customer'}.pdf`,
        { type: 'application/pdf' }
      );

      await navigator.share({
        title: 'Invoice',
        text: festiveMessage,
        files: [file],
      });

      console.log('Shared successfully!');
    } else {
      // ✅ Fallback for desktop — open WhatsApp Web with message
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const whatsappBaseUrl = isMobile
        ? 'https://wa.me/?text='
        : 'https://web.whatsapp.com/send?text=';
      const whatsappUrl = `${whatsappBaseUrl}${encodeURIComponent(festiveMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
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
            <p><strong>Order No:</strong> {data?.order_no || 'N/A'}</p>
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
              <td colSpan="4" style={{ fontWeight: 'bold' }}>Total Amount</td>
              <td style={{ fontWeight: 'bold' }}>₹{grandTotalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <footer className="invoice-footer">
          <p><strong>Thank you for your order,We truly appreciate your trust and support.
              🎉 Wishing you and your family a very <strong>Happy Diwali!</strong> 🪔</strong> </p>
        </footer>
      </div>

   <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
  {showDownloadButton && (
    <>
      <button onClick={handleDownloadPdf} className="download-btn">
        Download Invoice
      </button>
      <button onClick={handleSharePdfOnWhatsApp} className="whatsapp-btn">
        Share Invoice on WhatsApp
      </button>
    </>
  )}
</div>


    </>
  );
};

export default GenerateBill;
