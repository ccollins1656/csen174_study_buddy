import { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Alert } from './components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['session']);

  const handleLogin = () => {
    if (!email.endsWith('@scu.edu')) {
      setError('Please use a valid SCU email address (must end with @scu.edu).');
      setIsLoggedIn(false);
    } else {
      setError('');
      setIsLoggedIn(true);
      setCookie('session', 16, { path: '/' }) // need to integrate with auth system
      navigate('/welcome');  // Redirect to welcome page after login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-2xl p-6">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">Study Helper Login</h1>
          {isLoggedIn ? (
            <p className="text-green-600 text-center">Successfully logged in with {email}</p>
          ) : (
            <>
              <Input
                type="email"
                placeholder="Enter your SCU email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleLogin} className="w-full">Login</Button>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  {error}
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
