import { Heart, MapPin, Calendar } from 'lucide-react';
import { Badge } from './Badge';
import { useLanguage } from '../LanguageContext';

interface ItemCardProps {
  id: string;
  title: string;
  category: string;
  condition: 'Neuf' | 'Comme neuf' | 'Bon état' | 'État correct';
  location: string;
  postedDate: string;
  imageUrl: string;
  ownerName: string;
  ownerTrustScore: number;
  isVerified?: boolean;
  isFavorited?: boolean;
  onFavorite?: () => void;
  disponibilite?: 'disponible' | 'echange' | 'reserve';
}

// Had l-composant howa l-card (l-war9a) li fiha l-ma3loumat d-objet (annonce) bash n-biynouh f-site
export function ItemCard({
  title,
  category,
  condition,
  location,
  postedDate,
  imageUrl,
  ownerName,
  ownerTrustScore,
  isVerified = false,
  isFavorited = false,
  onFavorite,
  disponibilite = 'disponible',
}: ItemCardProps) {
  const { t } = useLanguage();

  const conditionMap: Record<string, string> = {
    'Neuf': t('common.new'),
    'Comme neuf': t('common.like_new'),
    'Bon état': t('common.good'),
    'État correct': t('common.fair'),
  };

  const conditionColors: Record<string, 'success' | 'olive' | 'warning' | 'default'> = {
    'Neuf': 'success',
    'Comme neuf': 'olive',
    'Bon état': 'warning',
    'État correct': 'default',
  };

  const availabilityLabels = {
    disponible: { label: t('common.available'), variant: 'success' as const },
    echange: { label: t('common.exchanged'), variant: 'warning' as const },
    reserve: { label: t('common.reserved'), variant: 'default' as const },
  };

  return (
    <div className="group bg-card rounded-xl border border-border hover:border-olive/30 transition-all duration-300 overflow-hidden hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl || 'https://via.placeholder.com/600x450?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button
          onClick={onFavorite}
          className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </button>

          {/* Condition & Availability Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge variant={conditionColors[condition]} size="sm">
              {conditionMap[condition] || condition}
            </Badge>
            {disponibilite && (
              <Badge variant={availabilityLabels[disponibilite].variant} size="sm">
                {availabilityLabels[disponibilite].label}
              </Badge>
            )}
          </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground mb-1">{category}</p>

        {/* Title */}
        <h3 className="font-semibold mb-2 text-foreground line-clamp-2 group-hover:text-olive transition-colors">
          {title}
        </h3>

        {/* Location & Date */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{postedDate}</span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {ownerName.charAt(0)}
            </div>
            <span className="text-xs font-medium">{ownerName}</span>
          </div>

          <div className="flex items-center gap-1">
            {isVerified && (
              <div className="w-4 h-4 rounded-full bg-trust-verified flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              </div>
            )}
            <span className="text-xs font-medium text-trust-gold">{ownerTrustScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
