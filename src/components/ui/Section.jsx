export default function Section({ title, subtitle, action, className = '', children }) {
  return (
    <section className={['flex flex-col gap-4', className].join(' ')}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-bold text-[var(--text-white)] tracking-tight leading-snug">{title}</h2>}
            {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}