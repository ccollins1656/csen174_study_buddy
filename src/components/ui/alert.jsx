// src/components/ui/alert.jsx
export function Alert({ children, variant = 'destructive' }) {
  const variantClass = variant === 'destructive' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`p-4 rounded-md ${variantClass} text-white`}>
      {children}
    </div>
  );
}
