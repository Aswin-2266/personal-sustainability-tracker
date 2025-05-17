// Leaderboard.js
import React, { useEffect, useState } from 'react';
// import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from the backend API
    fetch('/api/community/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Error fetching leaderboard data:', err));
  }, []);

  return (
    <div className="leaderboard-container">
      <h3>Leaderboard</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
              <tr key={user.username}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
