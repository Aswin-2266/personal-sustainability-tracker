import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa'; // Using Font Awesome trophy icon from react-icons
import './Community.css';

function Community() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/community/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard data:', err);
        setLoading(false);
      });
  }, []);

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
            ) : leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <tr key={user.username}>
                  <td className="rank-cell">{index + 1}</td>
                  <td className="username-cell">{user.username}</td>
                  <td className="points-cell">{user.points.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="loading-message">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Community;