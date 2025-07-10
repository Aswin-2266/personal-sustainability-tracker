import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WeeklyProgressChart from './WeeklyProgressChart';

import './styles/Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Define API Base URL

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
        const sortedData = [...dataArray].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const latestEntries = sortedData.slice(0, 7); 

        latestEntries.forEach(entry => {
            const timeAgo = formatTimeAgo(entry.created_at);

            let activityIdCounter = 0; 
            if (entry.commute_distance > 0) {
                activities.push({
                    id: `${entry.id}-commute-${activityIdCounter++}`, 
                    icon: 'fas fa-route', 
                    text: `Logged ${entry.commute_distance}km commute via ${entry.commute_type || 'unknown method'}`,
                    time: timeAgo
                });
            }
            if (entry.food_weight > 0) {
                activities.push({
                    id: `${entry.id}-food-${activityIdCounter++}`,
                    icon: 'fas fa-utensils',
                    text: `Logged ${entry.food_weight}kg food consumption (${entry.diet_type || 'unspecified diet'})`,
                    time: timeAgo
                });
            }
            if (entry.electricity_used > 0) {
                activities.push({
                    id: `${entry.id}-electricity-${activityIdCounter++}`,
                    icon: 'fas fa-lightbulb',
                    text: `Logged ${entry.electricity_used} kWh electricity usage`,
                    time: timeAgo
                });
            }
            if (entry.water_consumption > 0) {
                activities.push({
                    id: `${entry.id}-water-${activityIdCounter++}`,
                    icon: 'fas fa-tint',
                    text: `Logged ${entry.water_consumption} L water consumption`,
                    time: timeAgo
                });
            }
            if (entry.plastic_items_used > 0) {
                activities.push({
                    id: `${entry.id}-plastic-${activityIdCounter++}`,
                    icon: 'fas fa-recycle',
                    text: `Logged ${entry.plastic_items_used} plastic items used`,
                    time: timeAgo
                });
            }
        });

        activities.sort((a, b) => {
            const originalEntryA = sortedData.find(d => a.id.startsWith(`${d.id}-`));
            const originalEntryB = sortedData.find(d => b.id.startsWith(`${b.id}-`));
            
            const timeA = originalEntryA ? new Date(originalEntryA.created_at).getTime() : 0;
            const timeB = originalEntryB ? new Date(originalEntryB.created_at).getTime() : 0;

            return timeB - timeA; 
        });
        
        return activities.slice(0, 5); 
    }, [formatTimeAgo]);

    const getUTCDateString = (date) => {
        return date.toISOString().slice(0, 10);
    };

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
                const response = await axios.get(`${API_BASE_URL}/api/sustainability`, { // Updated API call
                    headers: { Authorization: `Bearer ${token}` },
                });

                const allSustainabilityData = response.data;

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1); 

                const todayUtcString = getUTCDateString(today);
                const yesterdayUtcString = getUTCDateString(yesterday);

                let todayAggregated = { carbon: 0, water: 0, plastic: 0 };
                let yesterdayAggregated = { carbon: 0, water: 0, plastic: 0 };

                allSustainabilityData.forEach(entry => {
                    const entryDate = new Date(entry.created_at);
                    const entryUtcString = getUTCDateString(entryDate);

                    const carbonContribution = 
                        (entry.commute_distance || 0) * 0.192 +
                        (entry.food_weight || 0) * 27 +
                        (entry.electricity_used || 0) * 0.4 +
                        (entry.water_consumption || 0) * 0.00035 +
                        (entry.plastic_items_used || 0) * 0.3;
                    
                    if (entryUtcString === todayUtcString) {
                        todayAggregated.carbon += carbonContribution;
                        todayAggregated.water += (entry.water_consumption || 0);
                        todayAggregated.plastic += (entry.plastic_items_used || 0);
                    } else if (entryUtcString === yesterdayUtcString) {
                        yesterdayAggregated.carbon += carbonContribution;
                        yesterdayAggregated.water += (entry.water_consumption || 0);
                        yesterdayAggregated.plastic += (entry.plastic_items_used || 0);
                    }
                });

                const savedCarbon = yesterdayAggregated.carbon - todayAggregated.carbon;
                setCarbonSaved(savedCarbon.toFixed(2));

                const savedWater = yesterdayAggregated.water - todayAggregated.water;
                setWaterSaved(savedWater.toFixed(2));

                const savedPlastic = yesterdayAggregated.plastic - todayAggregated.plastic;
                setPlasticReduced(savedPlastic);

                if (allSustainabilityData.length === 0) {
                    setError("No sustainability data recorded yet. Log your activities!");
                } else if (yesterdayAggregated.carbon === 0 && todayAggregated.carbon === 0) {
                    setError("Not enough data for meaningful comparison (no activities today or yesterday). Log more!");
                }
                
                setRecentActivities(processSustainabilityData(allSustainabilityData));

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
            
            <div className="mobile-menu-toggle">
                <button className="hamburger-btn" onClick={toggleMobileMenu}>
                    <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </button>
            </div>

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
                        ) : error && recentActivities.length === 0 ? ( 
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
