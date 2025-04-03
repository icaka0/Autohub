import React, { useState } from 'react';
import { getPriceHistory } from '../../services/api';
import './PriceHistoryTooltip.scss';

const PriceHistoryTooltip = ({ adId, price }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Fetch price history when the icon is clicked
  const handleClick = async (e) => {
    e.stopPropagation();
    
    // Toggle the display
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    
    setShowHistory(true);
    
    // Only fetch if we haven't already
    if (priceHistory.length === 0 && !loading) {
      try {
        setLoading(true);
        const data = await getPriceHistory(adId);
        setPriceHistory(data);
      } catch (err) {
        console.error('Error fetching price history:', err);
        setError('Failed to load price history');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="price-history-container">
      <div className="price-display">
        <span className="price-value">{formatPrice(price)}</span>
        <button 
          className="history-button" 
          onClick={handleClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Price History
        </button>
      </div>
      
      {showHistory && (
        <div className="price-history-modal">
          <div className="price-history-content">
            <div className="price-history-header">
              <h4>Price History</h4>
              <button className="close-btn" onClick={() => setShowHistory(false)}>×</button>
            </div>
            
            {loading && <div className="loading">Loading history...</div>}
            
            {error && <div className="error">{error}</div>}
            
            {!loading && !error && priceHistory.length === 0 && (
              <div className="no-history">No price changes recorded</div>
            )}
            
            {!loading && !error && priceHistory.length > 0 && (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Old Price</th>
                    <th>New Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry) => {
                    const priceDiff = entry.newPrice - entry.oldPrice;
                    const percentChange = ((priceDiff / entry.oldPrice) * 100).toFixed(1);
                    
                    return (
                      <tr key={entry.id} className="history-row">
                        <td>{formatDate(entry.changedAt)}</td>
                        <td className="old-price">{formatPrice(entry.oldPrice)}</td>
                        <td className="new-price">{formatPrice(entry.newPrice)}</td>
                        <td className={priceDiff >= 0 ? "price-increase" : "price-decrease"}>
                          {priceDiff > 0 ? "+" : ""}{formatPrice(priceDiff)} ({percentChange}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryTooltip;