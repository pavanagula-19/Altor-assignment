// Piechart.js
import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const Piechart = ({ title, data }) => {
  const maxFontSize = 12; // Maximum font size for labels

  const calculateLabelFontSize = (percentage) => {
    const baseFontSize = 12; // Base font size for labels
    const calculatedSize = baseFontSize * (percentage / 100);

    return Math.min(calculatedSize, maxFontSize);
  };

  return (
    <div className="pie-chart-container">
      <h3>{title}</h3>
      <div className="legend-container">
        {data.map((entry, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
            <span className="legend-label">{entry.title}</span>
          </div>
        ))}
      </div>
      <PieChart
        data={data}
       
       
        
        radius={50}
        segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
        animate
      />
    </div>
  );
};

export default Piechart;
