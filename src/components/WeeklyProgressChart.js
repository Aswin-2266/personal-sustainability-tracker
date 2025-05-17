import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

function WeeklyProgressChart() {
  const [data, setData] = useState([]);

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
    fetchProgress('weekly'); // fetch data when component mounts or timePeriod changes
  }, []);


  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
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
}

export default WeeklyProgressChart;
