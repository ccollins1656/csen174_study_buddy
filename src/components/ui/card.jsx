// src/components/ui/card.jsx
export function Card({ children, className }) {
  return <div className={`p-4 border rounded-md ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
