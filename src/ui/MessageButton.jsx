function MessageButton({ handleMessage }) {
  return (
    <button
      className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
      onClick={handleMessage}
    >
      Message
    </button>
  );
}

export default MessageButton;
