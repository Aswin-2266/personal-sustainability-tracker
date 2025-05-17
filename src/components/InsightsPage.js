import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InsightsPage.css';

const InsightsPage = () => {
  const [data, setData] = useState({});
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Reduce commute by 10 miles this week', completed: false },
    { id: 2, name: 'Switch to a plant-based meal for a week', completed: false },
    { id: 3, name: 'Reduce plastic usage by 5 items this week', completed: false },
    { id: 4, name: 'Use energy-efficient appliances for a week', completed: false },
  ]);

  useEffect(() => {
    const fetchSustainabilityData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/sustainability', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data[0]); // Assume the latest data is the first entry
      } catch (error) {
        console.error('Failed to fetch sustainability data:', error);
      }
    };

    fetchSustainabilityData();
  }, []);

  const calculateCarbonFootprint = (data) => {
    const {
      commute_distance,
      food_weight,
      electricity_used,
      water_consumption,
      plastic_items_used,
    } = data;

    const commuteCarbon = commute_distance * 0.192;
    const foodCarbon = food_weight * 27;
    const electricityCarbon = electricity_used * 0.4;
    const waterCarbon = water_consumption * 0.00035;
    const plasticCarbon = plastic_items_used * 0.3;

    return commuteCarbon + foodCarbon + electricityCarbon + waterCarbon + plasticCarbon;
  };

  const getRecommendations = (data) => {
    const recommendations = [];

    if (data?.commute_distance > 10) {
      recommendations.push('Consider using public transport or biking to reduce carbon emissions.');
    }

    if (data?.food_weight > 5) {
      recommendations.push('Switching to a more plant-based diet could significantly reduce your carbon footprint.');
    }

    if (data?.electricity_used > 100) {
      recommendations.push('Consider using energy-efficient appliances and switching to renewable energy sources.');
    }

    if (data?.water_consumption > 150) {
      recommendations.push('Reducing water wastage by fixing leaks or using water-saving devices can help lower your carbon footprint.');
    }

    if (data?.plastic_items_used > 5) {
      recommendations.push('Try to reduce plastic usage by opting for reusable bags and bottles.');
    }

    return recommendations;
  };

  useEffect(() => {
    if (data) {
      const totalCarbon = calculateCarbonFootprint(data);
      setCarbonFootprint(totalCarbon);
    }
  }, [data]);

  const recommendations = getRecommendations(data);

  const getFootprintLevelClass = (footprint) => {
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

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>Your Carbon Footprint Insights</h2>
      </div>

      <div className="footprint-display">
        <h3>Your Total Carbon Footprint</h3>
        {carbonFootprint ? (
          <div className={`footprint-value ${getFootprintLevelClass(carbonFootprint)}`}>
            {carbonFootprint.toFixed(2)} kg CO₂
          </div>
        ) : (
          <p>Loading...</p>
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
            <p className="no-recommendations">No recommendations available at the moment.</p>
          )}
        </ul>
      </div>

      <div className="challenges-container">
        <h4>Weekly Challenges</h4>
        <ul className="challenges-list">
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className={challenge.completed ? 'challenge-completed' : 'challenge-pending'}
              onClick={() => handleChallengeCompletion(challenge.id)}
            >
              {challenge.name} {challenge.completed && <span>(Completed)</span>}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default InsightsPage;
