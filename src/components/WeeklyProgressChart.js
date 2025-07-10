import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Define API Base URL

function WeeklyProgressChart() {
  const { token, loading: authLoading } = useAuth(); 
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const chartColors = {
    commute: '#673AB7',     
    food: '#00ACC1',        
    electricity: '#FFCA28', 
    water: '#9575CD',       
    plastic: '#EF5350',     
  };

  const fetchProgress = useCallback(async () => {
    if (authLoading) {
      return;
    }
    if (!token) {
      setError('Authentication required to view weekly progress.');
      setLoading(false);
      return;
    }

    setLoading(true); 
    setError(null); 
    setData([]); 

    try {
      const response = await axios.get(`${API_BASE_URL}/api/user-progress/weekly`, { // Updated API call
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedData = response.data.map(entry => {
        const dateObject = new Date(entry.created_at); 

        let formattedDate;
        if (isNaN(dateObject.getTime())) {
          formattedDate = 'Invalid Date'; 
          console.warn('Invalid date detected for entry (WeeklyProgressChart frontend fallback):', entry.created_at); 
        } else {
          formattedDate = dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return {
          ...entry, 
          date: formattedDate,
        };
      });
      
      setData(processedData); 
    } catch (err) {
      console.error('Failed to fetch user weekly progress:', err);
      if (err.response) {
        setError(err.response.data.error || 'Failed to load weekly progress data.');
      } else if (err.request) {
        setError('Network error: No response from server.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); 
    }
  }, [token, authLoading]); 

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const formatXAxisTick = useCallback((tick) => {
    return tick; 
  }, []);

  return (
    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-light)', border: '1px solid var(--border-light)' }}>
      {loading ? (
        <p className="loading-message">Loading weekly progress...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : data.length === 0 ? (
        <p className="no-data-message">No weekly sustainability data available. Log activities to see your progress!</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5, right: 30, left: 80, bottom: 5, 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisTick} 
              stroke="var(--text-medium)" 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-medium)" 
              tickLine={false} 
              axisLine={false}
              label={{ value: 'Value (km/kg/kWh/L/items)', angle: -90, position: 'insideLeft', fill: 'var(--text-medium)', offset: -20 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-light)`, borderRadius: 'var(--border-radius-sm)' }}
              labelStyle={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}
              itemStyle={{ color: 'var(--text-dark)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <Line type="monotone" dataKey="commute_distance" stroke={chartColors.commute} name="Commute (km)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="food_weight" stroke={chartColors.food} name="Food (kg)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="electricity_used" stroke={chartColors.electricity} name="Electricity (kWh)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="water_consumption" stroke={chartColors.water} name="Water (L)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="plastic_items_used" stroke={chartColors.plastic} name="Plastic Items" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WeeklyProgressChart;
