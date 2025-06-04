import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/LoginForm/RegisterForm';
import AuthForm from './Components/LoginForm/AuthForm';
import ForgotFrom from './Components/LoginForm/ForgotForm';
import WelcomePage from './Components/LoginForm/WelcomePage';
import AddCourse from './Components/LoginForm/AddCourse';
import GroupForum from './Components/LoginForm/GroupForum';
import Message from './Components/LoginForm/Message';
import Settings from './Components/LoginForm/Settings';
import ChatRoom from './Components/LoginForm/ChatRoom';
import GroupInfo from './Components/LoginForm/GroupInfo';
import GroupCreate from './Components/LoginForm/GroupCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/forgot" element={<ForgotFrom />} />
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
