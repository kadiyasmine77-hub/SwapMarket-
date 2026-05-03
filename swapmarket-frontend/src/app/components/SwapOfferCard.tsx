import { ArrowRight, Calendar, User } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

interface OfferItem {
  title: string;
  imageUrl: string;
  condition: string;
}

interface SwapOfferCardProps {
  id: string;
  type: 'sent' | 'received';
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'completed';
  offeringItems: OfferItem[];
  requestedItems: OfferItem[];
  cashAdjustment?: number;
  otherPartyName: string;
  date: string;
  message?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
  onView?: () => void;
}

export function SwapOfferCard({
  type,
  status,
  offeringItems,
  requestedItems,
  cashAdjustment,
  otherPartyName,
  date,
  message,
  onAccept,
  onReject,
  onCounter,
  onView,
}: SwapOfferCardProps) {
  const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'olive' | 'default'> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    countered: 'olive',
    completed: 'success',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-olive/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{type === 'sent' ? `To: ${otherPartyName}` : `From: ${otherPartyName}`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
        <Badge variant={statusVariants[status]}>{status}</Badge>
      </div>

      {/* Swap Items Visual */}
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mb-4">
        {/* Offering Items */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">{type === 'sent' ? 'You offer' : 'They offer'}</p>
          <div className="flex gap-2">
            {offeringItems.map((item, idx) => (
              <div key={idx} className="flex-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-1">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium line-clamp-1">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-5 h-5 text-olive" />
          {cashAdjustment !== undefined && cashAdjustment !== 0 && (
            <span className="text-xs font-semibold text-olive">
              {cashAdjustment > 0 ? `+$${cashAdjustment}` : `-$${Math.abs(cashAdjustment)}`}
            </span>
          )}
        </div>

        {/* Requested Items */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">{type === 'sent' ? 'You request' : 'They request'}</p>
          <div className="flex gap-2">
            {requestedItems.map((item, idx) => (
              <div key={idx} className="flex-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-1">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium line-clamp-1">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-secondary p-3 rounded-lg mb-4">
          <p className="text-sm text-foreground">{message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {status === 'pending' && type === 'received' && (
          <>
            <Button variant="olive" size="sm" onClick={onAccept} className="flex-1">
              Accept
            </Button>
            <Button variant="secondary" size="sm" onClick={onCounter} className="flex-1">
              Counter
            </Button>
            <Button variant="ghost" size="sm" onClick={onReject}>
              Reject
            </Button>
          </>
        )}
        {status === 'pending' && type === 'sent' && (
          <Button variant="ghost" size="sm" onClick={onView} className="flex-1">
            View Details
          </Button>
        )}
        {(status === 'accepted' || status === 'completed') && (
          <Button variant="olive" size="sm" onClick={onView} className="flex-1">
            View Swap Details
          </Button>
        )}
        {status === 'countered' && (
          <Button variant="olive" size="sm" onClick={onView} className="flex-1">
            View Counter Offer
          </Button>
        )}
      </div>
    </div>
  );
}
