import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/LoginForm/RegisterForm';
import WelcomePage from './Components/LoginForm/WelcomePage';
//import WelcomePage from './WelcomePage';
//import AddCoursePage from './AddCoursePage';
//import MessagesPage from './MessagesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;


