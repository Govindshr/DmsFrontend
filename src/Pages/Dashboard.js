import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalWeights, setTotalWeights] = useState({});
  const [boxnumber, setBoxnumber] = useState([]);
  const [packedboxnumber, setPackedboxnumber] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, boxRes, packedRes] = await Promise.all([
          fetch('https://dms-backend-seven.vercel.app/get_dashboard'),
          fetch('https://dms-backend-seven.vercel.app/get_sweets_aggregation'),
          fetch('https://dms-backend-seven.vercel.app/get_packed_sweets_aggregation'),
        ]);

        if (dashboardRes.ok && boxRes.ok && packedRes.ok) {
          const [dashboardData, boxData, packedBoxData] = await Promise.all([
            dashboardRes.json(),
            boxRes.json(),
            packedRes.json(),
          ]);
          calculateTotalWeights(dashboardData.data);
          setBoxnumber(boxData.data);
          setPackedboxnumber(packedBoxData.data);
          setLoading(false);
        } else {
          toast.error('Failed to fetch some data!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching data!');
      }
    };
    fetchData();
  }, []);

  const calculateTotalWeights = (orders) => {
    const totals = {};
    orders.forEach((order) => {
      Object.keys(order.sweets).forEach((sweetName) => {
        const sweetData = order.sweets[sweetName];
        const totalWeight = sweetData.totalWeight || 0;

        if (!totals[sweetName]) {
          totals[sweetName] = { totalWeight: 0 };
        }
        totals[sweetName].totalWeight += totalWeight;
      });
    });
    setTotalWeights(totals);
  };

  const toggleAccordion = (sweetName) => {
    setExpanded((prev) => ({ ...prev, [sweetName]: !prev[sweetName] }));
  };

  const getSweetDetails = (sweetName) => {
    const sweet = boxnumber.find((s) => s.sweetName === sweetName);
    const packedSweet = packedboxnumber.find((s) => s.sweetName === sweetName);

    if (!sweet) return null;

    const totalBoxes = {
      '1000gm': sweet.totalOneKg,
      '500gm': sweet.totalHalfKg,
      '250gm': sweet.totalQuarterKg,
    };

    const addOtherObjectFields = (obj, target) => {
      if (!obj) return;
      Object.keys(obj).forEach((key) => {
        if (!isNaN(key) && key !== 0) {
          target[`${key}gm`] = (target[`${key}gm`] || 0) + obj[key];
        }
      });
    };

    addOtherObjectFields(sweet.totalOtherWeight, totalBoxes);
    addOtherObjectFields(sweet.totalOtherWeight2, totalBoxes);

    const packedBoxes = { ...totalBoxes };
    if (packedSweet) {
      packedBoxes['1000gm'] = packedSweet.totalOneKg;
      packedBoxes['500gm'] = packedSweet.totalHalfKg;
      packedBoxes['250gm'] = packedSweet.totalQuarterKg;

      addOtherObjectFields(packedSweet.totalOtherWeight, packedBoxes);
      addOtherObjectFields(packedSweet.totalOtherWeight2, packedBoxes);
    }

    return { totalBoxes, packedBoxes };
  };

  return (
    <div className="dash-accordion-container">
      <h1 className="dash-accordion-title">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.keys(totalWeights).map((sweetName, idx) => {
          const sweet = totalWeights[sweetName];
          const sweetDetails = getSweetDetails(sweetName);
          if (!sweetDetails) return null;

          const { totalBoxes, packedBoxes } = sweetDetails;
          return (
          <div
  key={idx}
  className={`dash-accordion-item ${expanded[sweetName] ? 'open' : ''}`}
>

              <div className="dash-accordion-header" onClick={() => toggleAccordion(sweetName)}>
                <span className="dash-accordion-sweet-name">{sweetName.replace(/_/g, ' ')}</span>
                <span className="dash-accordion-total">Total Order - {sweet.totalWeight.toFixed(2)} Kg</span>
                <span className="dash-accordion-toggle">
                  {expanded[sweetName] ? '▲' : '▼'}
                </span>
              </div>

              {expanded[sweetName] && (
                <div className="dash-accordion-body">
                  <table className="dash-accordion-table">
                    <thead>
                      <tr>
                        <th>Packing</th>
                        <th>Total Boxes</th>
                        <th>Packed Boxes</th>
                        <th>Remaining Boxes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(totalBoxes)
                        .filter((pack) => pack !== '0gm')
                        .map((pack, i) => {
                          const packed = packedBoxes[pack] || 0;
                          const remaining = totalBoxes[pack] - packed;
                          return (
                            <tr key={i}>
                              <td>{pack}</td>
                              <td>{totalBoxes[pack]}</td>
                              <td>{packed}</td>
                              <td>{remaining}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
