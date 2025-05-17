import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ProgressPage = () => {
  const [data, setData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('monthly'); // default to 'today'

  // Fetch progress data based on the selected time period
  const fetchProgress = async (period) => {
    try {
      const token = localStorage.getItem('token'); // assuming token is stored here
      const response = await axios.get(`http://localhost:5000/api/user-progress/${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
    }
  };

  useEffect(() => {
    fetchProgress(timePeriod); // fetch data when component mounts or timePeriod changes
  }, [timePeriod]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Sustainability Progress</h2>

      {/* Dropdown to select time period */}
      <div style={{ position: 'absolute', top: '1rem', right: '2rem' }}>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          <option value="today">Today</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* LineChart displaying the progress data */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="commute_distance" stroke="#8884d8" name="Commute (km)" />
          <Line type="monotone" dataKey="food_weight" stroke="#82ca9d" name="Food (kg)" />
          <Line type="monotone" dataKey="electricity_used" stroke="#ffc658" name="Electricity (kWh)" />
          <Line type="monotone" dataKey="water_consumption" stroke="#00c49f" name="Water (L)" />
          <Line type="monotone" dataKey="plastic_items_used" stroke="#ff8042" name="Plastic Items" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressPage;
