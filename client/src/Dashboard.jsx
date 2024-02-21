// Dashboard.js
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Piechart from './Piechart';
import Barchart from './Barchart';
import './Dashboard.css';

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
  const calculateVehicleBrandDistribution = () => {
    // Calculate the distribution of the total number of vehicles over different vehicle brands
    const distribution = [];
    const groupedByBrand = filteredItems.reduce((acc, item) => {
      acc[item.vehicle_brand] = (acc[item.vehicle_brand] || 0) + 1;
      return acc;
    }, {});
    for (const brand in groupedByBrand) {
      distribution.push({ vehicleBrand: brand, count: groupedByBrand[brand] });
    }
    return distribution;
  };
  const calculateSDKIntDistribution = () => {
    // Calculate the distribution of the total number of devices over different SDK int values
    const distribution = [];
    const groupedBySDKInt = filteredItems.reduce((acc, item) => {
      acc[item.sdk_int] = (acc[item.sdk_int] || 0) + 1;
      return acc;
    }, {});
    for (const sdkInt in groupedBySDKInt) {
      distribution.push({ sdkInt, count: groupedBySDKInt[sdkInt] });
    }
    return distribution;
  };
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

  const calculateDistribution = (field) => {
    const fieldData = data.map((item) => item[field]);
    const uniqueValues = [...new Set(fieldData)];

    const distribution = uniqueValues.map((value) => {
      const count = fieldData.filter((item) => item === value).length;
      return { title: value, value: count, color: getRandomColor() };
    });

    return distribution;
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
      <div className="charts-container">
        <Piechart title="Device Brand Distribution" data={calculateDistribution('device_brand')} />
        <Piechart title="Vehicle Brand Distribution" data={calculateDistribution('vehicle_brand')} />
        <Piechart title="Vehicle CC Distribution" data={calculateDistribution('vehicle_cc')} />
      </div>
      <div>
      <Barchart
          title="Vehicle Brand Distribution by Zone"
          data={calculateVehicleBrandDistribution()}
          xKey="vehicleBrand"
          yKey="count"
        />

        <Barchart
          title="SDK Int Distribution by Zone"
          data={calculateSDKIntDistribution()}
          xKey="sdkInt"
          yKey="count"
        />
      </div>
    </div>
    
  );
};

export default Dashboard;
