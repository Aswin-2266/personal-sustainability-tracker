import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from './AuthContext'; 

import "./styles/ProgressPage.css"; 

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProgressPage = () => {
  const { token, loading: authLoading } = useAuth(); 
  const [data, setData] = useState([]); 
  const [timePeriod, setTimePeriod] = useState('monthly'); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const goToDashboard = () => {
    window.location.href = '/dashboard'; 
  };

  const chartColors = {
    commute: '#673AB7', 
    food: '#00ACC1', 
    electricity: '#FFCA28', 
    water: '#9575CD', 
    plastic: '#EF5350', 
  };

  const fetchProgress = useCallback(async (period) => {
    if (authLoading) {
      return;
    }
    if (!token) {
      setError('Authentication required to fetch progress data.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/user-progress/${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedData = response.data.map(entry => {
        const dateObject = new Date(entry.created_at); 
        let formattedDate;
        if (isNaN(dateObject.getTime())) {
          formattedDate = 'Invalid Date'; 
          console.warn('Invalid date detected for entry (ProgressPage frontend fallback):', entry.created_at); 
        } else {
          formattedDate = dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return {
          ...entry, 
          date: formattedDate,
        };
      });
      
      setData(formattedData);
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
      if (err.response) {
        setError(err.response.data.error || 'Failed to load progress data.');
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
    fetchProgress(timePeriod);
  }, [timePeriod, fetchProgress]);

  const formatXAxisTick = useCallback((tick) => {
    return tick;
  }, []);

  return (
    <div className="progress-page-container">
      <div className="progress-header">
        <h2>Your Sustainability Progress</h2>
        <div className="header-actions">
          <button onClick={goToDashboard} className="home-button">
            Home
          </button>

          <div className="time-period-selector">
            <label htmlFor="time-period-select" className="sr-only">Select Time Period</label>
            <select
              id="time-period-select"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="time-period-dropdown"
            >
              <option value="today">Today</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="chart-area">
        {loading ? (
          <p className="loading-message">Loading progress data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : data.length === 0 ? (
          <p className="no-data-message">No sustainability data available for this period. Log activities to see your progress!</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 20, right: 30, left: 80, bottom: 5, 
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
                label={{ value: 'Value (km/kg/kWh/L/items)', angle: -90, position: 'insideLeft', fill: 'var(--text-medium)' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-light)`, borderRadius: 'var(--border-radius-sm)' }}
                labelStyle={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--text-dark)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Line type="monotone" dataKey="commute_distance" stroke={chartColors.commute} name="Commute (km)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="food_weight" stroke={chartColors.food} name="Food (kg)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="electricity_used" stroke={chartColors.electricity} name="Electricity (kWh)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="water_consumption" stroke={chartColors.water} name="Water (L)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="plastic_items_used" stroke={chartColors.plastic} name="Plastic Items" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
