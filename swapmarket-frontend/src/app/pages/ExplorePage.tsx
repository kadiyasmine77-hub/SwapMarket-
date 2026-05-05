import { useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { ItemCard } from '../components/ItemCard';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useLanguage } from '../LanguageContext';

interface ExplorePageProps {
  onNavigate: (page: string) => void;
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const items = [
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
      title: 'Mid-Century Modern Lounge Chair',
      category: 'Furniture',
      condition: 'Good' as const,
      location: 'Austin, TX',
      postedDate: '1 week ago',
      imageUrl: 'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Marcus Johnson',
      ownerTrustScore: 4.7,
      isVerified: true,
    },
    {
      id: '3',
      title: 'Vintage Hardcover Book Set',
      category: 'Books',
      condition: 'Fair' as const,
      location: 'Boston, MA',
      postedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1773425350191-ff05d7e59e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Emma Rodriguez',
      ownerTrustScore: 4.8,
      isVerified: false,
    },
    {
      id: '4',
      title: 'Vinyl Record Collection',
      category: 'Music',
      condition: 'Like New' as const,
      location: 'Seattle, WA',
      postedDate: '5 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1684248022540-459c648ec197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'David Kim',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
    {
      id: '5',
      title: 'Vintage Leica Camera',
      category: 'Photography',
      condition: 'Good' as const,
      location: 'San Francisco, CA',
      postedDate: '1 day ago',
      imageUrl: 'https://images.unsplash.com/photo-1774888341203-0c914478ff8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Alex Turner',
      ownerTrustScore: 4.6,
      isVerified: true,
    },
    {
      id: '6',
      title: 'Modern Wooden Chair',
      category: 'Furniture',
      condition: 'New' as const,
      location: 'Denver, CO',
      postedDate: '4 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1771573753404-0f99dbccd842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Olivia Park',
      ownerTrustScore: 4.8,
      isVerified: true,
    },
    {
      id: '7',
      title: 'Antique Book Collection',
      category: 'Books',
      condition: 'Good' as const,
      location: 'New York, NY',
      postedDate: '2 weeks ago',
      imageUrl: 'https://images.unsplash.com/photo-1772976811682-465df3b8c735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'James Wilson',
      ownerTrustScore: 4.7,
      isVerified: false,
    },
    {
      id: '8',
      title: 'Indoor Plant Collection',
      category: 'Home & Garden',
      condition: 'Like New' as const,
      location: 'Los Angeles, CA',
      postedDate: '6 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1611866759729-0cba525f9b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ownerName: 'Sophie Martinez',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
  ];

  const categories = ['Photography', 'Furniture', 'Books', 'Music', 'Home & Garden', 'Sports', 'Art', 'Electronics'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
  };

  return (
    <div className="min-h-screen">
      <Navbar variant="authenticated" currentPage="explore" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('explore.title')}
          </h1>
          <p className="text-muted-foreground">{t('explore.subtitle')}</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <SearchBar className="flex-1" />
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t('search.filters')}</span>
            {(selectedCategories.length > 0 || selectedConditions.length > 0) && (
              <Badge variant="olive" size="sm">
                {selectedCategories.length + selectedConditions.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || selectedConditions.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="olive" className="cursor-pointer" onClick={() => toggleCategory(category)}>
                {category}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedConditions.map((condition) => (
              <Badge key={condition} variant="olive" className="cursor-pointer" onClick={() => toggleCondition(condition)}>
                {condition}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            <button onClick={clearFilters} className="text-sm text-olive hover:underline">
              {t('explore.clear_all')}
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t('search.filters')}
                </h2>
                <button onClick={clearFilters} className="text-sm text-olive hover:underline">
                  {t('explore.clear')}
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">{t('search.category')}</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-border text-olive focus:ring-olive"
                      />
                      <span className="text-sm group-hover:text-olive transition-colors">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">{t('search.condition')}</h3>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <label key={condition} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggleCondition(condition)}
                        className="w-4 h-4 rounded border-border text-olive focus:ring-olive"
                      />
                      <span className="text-sm group-hover:text-olive transition-colors">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Range */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">{t('explore.distance')}</h3>
                <select className="w-full px-3 py-2 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  <option>{t('explore.within_10')}</option>
                  <option>{t('explore.within_25')}</option>
                  <option>{t('explore.within_50')}</option>
                  <option>{t('explore.within_100')}</option>
                  <option>{t('explore.anywhere')}</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Items Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {t('explore.items_available', { count: items.length })}
              </p>
              <select className="px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                <option>{t('explore.sort_recent')}</option>
                <option>{t('explore.sort_distance')}</option>
                <option>{t('explore.sort_trust')}</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} onClick={() => onNavigate('item-detail')} className="cursor-pointer">
                  <ItemCard {...item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button variant="secondary" size="sm" disabled>
                {t('explore.previous')}
              </Button>
              <Button variant="olive" size="sm">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <Button variant="secondary" size="sm">
                {t('explore.next')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
