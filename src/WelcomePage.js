// src/WelcomePage.js
import Navbar from './components/Navbar'; // Import the Navbar component
import LoginGate from './components/LoginGate'; // This page requires login

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <LoginGate />
      <Navbar /> {/* Add the Navbar here */}
      
      <div className="flex items-center justify-center flex-col mt-16">
        <h1 className="text-3xl font-bold">Welcome to Study Helper!</h1>
        <p className="text-xl mt-4">We're glad you're here. Manage your courses and messages here.</p>
      </div>
    </div>
  );
}

