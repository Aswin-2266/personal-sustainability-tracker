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

// --- NEW CRITICAL FIX ---
// Force Node.js to prefer IPv4 addresses over IPv6
// This will solve the 'ENETUNREACH' error on Render
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); 
// --- END OF FIX ---

// Ensure this path is correct relative to your server.js
// If server.js is in the root, and Mailer.js is in /src/components:
const { sendLoginEmail, sendWelcomeEmail } = require('./src/components/Mailer'); 

let poolConfig;

// Determine connection configuration based on environment
if (process.env.DATABASE_URL) {
    // Production (Render/Supabase): Use single URI
    console.log('Connecting using DATABASE_URL...');
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
        // We no longer need 'family: 4' here, as the global DNS fix handles it
    };
} else {
    // Local development (using separate variables)
    console.log('Connecting using individual DB variables...');
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: false
    };
}

const pool = new Pool(poolConfig);

const runSchema = async () => {
    try {
        // Assuming 'db/schema.sql' exists relative to this server.js file
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Tables created or already exist.');
    } catch (error) {
        console.error('❌ Error executing schema:', error);
    }
};

// Check if db/schema.sql exists before trying to run it
if (fs.existsSync(path.join(__dirname, 'db', 'schema.sql'))) {
    runSchema();
} else {
    console.warn('db/schema.sql not found, skipping schema creation.');
}


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userResult = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        const user = userResult.rows[0];

        await pool.query(
            'INSERT INTO leaderboard (user_id, username, points) VALUES ($1, $2, $3)',
            [user.id, user.username, 0]
        );

        await sendWelcomeEmail(user.email, user.username);
        console.log(`Welcome email triggered for new user: ${user.username}`);
        
        res.status(201).json({ message: 'User registered successfully!', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error('Registration error:', err);
        
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email or username already exists.' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const loginTime = new Date();
        await sendLoginEmail(user.email, user.username, loginTime);
        console.log(`Login email triggered for user: ${user.username}`);
        
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log('User logged in:', user.username);
        
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
                plastic_items_used,
                created_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
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
        console.error('Error saving sustainability data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/sustainability', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        // IMPORTANT: Make sure 'Asia/Kolkata' is the correct timezone for your server/db
        const query = `
            SELECT 
                id, user_id, commute_type, commute_distance, diet_type, food_weight, 
                electricity_used, water_consumption, plastic_items_used,
                TO_CHAR(created_at AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at
            FROM sustainability_data 
            WHERE user_id = $1 
            ORDER BY created_at DESC`;
            
        const result = await pool.query(query, [user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sustainability data:', err);
        // This is the line I previously introduced the typo on. It is now correct.
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

app.get('/api/user-progress/:period', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { period } = req.params;

    let query = '';
    let values = [userId];
    
    // IMPORTANT: Make sure 'Asia/KKolkata' is the correct timezone for your server/db
    const dateFormat = 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"';
    const timezoneConversion = "AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC'";

    if (period === 'today') {
        query = `
            SELECT 
                TO_CHAR(created_at ${timezoneConversion}, '${dateFormat}') AS created_at, 
                commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
            FROM sustainability_data 
            WHERE user_id = $1 
              AND created_at >= CURRENT_DATE
            ORDER BY created_at ASC`;
    } else if (period === 'weekly') {
        query = `
            SELECT 
                TO_CHAR(created_at ${timezoneConversion}, '${dateFormat}') AS created_at, 
                commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
            FROM sustainability_data 
            WHERE user_id = $1 
              AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY created_at ASC`;
    } else if (period === 'monthly') {
        query = `
            SELECT 
                TO_CHAR(created_at ${timezoneConversion}, '${dateFormat}') AS created_at, 
                commute_distance, food_weight, electricity_used, water_consumption, plastic_items_used 
            FROM sustainability_data 
            WHERE user_id = $1 
              AND created_at >= CURRENT_DATE - INTERVAL '1 month'
            ORDER BY created_at ASC`;
    } else {
        return res.status(400).json({ error: 'Invalid period' });
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(`Error fetching ${period} progress data:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
    
// Assuming 'routes/insights.js' exists relative to server.js
if (fs.existsSync(path.join(__dirname, 'routes', 'insights.js'))) {
    const insightsRoute = require('./routes/insights');
    app.use('/api/insights', insightsRoute);
} else {
    console.warn('routes/insights.js not found, skipping insights route.');
}


app.get('/api/community/leaderboard', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT username, points FROM leaderboard ORDER BY points DESC LIMIT 10';
        const results = await pool.query(query);
        
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'No leaderboard data found' });
        }
        console.log('Leaderboard Data:', results.rows);
        res.json(results.rows);
    } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        res.status(500).json({ message: 'Internal Server Error: Could not fetch leaderboard.' });
    }
});

app.post('/api/user/activity', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { activityType } = req.body;
    
    if (!activityType) {
        return res.status(400).json({ message: 'Missing required field: activityType' });
    }
    
    let points = 0;
    
    if (activityType === 'commute') points = 10;
    else if (activityType === 'recycle') points = 5;
    else if (activityType === 'water_reduction') points = 8;
    else if (activityType === 'plastic_reduction') points = 7;
    
    if (points === 0) {
        return res.status(400).json({ message: 'Unknown activity type or no points assigned.' });
    }

    try {
        const query = 'UPDATE leaderboard SET points = points + $1 WHERE user_id = $2 RETURNING points';
        const result = await pool.query(query, [points, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found in leaderboard.' });
        }

        res.status(200).json({ message: 'Points updated successfully', newPoints: result.rows[0].points });
    } catch (err) {
        console.error('Error updating points:', err);
        res.status(500).json({ message: 'Error updating points. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
