export default function Avatar({ src, alt, size = 40, online = false }) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      {online && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse-dot" />
      )}
    </div>
  );
}