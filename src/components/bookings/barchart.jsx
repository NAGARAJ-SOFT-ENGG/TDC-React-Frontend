import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Barplot = ({ data }) => {
  // Extract labels and values from the data prop
  // data is expected to be an array of objects like [{ name: 'Requested', value: 21 }, ...]
  const labels = data.map(item => item.name);
  const values = data.map(item => item.value);

  const chartData = {
    labels: labels, // Use dynamic labels
    datasets: [
      {
        label: 'Bookings',
        data: values, // Use dynamic values
        backgroundColor: ['#f5d000', '#005AC7','#288654', '#5dbccd', '#AA4A44'],
        borderRadius: 2,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 50 },
         grid: { display: false },
      },
      y:{
         grid: { display: false },
      }
    },
  };

  return (

      <Bar data={chartData} options={options} width={400} height={130} />
  );
};
