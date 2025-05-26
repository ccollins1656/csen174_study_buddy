import { useParams } from 'react-router-dom';
import Layout from './Layout';


const ChatRoom = () => {
    const { courseId } = useParams();

    return (
        <div>
        <h1>Chatroom for {courseId}</h1>
        {/* Chat UI goes here */}
        </div>
    );
};

export default ChatRoom;
