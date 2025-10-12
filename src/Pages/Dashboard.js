import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles for the circular progress bar
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './Dashboard.css';

const Dashboard = () => {
  
  const [loading, setLoading] = useState(true);
  const [totalWeights, setTotalWeights] = useState({});
  const [Weightobjects, setWeightobject] = useState({});
  const [PackedWeightobject, setPackedWeightobject] = useState({});
  const [selectedSweet, setSelectedSweet] = useState(null); // State to track selected sweet
  const [boxnumber, setBoxnumber] = useState({});
  const [packedboxnumber, setPackedboxnumber] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2025/get_dashboard');
        if (response.ok) {
          const result = await response.json();
          if (isMounted) {
            
            calculateTotalWeights(result.data);
            setLoading(false);
          }
        } else {
          toast.error('Failed to fetch data!');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data!');
      }
    };

    const fetchBoxData = async () => {
      try {
        const response = await fetch('http://localhost:2025/get_sweets_aggregation');
        if (response.ok) {
          const result = await response.json();
          if (isMounted) {
            setBoxnumber(result.data);
          }
        } else {
          toast.error('Failed to fetch data!');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data!');
      }
    };
    const fetchItemsFromAPI = async () => {
    
      try {
          const response = await fetch('http://localhost:2025/get_data_by_Sweetname' ,{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sweetname: "Badam_Katli" }),
          });

          if (response.ok) {
              const data = await response.json();

              
          } else {

          }
      } catch (error) {

      }
  };
    const fetchPackedBoxData = async () => {
      try {
        const response = await fetch('http://localhost:2025/get_packed_sweets_aggregation');
        if (response.ok) {
          const result = await response.json();
          if (isMounted) {
            setPackedboxnumber(result.data)
          }
        } else {
          toast.error('No  Unpacked Orders found!');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data!');
      }
    };

    fetchData();
    fetchBoxData();
    fetchPackedBoxData();
    // fetchItemsFromAPI()
    return () => {
      isMounted = false;
    };
  }, []);

  const calculateTotalWeights = (orders) => {
    const totals = {};

    orders.forEach(order => {
      Object.keys(order.sweets).forEach(sweetName => {
        const sweetData = order.sweets[sweetName];
        const totalWeight = sweetData.totalWeight || 0;

        if (!totals[sweetName]) {
          totals[sweetName] = { totalWeight: 0, packedWeight: 0, sweetData: sweetData };
        }

        totals[sweetName].totalWeight += totalWeight;

        if (order.is_packed === 1) {
          totals[sweetName].packedWeight += totalWeight;
        }
      });
    });

    setTotalWeights(totals);
  };

  const handleCardClick = (sweetName) => {
    setSelectedSweet(sweetName);
    const filteredSweets = boxnumber.filter(sweet => sweet.sweetName === sweetName);

    if (filteredSweets.length === 0) {
      console.log('No sweets found with that name.');
      return null;
    }

    const sweet = filteredSweets[0]; // Assuming you only want the first match

    // Create the new object with desired fields
    const weightObject = {
      '1000gm': sweet.totalOneKg,
      '500gm': sweet.totalHalfKg,
      '250gm': sweet.totalQuarterKg,
    };

    const addOtherObjectFields = (obj) => {
      Object.keys(obj).forEach(key => {
        if (!isNaN(key) && key !== 0) {
          if (weightObject[`${key}gm`]) {
            weightObject[`${key}gm`] += obj[key]; // If key exists, add to the existing value
          } else {
            weightObject[`${key}gm`] = obj[key]; // If key does not exist, set it
          }
        }
      });
    };

    addOtherObjectFields(sweet.totalOtherWeight);
    addOtherObjectFields(sweet.totalOtherWeight2);

    setWeightobject(weightObject);

    handlePackedBoxNumber(sweetName);
  };

  const handlePackedBoxNumber = (sweetName) => {
    if (packedboxnumber.length) {
      const filteredSweets = packedboxnumber.filter(sweet => sweet.sweetName === sweetName);
      
      if (filteredSweets.length === 0) {
        console.log('No sweets found with that name.');
        return null;
      }
      
      console.log("swertname", filteredSweets[0])
      const sweet = filteredSweets[0]; // Assuming you only want the first match

      const weightObject = {
        '1000gm': sweet.totalOneKg,
        '500gm': sweet.totalHalfKg,
        '250gm': sweet.totalQuarterKg,
      };

      const addOtherObjectFields = (obj) => {
        Object.keys(obj).forEach(key => {
          if (!isNaN(key) && key !== 0) {
            if (weightObject[`${key}gm`]) {
              weightObject[`${key}gm`] += obj[key]; // If key exists, add to the existing value
            } else {
              weightObject[`${key}gm`] = obj[key]; // If key does not exist, set it
            }
          }
        });
      };
      console.log("datatattat",sweet.totalOtherWeight)
if(sweet.totalOtherWeight){
      addOtherObjectFields(sweet.totalOtherWeight);
    }
    if(sweet.totalOtherWeight2){
      addOtherObjectFields(sweet.totalOtherWeight2);
    }
      setPackedWeightobject(weightObject);
    }
  };

  const handleBackClick = () => {
    setSelectedSweet(null); // Clear the selected sweet and go back to cards view
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard">
          <h1>Dashboard</h1>

          {!selectedSweet ? (
            <div className="card-container">
              {loading ? (
                <p>Loading...</p>
              ) : (
                Object.keys(totalWeights).map((sweetName, index) => {
                  const { totalWeight, packedWeight } = totalWeights[sweetName];
                  const percentage = totalWeight > 0 ? (packedWeight / totalWeight) * 100 : 0;

                  return (
                    <div className="card" key={index} onClick={() => handleCardClick(sweetName)} style={{ cursor: 'pointer' }}>
                      <h3>{sweetName.replace(/_/g, ' ')}</h3>
                      <div style={{ width: '120px', margin: '0 auto', marginTop: '15px' }}>
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage.toFixed(2)}%`}
                          styles={buildStyles({
                            textColor: '#333',
                            pathColor: '#28a745',
                            trailColor: '#eee',
                          })}
                        />
                      </div>
                      <p style={{ marginTop: '30px' }}><b>Total: {totalWeight.toFixed(2)} Kg</b></p>
                      <p><b>Packed: {packedWeight.toFixed(2)} Kg</b></p>
                      <p><b>Remaining: {(totalWeight - packedWeight).toFixed(2)} Kg</b></p>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <h2>{selectedSweet.replace(/_/g, ' ')} Boxes</h2>
              </div>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Packing</th>
                    <th>Total Boxes</th>
                    <th>Packed Boxes</th>
                    <th>Remaining Boxes</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("objects",Weightobjects)}
                  {console.log("objects2",PackedWeightobject)}
                  {Object.keys(Weightobjects)
                    .filter(packing => packing !== '0gm')
                    .map((packing, index) => {
                      const packedBoxes = PackedWeightobject[packing] || 0;
                      const remainingBoxes = Weightobjects[packing] - packedBoxes;

                      return (
                        <tr key={index}>
                          <td>{packing}</td>
                          <td>{Weightobjects[packing]}</td>
                          <td>{packedBoxes}</td>
                          <td>{remainingBoxes}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <button onClick={handleBackClick} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} style={{ cursor: 'pointer', color: 'white', marginRight: '5px' }} />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
