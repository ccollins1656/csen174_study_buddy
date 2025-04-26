// src/components/ui/button.jsx
export function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}
