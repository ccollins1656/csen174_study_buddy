import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/LoginForm/RegisterForm';
import WelcomePage from './Components/LoginForm/WelcomePage';
import AddCourse from './Components/LoginForm/AddCourse';
import GroupForum from './Components/LoginForm/GroupForum';
import Message from './Components/LoginForm/Message';
import Settings from './Components/LoginForm/Settings';
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
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/groupforum" element={<GroupForum />} />
        <Route path="/messagepage" element={<Message />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;



