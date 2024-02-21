import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Piechart from './Piechart';
import Barchart from './Barchart';
import StackedBar from './Stackedbar'; 
import axios from 'axios';
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
        const response = await axios.get('http://localhost:8080/fetch-and-store-data');
        const responseData = response.data;

        if (responseData && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          console.error('Data property is not an array:', responseData && responseData.data);
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

  const calculateVehicleBrandDistribution = () => {
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

  const calculateVehicleCCDistributionByZone = () => {
    const distribution = [];
    const groupedByZoneAndCC = filteredItems.reduce((acc, item) => {
      const key = `${item.zone}_${item.vehicle_cc}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    for (const key in groupedByZoneAndCC) {
      const [zone, vehicleCC] = key.split('_');
      distribution.push({ zone, vehicleCC, count: groupedByZoneAndCC[key] });
    }
    return distribution;
  };

  const calculateSDKIntDistributionByZone = () => {
    const distribution = [];
    const groupedByZoneAndSDKInt = filteredItems.reduce((acc, item) => {
      const key = `${item.zone}_${item.sdk_int}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    for (const key in groupedByZoneAndSDKInt) {
      const [zone, sdkInt] = key.split('_');
      distribution.push({ zone, sdkInt, count: groupedByZoneAndSDKInt[key] });
    }
    return distribution;
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
        <div className="pie-chart-container">
          <Piechart title="Device Brand Distribution" data={calculateDistribution('device_brand')} />
        </div>
        <div className="pie-chart-container">
          <Piechart title="Vehicle Brand Distribution" data={calculateDistribution('vehicle_brand')} />
        </div>
        <div className="pie-chart-container">
          <Piechart title="Vehicle CC Distribution" data={calculateDistribution('vehicle_cc')} />
        </div>
      </div>
      <div className="charts-container">
        <div className="barchart-container">
          <Barchart
            title="Vehicle Brand Distribution by Zone"
            data={calculateVehicleBrandDistribution()}
            xKey="vehicleBrand"
            yKey="count"
          />
        </div>
        <div className="barchart-container">
          <Barchart
            title="SDK Int Distribution by Zone"
            data={calculateSDKIntDistribution()}
            xKey="sdkInt"
            yKey="count"
          />
        </div>
      </div>
      <div className="charts-container">
        <div className="stackedbar-container">
          <StackedBar
            title="Vehicle CC Distribution by Zone"
            data={calculateVehicleCCDistributionByZone()}
            xKey="zone"
            bars={[
              { dataKey: '0', color: '#8884d8' },
              { dataKey: '1', color: '#82ca9d' },
            ]}
          />
        </div>
        <div className="stackedbar-container">
          <StackedBar
            title="SDK Int Distribution by Zone"
            data={calculateSDKIntDistributionByZone()}
            xKey="zone"
            bars={[
              { dataKey: '22', color: '#8884d8' },
              { dataKey: '23', color: '#82ca9d' },
            ]}
          />
        </div>
        </div>
    </div>
  );
};

export default Dashboard;