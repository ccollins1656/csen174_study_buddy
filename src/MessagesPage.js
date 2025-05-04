// src/MessagesPage.js
import LoginGate from './components/LoginGate'; // This page requires login

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginGate />
      <h1 className="text-3xl font-bold"> Messages</h1>
      {/* Add your messaging interface here */}
    </div>
  );
}