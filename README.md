Personal Sustainability Tracker 🌱📊
Track Your Eco-Impact, Drive Change, and Connect with a Greener Community.

✨ Project Overview
The Personal Sustainability Tracker is a full-stack web application designed to empower individuals to effortlessly monitor and reduce their environmental footprint. By providing intuitive tools for logging daily activities and visualizing their impact, the app aims to foster greater awareness and motivate sustainable lifestyle choices. Join a growing community committed to a greener future!

🚀 Features at a Glance
Secure Authentication: Seamless user registration and login experience with robust JWT-based authentication.

Activity Tracking: Log diverse daily habits including commute distance and type, food consumption (by weight/diet), electricity usage, water consumption, and plastic items used.

Impact Analytics: Gain valuable insights with a built-in carbon footprint estimator, providing tangible data on your environmental impact.

Interactive Progress Charts: Visualize your sustainability journey over time with dynamic weekly and monthly charts, displaying individual metrics (commute, food, energy, water, plastic) for detailed analysis.

Community Leaderboard: Foster friendly competition and collective motivation by seeing how your efforts stack up against other users.

Email Notifications (Optional): Receive alerts for login and signup activities, powered by Nodemailer.

⚙️ Getting Started
Follow these steps to get your Personal Sustainability Tracker up and running locally.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended)

npm (comes with Node.js) or Yarn

PostgreSQL

1. Clone the Repository
git clone [https://github.com/Aswin-2266/personal-sustainability-tracker.git](https://github.com/Aswin-2266/personal-sustainability-tracker.git)
cd personal-sustainability-tracker

2. Setup Environment Variables
Create a .env file in the root directory of the project:

cp .env.template .env

Open the newly created .env file and fill in your actual credentials for the database and JWT secret.
(Example contents for .env.template if you plan to include one in your repo: DB_USER=your_user\nDB_HOST=localhost\nDB_NAME=your_db\nDB_PASSWORD=your_password\nDB_PORT=5432\nJWT_SECRET=a_very_secret_key_for_jwt)

3. Install Dependencies
Install both frontend and backend dependencies:

npm install

4. Database Setup
Ensure your PostgreSQL server is running. The application will attempt to create the necessary tables on startup if they don't exist, based on your db/schema.sql (if present and used by server.js).

5. Run the Application
Start both the frontend (React) and backend (Node.js/Express) simultaneously:

npm start

This command uses concurrently to run react-scripts start and node server.js. Your application should now be accessible in your browser, typically at http://localhost:3000.

🛠️ Tech Stack
Frontend:

React (v19.1.0) - User Interface

React Router DOM (v7.6.0) - Client-side Routing

Recharts (v2.15.3) - Data Visualization

Axios - HTTP Client

React Icons (v5.5.0) - UI Icons

Custom CSS for styling

Backend:

Node.js - Runtime Environment

Express.js (v5.1.0) - Web Framework

jsonwebtoken (v9.0.2) - JWT Authentication

bcrypt (v5.1.1) - Password Hashing

cors - Cross-Origin Resource Sharing

Nodemailer (v7.0.3) - Email Sending

Database:

PostgreSQL - Relational Database

pg (v8.15.6) - PostgreSQL Client for Node.js

Development Tools:

dotenv - Environment Variable Management

concurrently - Run multiple commands concurrently

👤 Author
Aswin S.
Feel free to connect with me on LinkedIn or reach out via Email.

🤝 Contributing
Contributions are welcome! If you have suggestions, bug reports, or want to contribute to the codebase, please open an issue or submit a pull request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details. (Note: You should create a LICENSE file in your repository if you don't have one)