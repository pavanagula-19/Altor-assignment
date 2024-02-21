import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import your CSS file
import ReactPaginate from 'react-paginate';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    zone: '',
    deviceBrand: '',
    vehicleBrand: '',
    vehicleCC: '',
    sdkInt: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://20.121.141.248:5000/assignment/feb/sde_fe');
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          console.error('Data property is not an array:', responseData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const applyFilters = () => {
    return data.filter((item) => {
      return (
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.zone ? item.zone === filters.zone : true) &&
        (filters.deviceBrand ? item.device_brand === filters.deviceBrand : true) &&
        (filters.vehicleBrand ? item.vehicle_brand === filters.vehicleBrand : true) &&
        (filters.vehicleCC ? item.vehicle_cc === filters.vehicleCC : true) &&
        (filters.sdkInt ? item.sdk_int.toString() === filters.sdkInt : true)
      );
    });
  };

  const filteredItems = applyFilters();

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const renderDropdownOptions = (uniqueValues) => {
    return [
      <option key="select" value="">
        Select
      </option>,
      ...uniqueValues.map((value, index) => (
        <option key={index} value={value}>
          {value}
        </option>
      )),
    ];
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          value={filters.zone}
          onChange={(e) => handleFilterChange('zone', e.target.value)}
        >
          {renderDropdownOptions([...new Set(data.map((item) => item.zone))])}
        </select>
        <select
          value={filters.deviceBrand}
          onChange={(e) => handleFilterChange('deviceBrand', e.target.value)}
        >
          {renderDropdownOptions([...new Set(data.map((item) => item.device_brand))])}
        </select>
        <select
          value={filters.vehicleBrand}
          onChange={(e) => handleFilterChange('vehicleBrand', e.target.value)}
        >
          {renderDropdownOptions([...new Set(data.map((item) => item.vehicle_brand))])}
        </select>
        <select
          value={filters.vehicleCC}
          onChange={(e) => handleFilterChange('vehicleCC', e.target.value)}
        >
          {renderDropdownOptions([...new Set(data.map((item) => item.vehicle_cc))])}
        </select>
        <select
          value={filters.sdkInt}
          onChange={(e) => handleFilterChange('sdkInt', e.target.value)}
        >
          {renderDropdownOptions([...new Set(data.map((item) => item.sdk_int))])}
        </select>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Zone</th>
            <th>Device Brand</th>
            <th>SDK Int</th>
            <th>Vehicle Brand</th>
            <th>Vehicle CC</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.zone}</td>
                <td>{item.device_brand}</td>
                <td>{item.sdk_int}</td>
                <td>{item.vehicle_brand}</td>
                <td>{item.vehicle_cc}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination">
        <ReactPaginate
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </div>
  );
};

export default Dashboard;
