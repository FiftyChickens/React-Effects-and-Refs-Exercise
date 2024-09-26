import "../assets/Message.css";

const Message = ({ title, content }) => {
  return (
    <div className="message">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Message;
