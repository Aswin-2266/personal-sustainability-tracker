import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa'; 
import axios from 'axios'; 
import { useAuth } from './AuthContext'; 

import './styles/Community.css';

function Community() {
    const { token, loading: authLoading } = useAuth(); 
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchLeaderboard = async () => {
            
            if (authLoading) {
                return;
            }

            if (!token) {
                
                setError('You need to be logged in to view the leaderboard.');
                setLoading(false);
                
                return;
            }

            setLoading(true); 
            setError(null); 

            try {
                const response = await axios.get('http://localhost:5000/api/community/leaderboard', {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                });
                setLeaderboard(response.data);
            } catch (err) {
                console.error('Error fetching leaderboard data:', err);
                if (err.response) {
                    
                    
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Access denied. Please log in again.');
                        
                        
                    } else {
                        setError(err.response.data.message || 'Failed to load leaderboard data.');
                    }
                } else if (err.request) {
                    
                    setError('No response from server. Please check your network connection.');
                } else {
                    
                    setError('Error setting up the request.');
                }
            } finally {
                setLoading(false); 
            }
        };
        
        fetchLeaderboard();
    }, [token, authLoading]); 

    return (
        <div className="community-container">
            <div className="community-header">
                <h2>Community Leaderboard</h2>
                <p>Get motivated by the top eco-friendly users in our community!</p>
            </div>

            <div className="leaderboard-section">
                <h3 className="leaderboard-title">
                    <FaTrophy size={20} style={{ marginRight: '8px' }} /> Top Performers
                </h3>
                
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Eco Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="loading-message">Loading leaderboard...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="3" className="error-message">{error}</td>
                            </tr>
                        ) : leaderboard.length > 0 ? (
                            leaderboard.map((user, index) => (
                                <tr key={user.username}> {}
                                    <td className="rank-cell">{index + 1}</td>
                                    <td className="username-cell">{user.username}</td>
                                    <td className="points-cell">{user.points.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="loading-message">No leaderboard data available yet. Be the first to earn points!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Community;
