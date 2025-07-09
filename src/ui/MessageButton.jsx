function MessageButton({ handleMessage }) {
  return (
    <button
      className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
      onClick={handleMessage}
    >
      Message
    </button>
  );
}

export default MessageButton;
