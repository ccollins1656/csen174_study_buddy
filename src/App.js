import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/LoginForm/RegisterForm';
import AuthPage from './components/LoginForm/AuthForm';
import WelcomePage from './components/LoginForm/WelcomePage';
import AddCourse from './components/LoginForm/AddCourse';
import GroupForum from './components/LoginForm/GroupForum';
import Message from './components/LoginForm/Message';
import Settings from './components/LoginForm/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/group-forum" element={<GroupForum />} />
        <Route path="/message" element={<Message />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;


