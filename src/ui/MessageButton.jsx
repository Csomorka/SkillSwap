function MessageButton({ handleMessage }) {
  return (
    <button className="bg-green-500 p-4" onClick={handleMessage}>
      Message
    </button>
  );
}

export default MessageButton;
