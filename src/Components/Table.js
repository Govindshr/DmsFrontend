import React from 'react';
import './Table.css'; // Import the CSS file

const Table = ({ data }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Number</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td><b>{row.name}</b></td>
            <td><b>{row.price}</b></td>
            <td><b>{row.number}</b></td>
            <td>
              <button onClick={() => alert(`Action for ${row.name}`)}>Action</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
