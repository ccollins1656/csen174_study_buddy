import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useSessionAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('session');
  
    async function sessionAuth(token) {
      const response = await axios.post('http://localhost:5000/session', {
          "token": token
      }).catch(function (e) {
          // Can't reach the server, go to login anyways to be safe
          console.log(e);
          navigate('/login');
      });
      if (!response || !(response.status === 204)) {
          // Empty response or non-OK code
          navigate('/login');
      }
    }

    sessionAuth(token);
  })
}