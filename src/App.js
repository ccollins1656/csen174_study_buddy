// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import LoginPage from './LoginPage';
import WelcomePage from './WelcomePage';
import AddCoursePage from './AddCoursePage';
import MessagesPage from './MessagesPage';
import SettingsPage from './SettingsPage';

function App() {
  return (
    <CookiesProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/add-course" element={<AddCoursePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
    </CookiesProvider>
  );
}

export default App;



