// Had lcomposant kaybiyn les badges wla labels sghar b lwan mkhtalfa (bhal disponible, reserve, echange) 3la hssab lvariant li ghadi nkhdmo bih
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'olive' | 'trust';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full font-medium';

  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning-foreground border border-warning/20',
    danger: 'bg-destructive/10 text-destructive border border-destructive/20',
    olive: 'bg-olive/10 text-olive border border-olive/20',
    trust: 'bg-trust-gold/10 text-trust-gold border border-trust-gold/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
