// src/AddCoursePage.js
import LoginGate from './components/LoginGate'; // This page requires login

export default function AddCoursePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginGate />
      <h1 className="text-3xl font-bold"> Add a Course </h1>
      {/* Add your course form here */}
    </div>
  );
}
