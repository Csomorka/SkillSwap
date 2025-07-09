function DeleteButton({ onDelete, children, isDeletingPost }) {
  return (
    <button
      disabled={isDeletingPost}
      className="text-stone-400 hover:text-amber-600"
      onClick={onDelete}
    >
      {children}
    </button>
  );
}

export default DeleteButton;
