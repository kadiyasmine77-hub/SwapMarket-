import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';

// Had lcomposant dial switch dial les langues bin lfrançais (FR) w langlais (EN) f navbar wla f ayi blassa
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border shadow-sm">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <button
        onClick={() => setLanguage('fr')}
        className={`text-xs font-bold transition-colors ${
          language === 'fr' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        FR
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`text-xs font-bold transition-colors ${
          language === 'en' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
}
