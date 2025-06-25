import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WeeklyProgressChart from './WeeklyProgressChart';

import './Dashboard.css';

function Dashboard() {
    const { user, logout, token, loading: authLoading } = useAuth();

    const [carbonSaved, setCarbonSaved] = useState(null);
    const [waterSaved, setWaterSaved] = useState(null);
    const [plasticReduced, setPlasticReduced] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


    const formatTimeAgo = useCallback((timestamp) => {
        const date = new Date(timestamp); 
        const now = new Date(); 

        
        const diffInMilliseconds = now.getTime() - date.getTime();
        const diffInSeconds = Math.round(diffInMilliseconds / 1000);

        
        
        
        if (diffInSeconds < 0) {
            
            console.warn("Activity timestamp is in the future:", timestamp, "Current time:", now);
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        

        
        const minutes = Math.round(diffInSeconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); 
    }, []);

    
    const processSustainabilityData = useCallback((dataArray) => {
        const activities = [];
        const latestEntries = dataArray.slice(0, 7); 

        latestEntries.forEach(entry => {
            const timeAgo = formatTimeAgo(entry.created_at);

            if (entry.commute_distance > 0) {
                activities.push({
                    id: `${entry.id}-commute-${Math.random()}`, 
                    icon: 'fas fa-route', 
                    text: `Logged ${entry.commute_distance}km commute via ${entry.commute_type || 'unknown method'}`,
                    time: timeAgo
                });
            }
            if (entry.food_weight > 0) {
                activities.push({
                    id: `${entry.id}-food-${Math.random()}`,
                    icon: 'fas fa-utensils',
                    text: `Logged ${entry.food_weight}kg food consumption (${entry.diet_type || 'unspecified diet'})`,
                    time: timeAgo
                });
            }
            if (entry.electricity_used > 0) {
                activities.push({
                    id: `${entry.id}-electricity-${Math.random()}`,
                    icon: 'fas fa-lightbulb',
                    text: `Logged ${entry.electricity_used} kWh electricity usage`,
                    time: timeAgo
                });
            }
            if (entry.water_consumption > 0) {
                activities.push({
                    id: `${entry.id}-water-${Math.random()}`,
                    icon: 'fas fa-tint',
                    text: `Logged ${entry.water_consumption} L water consumption`,
                    time: timeAgo
                });
            }
            if (entry.plastic_items_used > 0) {
                activities.push({
                    id: `${entry.id}-plastic-${Math.random()}`,
                    icon: 'fas fa-recycle',
                    text: `Logged ${entry.plastic_items_used} plastic items used`,
                    time: timeAgo
                });
            }
            
        });

        
        activities.sort((a, b) => {
            const originalA = dataArray.find(d => a.id.startsWith(`${d.id}-`))?.created_at;
            const originalB = dataArray.find(d => b.id.startsWith(`${d.id}-`))?.created_at;
            return new Date(originalB) - new Date(originalA);
        });
        
        return activities.slice(0, 5); 
    }, [formatTimeAgo]);

    useEffect(() => {
        const fetchSustainabilityData = async () => {
            if (authLoading) {
                return;
            }
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('http://localhost:5000/api/sustainability', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                
                if (response.data.length >= 2) {
                    const [today, yesterday] = response.data.slice(0, 2);
                    const calculateCarbon = (data) => {
                        const commute = (data.commute_distance || 0) * 0.192;
                        const food = (data.food_weight || 0) * 27;
                        const electricity = (data.electricity_used || 0) * 0.4;
                        const water = (data.water_consumption || 0) * 0.00035;
                        const plastic = (data.plastic_items_used || 0) * 0.3;
                        return commute + food + electricity + water + plastic;
                    };

                    const todayCarbon = calculateCarbon(today);
                    const yesterdayCarbon = calculateCarbon(yesterday);
                    const savedCarbon = yesterdayCarbon - todayCarbon;
                    setCarbonSaved(savedCarbon.toFixed(2));

                    const savedWater = yesterday.water_consumption - today.water_consumption;
                    setWaterSaved(savedWater.toFixed(2));

                    const savedPlastic = yesterday.plastic_items_used - today.plastic_items_used;
                    setPlasticReduced(savedPlastic);
                } else {
                    setCarbonSaved(0);
                    setWaterSaved(0);
                    setPlasticReduced(0);
                    if (response.data.length === 1) {
                        setError("Only one day of data available. Log more activities for comparative insights!");
                    } else {
                        setError("No sustainability data recorded yet. Log your activities!");
                    }
                }
                
                
                setRecentActivities(processSustainabilityData(response.data));

            } catch (err) {
                console.error('Error fetching sustainability data:', err);
                if (err.response) {
                    setError(err.response.data.error || 'Failed to load dashboard data.');
                } else if (err.request) {
                    setError('Network error: No response from server.');
                } else {
                    setError('An unexpected error occurred.');
                }
                setCarbonSaved(null);
                setWaterSaved(null);
                setPlasticReduced(null);
                setRecentActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSustainabilityData();
    }, [token, authLoading, processSustainabilityData]);

    const renderStatValue = (value, unit) => {
        if (loading) return 'Loading...';
        if (error) return 'N/A';
        if (value === null) return 'N/A';
        return `${Math.abs(value)}${unit}`;
    };

    const renderStatChange = (value, type) => {
        if (loading || error || value === null) return '';

        let message = '';
        let iconClass = '';
        let statusClass = '';

        if (value > 0) {
            message = `Saved from yesterday`;
            statusClass = 'positive';
            iconClass = 'fas fa-arrow-up';
            if (type === 'plastic') message = `Reduced from yesterday`;
        } else if (value < 0) {
            message = `Increased usage from yesterday`;
            statusClass = 'negative';
            iconClass = 'fas fa-arrow-down';
            if (type === 'plastic') message = `Increased usage from yesterday`;
        } else {
            message = 'No change from yesterday';
            statusClass = '';
            iconClass = 'fas fa-equals';
        }
        
        return (
            <p className={`stat-change ${statusClass}`}>
                <i className={iconClass}></i> {message}
            </p>
        );
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="user-greeting">
                    <h1>Welcome back, <span className="username">{user?.username || 'Guest'}</span>!</h1>
                </div>
                <button className="logout-btn" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
            </header>
            
            {/* Hamburger Icon for Mobile */}
            <div className="mobile-menu-toggle">
                <button className="hamburger-btn" onClick={toggleMobileMenu}>
                    <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </button>
            </div>

            {/* Navbar (desktop) and Mobile Menu (mobile) */}
            <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                <ul className="navbar-links">
                    <li>
                        <Link to="/tracker" className="navbar-item" onClick={closeMobileMenu}>
                            <i className="fas fa-leaf"></i> Track Sustainability
                        </Link>
                    </li>
                    <li>
                        <Link to="/progress" className="navbar-item" onClick={closeMobileMenu}>
                            <i className="fas fa-chart-line"></i> View Progress
                        </Link>
                    </li>
                    <li>
                        <Link to="/insights" className="navbar-item" onClick={closeMobileMenu}>
                            <i className="fas fa-lightbulb"></i> Get Insights
                        </Link>
                    </li>
                    <li>
                        <Link to="/community" className="navbar-item" onClick={closeMobileMenu}>
                            <i className="fas fa-users"></i> Community
                        </Link>
                    </li>
                </ul>
            </nav>

            <section className="weekly-progress-graph">
                <h2 style={{ padding: '0 2rem' }}>Weekly Progress</h2>
                <WeeklyProgressChart />
            </section>
            
            <main className="dashboard-main">
                <section className="quick-stats">
                    <h2>Your Sustainability Summary</h2>
                    {error && <p className="error-message" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Carbon Saved</h4>
                            <p className="stat-value">
                                {renderStatValue(carbonSaved, ' kg')}
                            </p>
                            {renderStatChange(carbonSaved, 'carbon')}
                        </div>

                        <div className="stat-card">
                            <h4>Water Saved</h4>
                            <p className="stat-value">
                                {renderStatValue(waterSaved, ' L')}
                            </p>
                            {renderStatChange(waterSaved, 'water')}
                        </div>

                        <div className="stat-card">
                            <h4>Plastic Reduced</h4>
                            <p className="stat-value">
                                {renderStatValue(plasticReduced, ' items')}
                            </p>
                            {renderStatChange(plasticReduced, 'plastic')}
                        </div>
                    </div>
                </section>
                
                <section className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        {loading ? (
                            <p className="loading-message">Loading recent activities...</p>
                        ) : error ? (
                            <p className="error-message">Could not load activities: {error}</p>
                        ) : recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div className="activity-item" key={activity.id}>
                                    <div className="activity-icon">
                                        <i className={activity.icon}></i>
                                    </div>
                                    <div className="activity-details">
                                        <p>{activity.text}</p>
                                        <small>{activity.time}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-activities">No recent activities logged. Start tracking your sustainability!</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;