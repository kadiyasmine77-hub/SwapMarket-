import { useState } from 'react';
import { Shield, MapPin, Calendar, Edit, Settings, Package, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ItemCard } from '../components/ItemCard';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

type Tab = 'items' | 'swaps' | 'reviews' | 'settings';

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [isEditing, setIsEditing] = useState(false);

  const userItems = [
    {
      id: '1',
      title: 'Vintage Canon AE-1 Camera',
      category: 'Photography',
      condition: 'Like New' as const,
      location: 'Portland, OR',
      postedDate: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Sarah Chen',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
    {
      id: '2',
      title: 'Vintage Nikon FM2',
      category: 'Photography',
      condition: 'Good' as const,
      location: 'Portland, OR',
      postedDate: '1 week ago',
      imageUrl: 'https://images.unsplash.com/photo-1760259203822-30265e7e4da8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Sarah Chen',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
    {
      id: '3',
      title: 'Indoor Plant Collection',
      category: 'Home & Garden',
      condition: 'Like New' as const,
      location: 'Portland, OR',
      postedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1611866759729-0cba525f9b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Sarah Chen',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
  ];

  const swapHistory = [
    {
      id: '1',
      item: 'Vintage Bicycle',
      swappedFor: 'Film Camera',
      partner: 'Jordan Lee',
      date: 'March 28, 2026',
      status: 'completed',
    },
    {
      id: '2',
      item: 'Book Collection',
      swappedFor: 'Vinyl Records',
      partner: 'Maya Rodriguez',
      date: 'March 15, 2026',
      status: 'completed',
    },
    {
      id: '3',
      item: 'Desk Lamp',
      swappedFor: 'Plant Pot',
      partner: 'Alex Turner',
      date: 'February 22, 2026',
      status: 'completed',
    },
  ];

  const reviews = [
    {
      id: '1',
      reviewer: 'Jordan Lee',
      rating: 5,
      comment: 'Great experience! Sarah was very responsive and the item was exactly as described. Smooth transaction!',
      date: 'March 29, 2026',
      swapItem: 'Vintage Bicycle',
    },
    {
      id: '2',
      reviewer: 'Maya Rodriguez',
      rating: 5,
      comment: 'Wonderful person to trade with. Very friendly and professional. Would definitely swap again!',
      date: 'March 16, 2026',
      swapItem: 'Book Collection',
    },
    {
      id: '3',
      reviewer: 'Alex Turner',
      rating: 4,
      comment: 'Good swap, item was in good condition. Communication could have been faster but overall positive experience.',
      date: 'February 23, 2026',
      swapItem: 'Desk Lamp',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar variant="authenticated" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-5xl font-semibold mb-4 relative">
                SC
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-olive rounded-full flex items-center justify-center text-white hover:bg-olive/90 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-trust-verified flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-muted-foreground">Verified Member</span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Sarah Chen
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Portland, OR</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since March 2024</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4 mb-6">
                  <Textarea
                    label="Bio"
                    placeholder="Tell the community about yourself..."
                    defaultValue="Photography enthusiast and vintage camera collector. I love finding new homes for my cameras and discovering unique items. Always happy to chat about film photography!"
                  />
                  <div className="flex gap-2">
                    <Button variant="olive" size="sm" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mb-6">
                  Photography enthusiast and vintage camera collector. I love finding new homes for my cameras and discovering unique items. Always happy to chat about film photography!
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-semibold text-trust-gold">4.9</span>
                    <Star className="w-5 h-5 text-trust-gold fill-current" />
                  </div>
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold mb-1">47</p>
                  <p className="text-sm text-muted-foreground">Total Swaps</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold mb-1">12</p>
                  <p className="text-sm text-muted-foreground">Active Items</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold mb-1">2 hrs</p>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'items'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              My Items
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'swaps'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Swap History
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-olive text-olive font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'items' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Active Listings</h2>
                <Button variant="olive">
                  <Package className="w-4 h-4" />
                  Add New Item
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Completed Swaps</h2>
              <div className="space-y-4">
                {swapHistory.map((swap) => (
                  <div key={swap.id} className="bg-card border border-border rounded-xl p-6 hover:border-olive/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold mb-1">
                          {swap.item} ↔ {swap.swappedFor}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Swapped with {swap.partner} • {swap.date}
                        </p>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Community Feedback</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold mb-1">{review.reviewer}</p>
                        <p className="text-sm text-muted-foreground">
                          Swap: {review.swapItem}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < review.rating ? 'text-trust-gold fill-current' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-8">
                {/* Account Info */}
                <div>
                  <h3 className="font-semibold mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue="Sarah" />
                      <Input label="Last Name" defaultValue="Chen" />
                    </div>
                    <Input label="Email" type="email" defaultValue="sarah.chen@example.com" />
                    <Input label="City" defaultValue="Portland, OR" />
                  </div>
                </div>

                {/* Password */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Security</h3>
                  <div className="space-y-4">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>New swap offers</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-olive focus:ring-olive" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Messages</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-olive focus:ring-olive" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>New reviews</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-olive focus:ring-olive" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Weekly digest</span>
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-olive focus:ring-olive" />
                    </label>
                  </div>
                </div>

                {/* Save */}
                <div className="pt-6">
                  <Button variant="olive">Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
