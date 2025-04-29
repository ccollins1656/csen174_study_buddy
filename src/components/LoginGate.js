// src/components/LoginGate.js

// This tool should be used to verify that the user is logged in to access this page.
// If they are not logged in, they will be redirected to the login page.
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function LoginGate() {
  const [cookies, setCookie] = useCookies([]);
  const loggedIn = (cookies.session == '16')

  return (
    <>
      {loggedIn ? (<span />) : (<Navigate to='/' />)}
    </>
  )
}