export default function Button({ variant = 'primary', size = 'md', onClick, disabled, className = '', children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-${variant} btn-${size} ${className}`}
    >
      {children}
    </button>
  );
}