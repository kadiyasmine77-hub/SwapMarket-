import { Search } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder,
  value,
  onChange,
  onSearch,
  className = '',
}: SearchBarProps) {
  const { t } = useLanguage();
  const displayPlaceholder = placeholder || t('common.search');

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder={displayPlaceholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
    </div>
  );
}
