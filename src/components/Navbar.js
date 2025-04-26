// src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl">Study Helper</h1>
        <div>
          <Link to="/add-course" className="text-white mx-4">Add Course</Link>
          <Link to="/messages" className="text-white mx-4">Messages</Link>
        </div>
      </div>
    </nav>
  );
}
