const VARIANT_CLASSES = {
  base:     'card-base',
  glow:     'card-glow',
  elevated: 'rounded-2xl border bg-[var(--bg-elevated)] border-[var(--border-strong)]',
};

function Card({ variant = 'base', accentTop = false, className = '', children }) {
  return (
    <div className={[VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.base, accentTop ? 'relative card-accent-top' : '', 'overflow-hidden', className].join(' ')}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', children }) {
  return (
    <div className={['flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]', className].join(' ')}>
      {children}
    </div>
  );
}

function CardBody({ noPad = false, className = '', children }) {
  return <div className={[noPad ? '' : 'p-5', className].join(' ')}>{children}</div>;
}

function CardFooter({ className = '', children }) {
  return (
    <div className={['flex items-center justify-between gap-3 px-5 py-3.5 border-t border-[var(--border)] bg-black/10', className].join(' ')}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body   = CardBody;
Card.Footer = CardFooter;
export default Card;