// src/SettingsPage.js
import { useState } from 'react';
import Navbar from './components/Navbar'; // Import the Navbar component
import LoginGate from './components/LoginGate'; // This page requires login
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('default'); // change to give initial state of current display name

  const handleChanges = () => {
    // Attempt to make changes and pass on to database.
    // Display a status message after.
    // Make sure to validate acceptable characters (UTF-8 only?) and escape it.
  };

  const resetPassword = () => {
    // Connect to loginManager.py and reset the password.
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <LoginGate />
      <Navbar /> {/* Add the Navbar here */}
      
      <div className="flex items-center justify-center flex-col mt-16">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-xl mt-4">Display Name:</p>
        <Input
          type="text"
          placeholder="Preferred Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mb-4"
        />
        <br />
        <Button onClick={handleChanges} className="w-full">Apply Changes</Button>
        <br /><br />
        <Button onClick={resetPassword} className="w-full">Reset Password</Button>
      </div>
    </div>
  );
}
