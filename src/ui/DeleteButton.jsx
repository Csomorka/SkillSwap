function DeleteButton({ onDelete, children }) {
  return <button onClick={onDelete}>{children}</button>;
}

export default DeleteButton;
