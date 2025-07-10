import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">Sustainify</Link>
          <div className="space-x-4 hidden md:flex">
            <Link to="/tracker" className="text-gray-700 hover:text-blue-600">Tracker</Link>
            <Link to="/progress" className="text-gray-700 hover:text-blue-600">Progress</Link>
            <Link to="/insights" className="text-gray-700 hover:text-blue-600">Insights</Link>
            <Link to="/community" className="text-gray-700 hover:text-blue-600">Community</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
