import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/LoginForm/RegisterForm';
import AuthPage from './components/LoginForm/AuthForm';
import WelcomePage from './components/LoginForm/WelcomePage';
import AddCoursePage from './AddCoursePage'

//import WelcomePage from './WelcomePage';
//import AddCoursePage from './AddCoursePage';
//import MessagesPage from './MessagesPage';

function App() {
  return (
    <Router>
      {/* Add your navbar component here */}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/add-course" element={<AddCoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;


