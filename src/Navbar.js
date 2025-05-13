// src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-6">
      <div className="flex flex-col items-center justify-center space-y-3">
        <h1 className="text-white text-2xl font-bold">Study Helper</h1>
        <div className="flex space-x-6">
          <Link to="/welcome" className="text-white hover:underline">Home</Link>
          <Link to="/add-course" className="text-white hover:underline">Add Course</Link>
          <Link to="/messages" className="text-white hover:underline">Messages</Link>
          <Link to="/settings" className="text-white hover:underline">Account Settings</Link>
        </div>
      </div>
    </nav>
  );
}

