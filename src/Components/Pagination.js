// Pagination.js
import React, { useState, useEffect } from 'react';
import './Pagination.css'; // Add CSS as per your styling requirements

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const [page, setPage] = useState(currentPage);
  const [visiblePages, setVisiblePages] = useState([]);

  // Update visible page numbers when page or totalPages changes
  useEffect(() => {
    const pages = calculateVisiblePages(page, totalPages);
    setVisiblePages(pages);
  }, [page, totalPages]);

  // Calculate visible pages dynamically (similar to ngFor in Angular)
  const calculateVisiblePages = (currentPage, total) => {
    const visiblePageCount = 25; // Adjust for more/less page numbers displayed
    const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
    const endPage = Math.min(total, startPage + visiblePageCount - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Handler functions for pagination actions
  const goToPage = (pageNumber) => {
    setPage(pageNumber);
    onPageChange(pageNumber); // Callback to parent to update page
  };

  const previousPage = () => {
    if (page > 1) 
        goToPage(page - 1);
  };

  const nextPage = () => {
    if (page < totalPages) goToPage(page + 1);
  };

  return (
    <div className="custom-pagination-controls">
    <button 
      onClick={previousPage} 
      disabled={page === 1} 
      className={`custom-pagination-btn ${page === 1 ? 'custom-pagination-btn-disabled' : ''}`}
    >
      Previous
    </button>
  
    {/* <button 
      onClick={() => goToPage(1)} 
      disabled={page === 1} 
      className={`custom-pagination-btn ${page === 1 ? 'custom-pagination-btn-disabled' : ''}`}
    >
      First
    </button> */}
    
    {visiblePages.map((p) => (
      <button
        key={p}
        onClick={() => goToPage(p)}
        className={`custom-pagination-btn ${page === p ? 'custom-pagination-btn-active' : ''}`}
      >
        {p}
      </button>
    ))}
  
    {/* <button 
      onClick={() => goToPage(totalPages)} 
      disabled={page === totalPages} 
      className={`custom-pagination-btn ${page === totalPages ? 'custom-pagination-btn-disabled' : ''}`}
    >
      Last
    </button> */}
  
    <button 
      onClick={nextPage} 
      disabled={page === totalPages} 
      className={`custom-pagination-btn ${page === totalPages ? 'custom-pagination-btn-disabled' : ''}`}
    >
      Next
    </button>
  </div>
  

  );
};

export default Pagination;
