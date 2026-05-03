import { useState } from 'react';
import { Heart, MapPin, Calendar, Shield, ChevronLeft, Share2, Flag } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ItemCard } from '../components/ItemCard';

interface ItemDetailPageProps {
  onNavigate: (page: string) => void;
}

export function ItemDetailPage({ onNavigate }: ItemDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = [
    'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1772111138229-79ce81f08dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1774888341203-0c914478ff8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
  ];

  const relatedItems = [
    {
      id: '2',
      title: 'Vintage Nikon FM2 Film Camera',
      category: 'Photography',
      condition: 'Good' as const,
      location: 'Portland, OR',
      postedDate: '1 week ago',
      imageUrl: 'https://images.unsplash.com/photo-1760259203822-30265e7e4da8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Alex Turner',
      ownerTrustScore: 4.6,
      isVerified: true,
    },
    {
      id: '3',
      title: 'Hasselblad Medium Format Camera',
      category: 'Photography',
      condition: 'Like New' as const,
      location: 'Seattle, WA',
      postedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1767706508357-49dbc890cbcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Maya Rodriguez',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
    {
      id: '4',
      title: 'Ricoh Film Camera Kit',
      category: 'Photography',
      condition: 'Fair' as const,
      location: 'Austin, TX',
      postedDate: '5 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1760126722564-819190d60abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Jordan Lee',
      ownerTrustScore: 4.5,
      isVerified: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar variant="authenticated" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Explore
        </button>

        <div className="grid lg:grid-cols-[1fr,400px] gap-12">
          {/* Left Column - Images & Details */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-4">
              <img
                src={images[selectedImage]}
                alt="Item"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mb-8">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-olive' : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={image} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Item Description</h2>
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>
                    Beautiful vintage Canon AE-1 camera in excellent working condition. This classic 35mm SLR camera has been professionally tested and serviced. Comes with original 50mm f/1.8 lens that produces stunning bokeh and sharp images.
                  </p>
                  <p>
                    Perfect for film photography enthusiasts or anyone looking to start their analog photography journey. The camera body shows minimal signs of wear, and all functions work perfectly including the built-in light meter.
                  </p>
                  <p>
                    Includes: Canon AE-1 body, 50mm f/1.8 FD lens, lens cap, camera strap, and original manual.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Item Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Category</dt>
                    <dd className="font-medium">Photography Equipment</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Condition</dt>
                    <dd>
                      <Badge variant="olive">Like New</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Brand</dt>
                    <dd className="font-medium">Canon</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Year</dt>
                    <dd className="font-medium">1978</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Owner Info */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Title & Basic Info */}
              <div>
                <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Vintage Canon AE-1 Camera with 50mm Lens
                </h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Portland, OR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted 2 days ago</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={isFavorited ? 'text-destructive' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-olive/5 border border-olive/20 rounded-xl p-6">
                <Button variant="olive" size="lg" className="w-full mb-3">
                  Propose Swap
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Select items from your collection to propose an exchange
                </p>
              </div>

              {/* Owner Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Listed by</h3>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                    SC
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Sarah Chen</h4>
                      <div className="w-5 h-5 rounded-full bg-trust-verified flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-semibold text-trust-gold">4.9</span>
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since March 2024 • 47 successful swaps
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Items</span>
                    <span className="font-medium">12 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">Portland, OR</span>
                  </div>
                </div>

                <Button variant="secondary" size="sm" className="w-full mt-4">
                  View Profile
                </Button>
              </div>

              {/* Safety Tips */}
              <div className="bg-secondary rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Safety Tips</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Meet in public, well-lit locations</li>
                      <li>• Inspect items before finalizing the swap</li>
                      <li>• Trust your instincts</li>
                      <li>• Report suspicious activity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Similar Items
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <div key={item.id} onClick={() => window.scrollTo(0, 0)} className="cursor-pointer">
                <ItemCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
