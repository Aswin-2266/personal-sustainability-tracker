// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import './Layout.css';

function Layout() {
  return (
    <div className="app-layout">
      <DashboardNav />
      <div className="main-content">
        <Outlet /> {/* This renders the child routes */}
      </div>
    </div>
  );
}

export default Layout;