import React, { useState, useEffect } from 'react';
import './BrowseVehicle.scss';
import { Link } from 'react-router-dom';

const BrowseVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    fuelType: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    transmission: ''
  });

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockVehicles = [
        {
          id: '1',
          title: '2019 BMW 3 Series - Low Mileage',
          vehicle: {
            brand: 'BMW',
            model: '3 Series',
            year: 2019,
            fuelType: 'GASOLINE',
            transmission: 'AUTOMATIC',
            vehicleType: 'SEDAN',
            mileage: 35000,
            horsePower: 258,
            color: 'Alpine White'
          },
          price: 32500,
          imageUrls: ['/images/cars-background.jpg'],
          location: 'Sofia, Bulgaria',
          createdAt: '2023-01-15'
        },
        {
          id: '2',
          title: '2020 Audi A4 - Premium Plus',
          vehicle: {
            brand: 'Audi',
            model: 'A4',
            year: 2020,
            fuelType: 'DIESEL',
            transmission: 'AUTOMATIC',
            vehicleType: 'SEDAN',
            mileage: 28000,
            horsePower: 201,
            color: 'Brilliant Black'
          },
          price: 35900,
          imageUrls: ['/images/cars-background.jpg'],
          location: 'Plovdiv, Bulgaria',
          createdAt: '2023-02-10'
        },
        {
          id: '3',
          title: '2018 Mercedes-Benz C-Class - AMG Line',
          vehicle: {
            brand: 'Mercedes-Benz',
            model: 'C-Class',
            year: 2018,
            fuelType: 'GASOLINE',
            transmission: 'AUTOMATIC',
            vehicleType: 'SEDAN',
            mileage: 45000,
            horsePower: 241,
            color: 'Selenite Grey'
          },
          price: 29800,
          imageUrls: ['/images/cars-background.jpg'],
          location: 'Varna, Bulgaria',
          createdAt: '2023-03-05'
        },
        {
          id: '4',
          title: '2021 Volkswagen Golf - TSI',
          vehicle: {
            brand: 'Volkswagen',
            model: 'Golf',
            year: 2021,
            fuelType: 'GASOLINE',
            transmission: 'MANUAL',
            vehicleType: 'HATCHBACK',
            mileage: 15000,
            horsePower: 147,
            color: 'Atlantic Blue'
          },
          price: 24500,
          imageUrls: ['/images/cars-background.jpg'],
          location: 'Burgas, Bulgaria',
          createdAt: '2023-04-20'
        }
      ];
      
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="browse">
      <header className="browse-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </div>
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
              <div className="vehicle-grid">
                {vehicles.map(vehicle => (
                  <div className="vehicle-card" key={vehicle.id}>
                    <div className="vehicle-image">
                      <img src={vehicle.imageUrls[0]} alt={vehicle.title} />
                    </div>
                    <div className="vehicle-info">
                      <h3 className="vehicle-title">{vehicle.title}</h3>
                      <div className="vehicle-meta">
                        <div className="year-brand-model">
                          <span className="year">{vehicle.vehicle.year}</span>
                          <span className="brand-model">{vehicle.vehicle.brand} {vehicle.vehicle.model}</span>
                        </div>
                        <div className="price">${vehicle.price.toLocaleString()}</div>
                      </div>
                      <div className="vehicle-details">
                        <div className="detail">
                          <span className="detail-label">Fuel Type:</span>
                          <span className="detail-value">{vehicle.vehicle.fuelType.charAt(0) + vehicle.vehicle.fuelType.slice(1).toLowerCase()}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Transmission:</span>
                          <span className="detail-value">{vehicle.vehicle.transmission.charAt(0) + vehicle.vehicle.transmission.slice(1).toLowerCase()}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Mileage:</span>
                          <span className="detail-value">{vehicle.vehicle.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Horse Power:</span>
                          <span className="detail-value">{vehicle.vehicle.horsePower} hp</span>
                        </div>
                      </div>
                      <div className="vehicle-footer">
                        <div className="location">{vehicle.location}</div>
                        <Link to={`/vehicles/${vehicle.id}`} className="btn details-btn">View Details</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
