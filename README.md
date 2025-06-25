# 🌱📊 Personal Sustainability Tracker

**Empower your eco-journey. Track your daily impact, gain insights, and connect with a community committed to a greener future.**

---

## ✨ Project Overview

The **Personal Sustainability Tracker** is a robust full-stack web application designed to help individuals consciously monitor and reduce their environmental footprint.

It transforms abstract environmental goals into actionable, measurable steps by offering intuitive tools to log daily habits and visualize ecological impact.  
This app fosters environmental awareness and motivates sustainable lifestyle choices through personalized insights and community engagement.

---

## 🚀 Key Features

- 🔐 **Secure & Seamless Authentication**  
  User registration and login via JWT-based token authentication.

- 📒 **Comprehensive Activity Logging**  
  Track daily habits:
  - **Commute**: Distance & transport type (car, public transport, bike, walk)
  - **Food**: Weight & dietary type (vegan, vegetarian, non-veg)
  - **Resources**: Electricity (kWh) & water (litres)
  - **Plastic**: Number of disposable plastic items used

- 📊 **Instant Impact Analytics**  
  Real-time estimation of carbon footprint (kg CO₂e) based on logged activities.

- 📈 **Interactive Progress Visualization**  
  View trends over time (daily, weekly, monthly) for all tracked categories via dynamic line charts.

- 🏆 **Community Leaderboard**  
  See how your eco-habits compare with other users — encouraging friendly competition.

- 📬 **Optional Email Notifications**  
  Receive signup/login alerts via Nodemailer integration.

---

## ⚙️ Getting Started

### ✅ Prerequisites

Ensure the following tools are installed:

- [Node.js (LTS)](https://nodejs.org/)
- npm (comes with Node.js) or Yarn
- PostgreSQL (active and running)

---

### 🛠 Setup Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Aswin-2266/personal-sustainability-tracker.git
cd personal-sustainability-tracker

#### 2. Configure Environment Variables
Create a .env file:

cp .env.template .env
Then open .env and fill in your credentials:
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret

# Optional for email:
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

#### 3. Install Dependencies
npm install

#### 4. Database Initialization
Ensure your PostgreSQL server is running.
The backend will auto-create tables (users, sustainability_data, etc.) on startup if not present (see db/schema.sql if used).

#### 5. Run the Application
npm start
This uses concurrently to launch:

React frontend at: http://localhost:3000

Express backend (API) behind the scenes

## 🧰 Tech Stack
### Frontend
React (v19.1.0) – Dynamic user interfaces

React Router DOM (v7.6.0) – Client-side routing

Recharts (v2.15.3) – Charts and graphs

Axios – API communication

React Icons (v5.5.0) – Icon packs

Custom CSS – Consistent styling

### Backend
Node.js

Express.js (v5.1.0)

jsonwebtoken (v9.0.2) – JWT-based auth

bcrypt (v5.1.1) – Secure password hashing

cors

Nodemailer (v7.0.3) – Email delivery

### Database
PostgreSQL

pg (v8.15.6) – PostgreSQL client for Node.js

### Dev Tools
dotenv – Env var management

concurrently – Run frontend + backend together

## 👤 Author
Aswin S.
🔗 LinkedIn Profile
📧 aswin.email@example.com

(Replace the above with your real LinkedIn and email.)

## 
🤝 Contributing
We welcome all contributions!
You can:

Open issues for bugs/features

Fork this repo and submit pull requests

Let’s build a greener future together 🌍