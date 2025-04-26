// src/components/ui/input.jsx
export function Input({ type, placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 border rounded-md w-full ${className}`}
    />
  );
}
