import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SwapOfferCard } from '../components/SwapOfferCard';
import { useLanguage } from '../LanguageContext';

interface SwapsPageProps {
  onNavigate: (page: string) => void;
}

type Tab = 'received' | 'sent' | 'completed';

export function SwapsPage({ onNavigate }: SwapsPageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('received');

  const receivedOffers = [
    {
      id: '1',
      type: 'received' as const,
      status: 'pending' as const,
      offeringItems: [
        {
          title: 'Designer Lounge Chair',
          imageUrl: 'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Good',
        },
      ],
      requestedItems: [
        {
          title: 'Vintage Canon Camera',
          imageUrl: 'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
      ],
      cashAdjustment: 50,
      otherPartyName: 'Marcus Johnson',
      date: 'April 10, 2026',
      message: "Hi! I love your camera. Would you be interested in my mid-century chair plus $50? It's in great condition and perfect for a home studio.",
    },
    {
      id: '2',
      type: 'received' as const,
      status: 'pending' as const,
      offeringItems: [
        {
          title: 'Vinyl Record Collection',
          imageUrl: 'https://images.unsplash.com/photo-1684248022540-459c648ec197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
        {
          title: 'Vintage Books Set',
          imageUrl: 'https://images.unsplash.com/photo-1773425350191-ff05d7e59e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Good',
        },
      ],
      requestedItems: [
        {
          title: 'Vintage Canon Camera',
          imageUrl: 'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
      ],
      otherPartyName: 'Emma Rodriguez',
      date: 'April 9, 2026',
      message: 'I collect vintage cameras and would love to trade my records and books for yours. Both are in excellent condition!',
    },
  ];

  const sentOffers = [
    {
      id: '3',
      type: 'sent' as const,
      status: 'pending' as const,
      offeringItems: [
        {
          title: 'Vintage Canon Camera',
          imageUrl: 'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
      ],
      requestedItems: [
        {
          title: 'Leica Film Camera',
          imageUrl: 'https://images.unsplash.com/photo-1774888341203-0c914478ff8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Good',
        },
      ],
      cashAdjustment: -75,
      otherPartyName: 'Alex Turner',
      date: 'April 8, 2026',
      message: 'Would you consider swapping your Leica for my Canon? I can add $75 to make it fair.',
    },
    {
      id: '4',
      type: 'sent' as const,
      status: 'countered' as const,
      offeringItems: [
        {
          title: 'Indoor Plant Collection',
          imageUrl: 'https://images.unsplash.com/photo-1611866759729-0cba525f9b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
      ],
      requestedItems: [
        {
          title: 'Modern Wooden Chair',
          imageUrl: 'https://images.unsplash.com/photo-1771573753404-0f99dbccd842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'New',
        },
      ],
      otherPartyName: 'Olivia Park',
      date: 'April 5, 2026',
    },
  ];

  const completedSwaps = [
    {
      id: '5',
      type: 'received' as const,
      status: 'completed' as const,
      offeringItems: [
        {
          title: 'Bicycle',
          imageUrl: 'https://images.unsplash.com/photo-1631090626454-a0d8c2d02ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Good',
        },
      ],
      requestedItems: [
        {
          title: 'Vintage Nikon Camera',
          imageUrl: 'https://images.unsplash.com/photo-1760259203822-30265e7e4da8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Like New',
        },
      ],
      otherPartyName: 'Jordan Lee',
      date: 'March 28, 2026',
    },
    {
      id: '6',
      type: 'sent' as const,
      status: 'completed' as const,
      offeringItems: [
        {
          title: 'Book Collection',
          imageUrl: 'https://images.unsplash.com/photo-1772976811682-465df3b8c735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Fair',
        },
      ],
      requestedItems: [
        {
          title: 'Vintage Records',
          imageUrl: 'https://images.unsplash.com/photo-1768688819506-a23ace578e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
          condition: 'Good',
        },
      ],
      cashAdjustment: 25,
      otherPartyName: 'Maya Rodriguez',
      date: 'March 15, 2026',
    },
  ];

  const getOffersByTab = () => {
    switch (activeTab) {
      case 'received':
        return receivedOffers;
      case 'sent':
        return sentOffers;
      case 'completed':
        return completedSwaps;
      default:
        return [];
    }
  };

  const offers = getOffersByTab();

  return (
    <div className="min-h-screen">
      <Navbar variant="authenticated" currentPage="swaps" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('swaps.title')}
          </h1>
          <p className="text-muted-foreground">{t('swaps.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'received'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('swaps.received')} ({receivedOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'sent'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('swaps.sent')} ({sentOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('swaps.completed')} ({completedSwaps.length})
            </button>
          </div>
        </div>

        {/* Offers List */}
        {offers.length > 0 ? (
          <div className="space-y-6">
            {offers.map((offer) => (
              <SwapOfferCard key={offer.id} {...offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('swaps.no_swaps')}</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'received' && t('swaps.no_received')}
              {activeTab === 'sent' && t('swaps.no_sent')}
              {activeTab === 'completed' && t('swaps.no_completed')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
