import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import WeeklyProgressChart from './WeeklyProgressChart';
import { useEffect, useState } from 'react';
import axios from 'axios';



function Dashboard() {
  const { user, logout } = useAuth();

  const [carbonSaved, setCarbonSaved] = useState(null);
  const [waterSaved, setWaterSaved] = useState(null);
  const [plasticReduced, setPlasticReduced] = useState(null);


useEffect(() => {
  const fetchCarbonData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sustainability', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const [today, yesterday] = response.data.slice(0, 2);

      const calculateCarbon = (data) => {
        const commute = data.commute_distance * 0.192;
        const food = data.food_weight * 27;
        const electricity = data.electricity_used * 0.4;
        const water = data.water_consumption * 0.00035;
        const plastic = data.plastic_items_used * 0.3;
        return commute + food + electricity + water + plastic;
      };

      if (today && yesterday) {
        const todayCarbon = calculateCarbon(today);
        const yesterdayCarbon = calculateCarbon(yesterday);
        const savedCarbon = yesterdayCarbon - todayCarbon;
        setCarbonSaved(savedCarbon.toFixed(2));

        const savedWater = yesterday.water_consumption - today.water_consumption;
        setWaterSaved(savedWater.toFixed(2)); // in Liters

        const savedPlastic = yesterday.plastic_items_used - today.plastic_items_used;
        setPlasticReduced(savedPlastic);

      }
    } catch (error) {
      console.error('Error fetching carbon data:', error);
    }
  };

  fetchCarbonData();
}, []);

  

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-greeting">
          <h1>Welcome back, <span className="username">{user?.username || 'Guest'}</span>!</h1>
          <p className="user-email">{user?.email || 'Not logged in'}</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg>
          Sign Out
        </button>
      </header>
      
      <nav className="dashboard-nav">
        <div className="nav-grid">
          <Link to="/tracker" className="nav-card">
            <div className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
            </div>
            <h3>Track Sustainability</h3>
            <p>Log your daily environmental impact</p>
          </Link>

          <Link to="/progress" className="nav-card">
            <div className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </div>
            <h3>View Progress</h3>
            <p>See your sustainability journey</p>
          </Link>

          <Link to="/insights" className="nav-card">
            <div className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
              </svg>
            </div>
            <h3>Get Insights</h3>
            <p>Personalized recommendations</p>
          </Link>

          <Link to="/community" className="nav-card">
            <div className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path d="M8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z"/>
              </svg>
            </div>
            <h3>Community</h3>
            <p>Connect with others</p>
          </Link>
        </div>
      </nav>

      <section className="weekly-progress-graph">
  <h2 style={{ padding: '0 2rem' }}>Weekly Progress</h2>

  <WeeklyProgressChart />
</section>

      
      <main className="dashboard-main">
        <section className="quick-stats">
          <h2>Your Sustainability Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Carbon Saved</h4>
              <p className="stat-value">
                {carbonSaved !== null ? `${carbonSaved} kg` : 'Loading...'}
              </p>
              <p className={`stat-change ${carbonSaved > 0 ? 'positive' : 'negative'}`}>
                {carbonSaved > 0 ? `↑ Saved from yesterday` : carbonSaved < 0 ? `↓ Increased from yesterday` : 'No change'}
              </p>
            </div>

            <div className="stat-card">
              <h4>Water Saved</h4>
              <p className="stat-value">
                {waterSaved !== null ? `${Math.abs(waterSaved)} L` : 'Loading...'}
              </p>
              <p className={`stat-change ${waterSaved > 0 ? 'positive' : waterSaved < 0 ? 'negative' : ''}`}>
                {waterSaved > 0
                  ? '↑ Saved from yesterday'
                  : waterSaved < 0
                  ? '↓ Increased usage from yesterday'
                  : 'No change'}
              </p>
            </div>

            <div className="stat-card">
              <h4>Plastic Reduced</h4>
              <p className="stat-value">
                {plasticReduced !== null ? `${Math.abs(plasticReduced)} items` : 'Loading...'}
              </p>
              <p className={`stat-change ${plasticReduced > 0 ? 'positive' : plasticReduced < 0 ? 'negative' : ''}`}>
                {plasticReduced > 0
                  ? '↑ Reduced from yesterday'
                  : plasticReduced < 0
                  ? '↓ Increased usage from yesterday'
                  : 'No change'}
              </p>
            </div>

          </div>
        </section>
        
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-details">
                <p>Logged today's commute (5km bike)</p>
                <small>2 hours ago</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">♻</div>
              <div className="activity-details">
                <p>Recycled 3 plastic items</p>
                <small>Yesterday</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏆</div>
              <div className="activity-details">
                <p>Earned "Eco Warrior" badge</p>
                <small>3 days ago</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;