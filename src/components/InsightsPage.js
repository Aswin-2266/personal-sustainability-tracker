import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

import './styles/InsightsPage.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Define API Base URL

const InsightsPage = () => {
  const { token, loading: authLoading } = useAuth(); 
  const [sustainabilityData, setSustainabilityData] = useState(null); 
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [loadingData, setLoadingData] = useState(true); 
  const [dataError, setDataError] = useState(null); 

  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Reduce commute by 10 miles this week', completed: false },
    { id: 2, name: 'Switch to a plant-based meal for a week', completed: false },
    { id: 3, name: 'Reduce plastic usage by 5 items this week', completed: false },
    { id: 4, name: 'Use energy-efficient appliances for a week', completed: false },
  ]);

  const calculateCarbonFootprint = useCallback((data) => {
    if (!data) return null; 
    const {
      commute_distance,
      food_weight,
      electricity_used,
      water_consumption,
      plastic_items_used,
    } = data;

    const commuteCarbon = (commute_distance || 0) * 0.192;
    const foodCarbon = (food_weight || 0) * 27;
    const electricityCarbon = (electricity_used || 0) * 0.4;
    const waterCarbon = (water_consumption || 0) * 0.00035;
    const plasticCarbon = (plastic_items_used || 0) * 0.3;

    return commuteCarbon + foodCarbon + electricityCarbon + waterCarbon + plasticCarbon;
  }, []); 

  const getRecommendations = useCallback((data) => {
    const recommendations = [];
    if (!data) return recommendations; 

    if (data.commute_distance > 10) {
      recommendations.push('Consider using public transport or biking to reduce carbon emissions.');
    }

    if (data.food_weight > 5) { 
      recommendations.push('Switching to a more plant-based diet could significantly reduce your carbon footprint.');
    }

    if (data.electricity_used > 100) { 
      recommendations.push('Consider using energy-efficient appliances and switching to renewable energy sources.');
    }

    if (data.water_consumption > 150) { 
      recommendations.push('Reducing water wastage by fixing leaks or using water-saving devices can help lower your carbon footprint.');
    }

    if (data.plastic_items_used > 5) {
      recommendations.push('Try to reduce plastic usage by opting for reusable bags and bottles.');
    }

    return recommendations;
  }, []); 

  useEffect(() => {
    const fetchSustainabilityData = async () => {
      if (authLoading) {
        return;
      }
      if (!token) {
        setDataError('Authentication required to fetch data.');
        setLoadingData(false);
        return;
      }

      setLoadingData(true); 
      setDataError(null); 

      try {
        const response = await axios.get(`${API_BASE_URL}/api/sustainability`, { // Updated API call
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          setSustainabilityData(response.data[0]); 
        } else {
          setSustainabilityData(null); 
          setDataError('No sustainability data recorded yet. Log your activities to get insights!');
        }
      } catch (error) {
        console.error('Failed to fetch sustainability data:', error);
        if (error.response) {
          setDataError(error.response.data.error || 'Failed to fetch sustainability data.');
        } else if (error.request) {
          setDataError('Network error: No response from server.');
        } else {
          setDataError('An unexpected error occurred.');
        }
        setSustainabilityData(null); 
      } finally {
        setLoadingData(false); 
      }
    };

    fetchSustainabilityData();
  }, [token, authLoading]); 

  useEffect(() => {
    if (sustainabilityData) {
      const totalCarbon = calculateCarbonFootprint(sustainabilityData);
      setCarbonFootprint(totalCarbon);
    } else {
      setCarbonFootprint(null); 
    }
  }, [sustainabilityData, calculateCarbonFootprint]); 

  const getFootprintLevelClass = (footprint) => {
    if (footprint === null) return ''; 
    if (footprint < 20) return 'low-footprint';
    if (footprint < 50) return 'medium-footprint';
    return 'high-footprint';
  };

  const handleChallengeCompletion = (challengeId) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
  };

  const recommendations = getRecommendations(sustainabilityData);

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>Your Carbon Footprint Insights</h2>
      </div>

      {loadingData ? (
        <p className="loading-message">Loading your sustainability data...</p>
      ) : dataError ? (
        <p className="error-message">{dataError}</p>
      ) : (
        <>
          <div className="footprint-display">
            <h3>Your Total Carbon Footprint (Latest Entry)</h3>
            {carbonFootprint !== null ? (
              <div className={`footprint-value ${getFootprintLevelClass(carbonFootprint)}`}>
                {carbonFootprint.toFixed(2)} kg CO₂
              </div>
            ) : (
              <p className="no-data-message">No carbon footprint data to display. Please log some activities!</p>
            )}
          </div>

          <div className="recommendations-container">
            <h4>Recommendations for Reducing Your Carbon Footprint</h4>
            <ul className="recommendations-list">
              {recommendations.length > 0 ? (
                recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))
              ) : (
                <p className="no-recommendations">Based on your current data, no specific recommendations are highlighted. Keep up the great work!</p>
              )}
            </ul>
          </div>
        </>
      )}

      <div className="challenges-container">
        <h4>Weekly Challenges</h4>
        <ul className="challenges-list">
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className={`challenge-item ${challenge.completed ? 'challenge-completed' : 'challenge-pending'}`}
            >
              <input 
                type="checkbox"
                checked={challenge.completed}
                onChange={() => handleChallengeCompletion(challenge.id)}
              />
              <span className="challenge-name">{challenge.name}</span>
              {challenge.completed && <span className="completion-status"> (Completed)</span>}
            </li>
          ))}
          {challenges.length === 0 && <p className="no-challenges">No challenges available right now.</p>}
        </ul>
      </div>
    </div>
  );
};

export default InsightsPage;
