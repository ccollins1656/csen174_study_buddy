// src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-white text-2xl font-bold mb-2">Study Helper</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/welcome" className="text-white hover:underline">Home</Link>
          <Link to="/add-course" className="text-white hover:underline">Add Course</Link>
          <Link to="/messages" className="text-white hover:underline">Messages</Link>
          <Link to="/settings" className="text-white hover:underline">Account Settings</Link>
        </div>
      </div>
    </nav>
  );
}