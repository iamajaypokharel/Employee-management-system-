function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`toast ${type}`}>
      <div>{message}</div>
      <button className="icon-btn" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
