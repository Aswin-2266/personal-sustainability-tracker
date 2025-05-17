require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
const path = require('path');
const { sendLoginEmail } = require('./src/components/Mailer');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const runSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Tables created or already exist.');
  } catch (error) {
    console.error('❌ Error executing schema:', error);
  }
};

// Run it once when starting the server
runSchema();  

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

app.use(cors());
app.use(express.json());



// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // Insert into leaderboard with 0 points
    await pool.query(
      'INSERT INTO leaderboard (user_id, username, points) VALUES ($1, $2, $3)',
      [user.id, user.username, 0]
    );

    await sendLoginEmail(email, username);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // await sendLoginEmail(email, user.username);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  console.log(user); 

  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});


// Protected sustainability data endpoint
app.post('/api/sustainability', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const {
      commute_type,
      commute_distance,
      diet_type,
      food_weight,
      electricity_used,
      water_consumption,
      plastic_items_used
    } = req.body;

    const query = `
      INSERT INTO sustainability_data (
        user_id,
        commute_type, 
        commute_distance, 
        diet_type, 
        food_weight, 
        electricity_used, 
        water_consumption, 
        plastic_items_used
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      user.id,
      commute_type,
      commute_distance,
      diet_type,
      food_weight,
      electricity_used,
      water_consumption,
      plastic_items_used
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's sustainability data
app.get('/api/sustainability', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const result = await pool.query(
      'SELECT * FROM sustainability_data WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token verification endpoint
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user }); // Send back the decoded user info
});

app.get('/api/user-progress/:period', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { period } = req.params;

  let query = '';
  let values = [userId];

  // Adjust the query based on the selected period
  if (period === 'today') {
    query = `
      SELECT created_at AS date, commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
      FROM sustainability_data 
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE
      ORDER BY date ASC`;
  } else if (period === 'weekly') {
    query = `
      SELECT created_at AS date, commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
      FROM sustainability_data 
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY date ASC`;
  } else if (period === 'monthly') {
    query = `
      SELECT created_at AS date, commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
      FROM sustainability_data 
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '1 month'
      ORDER BY date ASC`;
  } else {
    return res.status(400).json({ error: 'Invalid period' });
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching progress data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
    

const insightsRoute = require('./routes/insights');

app.use(express.json());
app.use('/api/insights', insightsRoute);

// server.js (Backend)
const db = require('./server');  // Assume you have a database connection module

app.use(express.json());

// Endpoint to get leaderboard
app.get('/api/community/leaderboard', (req, res) => {
  const query = 'SELECT username, points FROM leaderboard ORDER BY points DESC LIMIT 10'; // Top 10 leaderboard
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching leaderboard data:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'No leaderboard data found' });
    }
    console.log('Leaderboard Data:', results.rows);
    res.json(results.rows);
  });
});

// Example of adding points to a user (when they log an activity)
app.post('/api/user/activity', (req, res) => {
  const { userId, activityType } = req.body;
  
  if (!userId || !activityType) {
    return res.status(400).json({ message: 'Missing required fields: userId and activityType' });
  }
  
  let points = 0;
  
  // Example of assigning points based on activity
  if (activityType === 'commute') points = 10;
  else if (activityType === 'recycle') points = 5;
  // Add other activities and their points here...

  // Update points in the database
  const query = 'UPDATE leaderboard SET points = points + $1 WHERE user_id = $2';
  db.query(query, [points, userId], (err, results) => {
    if (err) {
      console.error('Error updating points:', err);
      return res.status(500).json({ message: 'Error updating points. Please try again later.' });
    }
    res.status(200).json({ message: 'Points updated successfully' });
  });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

