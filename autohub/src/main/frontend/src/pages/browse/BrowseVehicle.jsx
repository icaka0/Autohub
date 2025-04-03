import React, { useState, useEffect } from 'react';
import './BrowseVehicle.scss';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthStatus, logoutUser, getAllVehicleAds } from '../../services/api';

const BrowseVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    fuelType: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    transmission: '',
    vehicleType: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('Current filters:', filters);
    
    // Format filters if needed (for enum compatibility)
    if (filters.fuelType) {
      // Make sure fuel type is in uppercase to match Java enum
      filters.fuelType = filters.fuelType.toUpperCase();
    }
    if (filters.transmission) {
      // Make sure transmission is in uppercase to match Java enum
      const transmissionValue = filters.transmission.toUpperCase();
      filters.transmissionType = transmissionValue;
    }
    if (filters.vehicleType) {
      // Make sure vehicle type is in uppercase to match Java enum
      filters.vehicleType = filters.vehicleType.toUpperCase();
    }
  }, [filters]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        // Get the ads from the API with any applied filters
        const params = {};
        if (filters.brand) params.brand = filters.brand;
        if (filters.model) params.model = filters.model;
        if (filters.yearFrom) params.yearFrom = filters.yearFrom;
        if (filters.yearTo) params.yearTo = filters.yearTo;
        if (filters.priceFrom) params.priceFrom = filters.priceFrom;
        if (filters.priceTo) params.priceTo = filters.priceTo;
        if (filters.fuelType) params.fuelType = filters.fuelType;
        if (filters.transmission) params.transmissionType = filters.transmission;
        if (filters.vehicleType) params.vehicleType = filters.vehicleType;
        
        console.log('Fetching with params:', params);
        const ads = await getAllVehicleAds(params);
        console.log('Fetched ads:', ads);
        setVehicles(ads || []);
      } catch (error) {
        console.error('Error fetching ads:', error);
        setError('Failed to load vehicle listings. Please try again later.');
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    
    fetchAds();
  }, [filters]);

  useEffect(() => {
    console.log("Vehicle data:", vehicles);
    if (vehicles.length > 0) {
      console.log("First vehicle image URLs:", vehicles[0].imageUrls);
    }
  }, [vehicles]);

  // Add Euro price formatting to BrowseVehicle.jsx
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="browse">
      <header className="browse-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : currentUser ? (
          <div className="nav-buttons">
            <Link to="/profile" className="btn profile-btn">Profile</Link>
            <button onClick={handleLogout} className="btn logout-btn">Logout</button>
          </div>
        ) : (
          <div className="nav-buttons">
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/register" className="btn register-btn">Register</Link>
          </div>
        )}
      </header>
      
      <main className="browse-main">
        <div className="container">
          <div className="filter-section">
            <h2>Find Your Perfect Vehicle</h2>
            <div className="filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="brand">Brand</label>
                  <select 
                    id="brand" 
                    name="brand" 
                    value={filters.brand}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Brands</option>
                    <option value="BMW">BMW</option>
                    <option value="Audi">Audi</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="model">Model</label>
                  <input 
                    type="text" 
                    id="model" 
                    name="model" 
                    placeholder="Any model"
                    value={filters.model}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="fuelType">Fuel Type</label>
                  <select 
                    id="fuelType" 
                    name="fuelType" 
                    value={filters.fuelType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="GASOLINE">Gasoline</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="yearFrom">Year From</label>
                  <select 
                    id="yearFrom" 
                    name="yearFrom" 
                    value={filters.yearFrom}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="yearTo">Year To</label>
                  <select 
                    id="yearTo" 
                    name="yearTo" 
                    value={filters.yearTo}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="transmission">Transmission</label>
                  <select 
                    id="transmission" 
                    name="transmission" 
                    value={filters.transmission}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                    <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="priceFrom">Price From</label>
                  <input 
                    type="number" 
                    id="priceFrom" 
                    name="priceFrom" 
                    placeholder="Min price"
                    value={filters.priceFrom}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="priceTo">Price To</label>
                  <input 
                    type="number" 
                    id="priceTo" 
                    name="priceTo" 
                    placeholder="Max price"
                    value={filters.priceTo}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="filter-action">
                  <button className="btn filter-btn">Apply Filters</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="results-section">
            <div className="results-header">
              <h3>{vehicles.length} Vehicles Found</h3>
              <div className="sort-controls">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" name="sort">
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="price_high">Price (High to Low)</option>
                  <option value="year_new">Year (Newest First)</option>
                  <option value="year_old">Year (Oldest First)</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="loading">Loading vehicles...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              vehicles.length > 0 ? (
                <div className="vehicle-grid">
                  {vehicles.map(vehicle => (
                    <div className="vehicle-card" key={vehicle.id}>
                      <div className="vehicle-image">
                        <img 
                          src={vehicle.imageUrls && vehicle.imageUrls.length > 0 
                            ? vehicle.imageUrls[0] 
                            : 'https://via.placeholder.com/300x200?text=No+Image'} 
                          alt={vehicle.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="vehicle-details">
                        <h2 className="vehicle-title text-truncate">{vehicle.title}</h2>
                        <p className="vehicle-subtitle">
                          {vehicle.vehicle.year} {vehicle.vehicle.brand} {vehicle.vehicle.model}
                        </p>
                        <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
                        <p className="vehicle-info">
                          <span><i className="fa fa-tachometer"></i> {vehicle.vehicle.mileage} km</span>
                          <span><i className="fa fa-gas-pump"></i> {vehicle.vehicle.fuelType ? vehicle.vehicle.fuelType.toLowerCase() : 'n/a'}</span>
                          <span><i className="fa fa-cog"></i> {vehicle.vehicle.transmissionType ? vehicle.vehicle.transmissionType.toLowerCase() : 'n/a'}</span>
                        </p>
                        <div className="vehicle-location">
                          <i className="fa fa-map-marker"></i> {vehicle.location}
                        </div>
                      </div>
                      <div className="vehicle-actions">
                        <Link to={`/vehicle/${vehicle.id}`} className="btn view-btn">View Details</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <h3>No vehicles found matching your criteria</h3>
                  <p>Try adjusting your filters or browse all vehicles</p>
                  <button onClick={() => setFilters({})} className="btn reset-btn">Reset Filters</button>
                </div>
              )
            )}
            
            <div className="pagination">
              <button className="btn page-btn active">1</button>
              <button className="btn page-btn">2</button>
              <button className="btn page-btn">3</button>
              <button className="btn page-btn">Next →</button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="browse-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BrowseVehicle;
