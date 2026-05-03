export default function Badge({ variant = 'indigo', dot, pulse, className = '', children }) {
  return (
    <span className={`badge-${variant} ${className}`}>
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', ...(pulse ? { animation: 'blink 2s ease-in-out infinite' } : {}) }} />
      )}
      {children}
    </span>
  );
}