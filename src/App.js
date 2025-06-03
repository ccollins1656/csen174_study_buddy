import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/LoginForm/RegisterForm';
import AuthForm from './components/LoginForm/AuthForm';
import WelcomePage from './components/LoginForm/WelcomePage';
import AddCourse from './components/LoginForm/AddCourse';
import GroupForum from './components/LoginForm/GroupForum';
import Message from './components/LoginForm/Message';
import Settings from './components/LoginForm/Settings';
import ChatRoom from './components/LoginForm/ChatRoom';
import GroupInfo from './components/LoginForm/GroupInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/groupforum" element={<GroupForum />} />
        <Route path="/messagepage" element={<Message />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat/:courseId" element={<ChatRoom />} />
        <Route path="/groupinfo" element={<GroupInfo />} />
        <Route path="/groupcreate" element={<GroupCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
