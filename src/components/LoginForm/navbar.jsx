// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6 list-none">
        <li>
          <Link to="/welcome" className="text-white hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/add-course" className="text-white hover:underline">
            Add Course
          </Link>
        </li>
        <li>
          <Link to="/messages" className="text-white hover:underline">
            Messages
          </Link>
        </li>
        <li>
          <Link to="/settings" className="text-white hover:underline">
            Account Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default navbar;
