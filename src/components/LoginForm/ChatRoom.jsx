import { useParams } from 'react-router-dom';

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
