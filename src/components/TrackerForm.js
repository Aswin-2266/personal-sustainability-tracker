import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './TrackerForm.css';

function TrackerForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    commuteType: '',
    commuteDistance: '',
    dietType: '',
    foodWeight: '',
    electricityUsed: '',
    waterConsumption: '',
    plasticItems: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const commuteOptions = [
    { value: 'walking', label: 'Walking' },
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'public_transport', label: 'Public Transport' },
    { value: 'car', label: 'Car (Gasoline)' },
    { value: 'electric_car', label: 'Electric Car' },
    { value: 'motorcycle', label: 'Motorcycle' }
  ];

  const dietOptions = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'omnivore', label: 'Omnivore' },
    { value: 'keto', label: 'Keto' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/api/sustainability', {
        commute_type: formData.commuteType,
        commute_distance: parseFloat(formData.commuteDistance),
        diet_type: formData.dietType,
        food_weight: parseFloat(formData.foodWeight),
        electricity_used: parseFloat(formData.electricityUsed),
        water_consumption: parseFloat(formData.waterConsumption),
        plastic_items_used: parseInt(formData.plasticItems)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      setFormData({
        commuteType: '',
        commuteDistance: '',
        dietType: '',
        foodWeight: '',
        electricityUsed: '',
        waterConsumption: '',
        plasticItems: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tracker-form">
      <h2>Track Your Sustainability</h2>
      {success && <div className="success-message">Data saved successfully!</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="commuteType">Commute Type</label>
          <select
            id="commuteType"
            name="commuteType"
            className="form-control"
            value={formData.commuteType}
            onChange={handleChange}
            required
          >
            <option value="">Select commute type</option>
            {commuteOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="commuteDistance">Commute Distance (km)</label>
          <input
            type="number"
            id="commuteDistance"
            name="commuteDistance"
            className="form-control"
            value={formData.commuteDistance}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dietType">Diet Type</label>
          <select
            id="dietType"
            name="dietType"
            className="form-control"
            value={formData.dietType}
            onChange={handleChange}
            required
          >
            <option value="">Select diet type</option>
            {dietOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="foodWeight">Food Weight (kg)</label>
          <input
            type="number"
            id="foodWeight"
            name="foodWeight"
            className="form-control"
            value={formData.foodWeight}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="electricityUsed">Electricity Used (kWh)</label>
          <input
            type="number"
            id="electricityUsed"
            name="electricityUsed"
            className="form-control"
            value={formData.electricityUsed}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="waterConsumption">Water Consumption (liters)</label>
          <input
            type="number"
            id="waterConsumption"
            name="waterConsumption"
            className="form-control"
            value={formData.waterConsumption}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="plasticItems">Plastic Items Used</label>
          <input
            type="number"
            id="plasticItems"
            name="plasticItems"
            className="form-control"
            value={formData.plasticItems}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

         <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
          >
          {isSubmitting ? 'Submitting...' : 'Submit Data'}
        </button>
      </form>
    </div>
  );
}

export default TrackerForm;