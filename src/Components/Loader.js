// src/components/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ loading }) => {
    return (
        <div style={{  alignItems: 'center', height: '100vh' }}>
            <ClipLoader color="#3498db" loading={loading} size={100} />
        </div>
    );
};

export default Loader;
