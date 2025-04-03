import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVehicleAd, getPriceHistory } from '../../services/api';
import PriceHistoryTooltip from '../../components/PriceHistoryTooltip/PriceHistoryTooltip';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicleAd, setVehicleAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    const fetchVehicleAd = async () => {
      try {
        const data = await getVehicleAd(id);
        setVehicleAd(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicle ad:', error);
        setError('Failed to load vehicle ad');
        setLoading(false);
      }
    };

    fetchVehicleAd();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePriceHistoryClick = async () => {
    console.log('Price history button clicked');
    setShowPriceHistory(true);
    console.log('showPriceHistory set to true:', showPriceHistory); // This won't show true immediately due to state update timing
    
    if (priceHistory.length === 0 && !historyLoading) {
      try {
        console.log('Fetching price history for ad ID:', id);
        setHistoryLoading(true);
        const data = await getPriceHistory(id);
        console.log('Price history data received:', data);
        setPriceHistory(data);
      } catch (err) {
        console.error('Error fetching price history:', err);
        setHistoryError('Failed to load price history');
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="vehicle-detail">
      <h2>{vehicleAd.title}</h2>
      <div className="vehicle-info">
        <div className="price">
          <span>Price</span>
          <div className="price-with-history">
            <span className="price-value">€{vehicleAd.price}</span>
            <button 
              onClick={handlePriceHistoryClick}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 15px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '15px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
            >
              PRICE HISTORY
            </button>
          </div>
        </div>
      </div>
      {showPriceHistory && (
        <div className="price-history-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="price-history-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #eee',
              backgroundColor: '#333',
              color: 'white'
            }}>
              <h4 style={{margin: 0, fontSize: '1.25rem'}}>История на цената</h4>
              <button onClick={() => setShowPriceHistory(false)} style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'white'
              }}>×</button>
            </div>
            
            {historyLoading && <div style={{padding: '20px', textAlign: 'center'}}>Loading history...</div>}
            {historyError && <div style={{padding: '20px', textAlign: 'center', color: '#e74c3c'}}>{historyError}</div>}
            
            {!historyLoading && !historyError && priceHistory.length === 0 && (
              <div style={{
                padding: '30px 20px', 
                textAlign: 'center',
                color: '#666'
              }}>
                <i className="fas fa-info-circle" style={{fontSize: '24px', marginBottom: '10px', color: '#007bff'}}></i>
                <p>Няма записани промени в цената на този автомобил.</p>
                <p style={{fontSize: '0.9rem', marginTop: '10px'}}>Променените цени ще се появят тук.</p>
              </div>
            )}
            
            {!historyLoading && !historyError && priceHistory.length > 0 && (
              <table style={{
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: '#fff'
              }}>
                <thead>
                  <tr style={{backgroundColor: '#f0f0f0'}}>
                    <th style={{padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Дата и час</th>
                    <th style={{padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Промяна</th>
                    <th style={{padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry) => {
                    const priceDiff = entry.newPrice - entry.oldPrice;
                    
                    return (
                      <tr key={entry.id} style={{borderBottom: '1px solid #eee'}}>
                        <td style={{padding: '12px 16px', textAlign: 'left'}}>
                          {new Date(entry.changedAt).toLocaleString('bg-BG')}
                        </td>
                        <td style={{
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          color: priceDiff < 0 ? '#2ecc71' : priceDiff > 0 ? '#e74c3c' : '#333',
                          fontWeight: 'bold'
                        }}>
                          {priceDiff < 0 ? '- ' + Math.abs(priceDiff) : priceDiff > 0 ? '+ ' + priceDiff : '0'} лв.
                        </td>
                        <td style={{padding: '12px 16px', textAlign: 'left', fontWeight: 'bold'}}>
                          {entry.newPrice} лв.
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
      {/* Rest of the component */}
    </div>
  );
};

export default VehicleDetail;