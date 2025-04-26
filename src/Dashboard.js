export default function Dashboard({ userEmail }) {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Welcome to Study Helper!</h1>
      <p className="text-lg">Logged in as <strong>{userEmail}</strong></p>
      <p className="mt-4">Let’s get some studying done 💪</p>
    </div>
  );
}