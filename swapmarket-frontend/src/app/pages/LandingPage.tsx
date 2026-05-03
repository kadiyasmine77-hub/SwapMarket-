import { motion } from 'motion/react';
import { ArrowRight, Shield, Users, Sparkles, Package, TrendingUp, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { ItemCard } from '../components/ItemCard';
import { Badge } from '../components/Badge';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const featuredItems = [
    {
      id: '1',
      title: 'Vintage Canon Camera with 50mm Lens',
      category: 'Photography',
      condition: 'Like New' as const,
      location: 'Portland, OR',
      postedDate: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1768251006072-64038ee8f350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
      imageUrl: 'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ownerName: 'Marcus Johnson',
      ownerTrustScore: 4.7,
      isVerified: true,
    },
    {
      id: '3',
      title: 'Vintage Hardcover Book Collection',
      category: 'Books',
      condition: 'Fair' as const,
      location: 'Boston, MA',
      postedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1773425350191-ff05d7e59e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ownerName: 'Emma Rodriguez',
      ownerTrustScore: 4.8,
      isVerified: false,
    },
    {
      id: '4',
      title: 'Vinyl Record Collection with Turntable',
      category: 'Music',
      condition: 'Like New' as const,
      location: 'Seattle, WA',
      postedDate: '5 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1684248022540-459c648ec197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ownerName: 'David Kim',
      ownerTrustScore: 4.9,
      isVerified: true,
    },
  ];

  const categories = [
    { name: 'Electronics', count: 234, icon: Package },
    { name: 'Furniture', count: 189, icon: Package },
    { name: 'Books', count: 456, icon: Package },
    { name: 'Music', count: 167, icon: Package },
    { name: 'Sports', count: 312, icon: Package },
    { name: 'Art', count: 98, icon: Package },
  ];

  return (
    <div className="min-h-screen">
      <Navbar variant="public" />

      {/* Hero Section - Full Bleed */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1774888350683-6bff17ebd2d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* Brand Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <Badge variant="olive" className="text-sm">
                <Sparkles className="w-3 h-3" />
                Trusted by 50,000+ community members
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Exchange with trust, trade with purpose
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-white/90 mb-8 max-w-xl"
            >
              The peer-to-peer marketplace where items find new life and communities grow stronger through direct exchange.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant="olive"
                size="lg"
                onClick={() => onNavigate('register')}
                className="group"
              >
                Start Trading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('explore')}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                Explore Items
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              How SwapMarket Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent exchange built on community trust
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: 'List Your Items',
                description: 'Share what you have to offer with photos, condition details, and your story.',
              },
              {
                icon: Users,
                title: 'Connect & Propose',
                description: 'Find items you want, propose fair swaps with optional cash adjustments.',
              },
              {
                icon: Shield,
                title: 'Exchange Safely',
                description: 'Meet locally, verify condition, and complete the exchange with confidence.',
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive/10 mb-4">
                  <step.icon className="w-8 h-8 text-olive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Featured Items
              </h2>
              <p className="text-muted-foreground">Curated picks from trusted community members</p>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('explore')}>
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div onClick={() => onNavigate('item-detail')} className="cursor-pointer">
                  <ItemCard {...item} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Browse Categories
            </h2>
            <p className="text-muted-foreground">Discover items across diverse categories</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onNavigate('explore')}
                className="p-6 bg-card border border-border rounded-xl hover:border-olive/30 hover:shadow-md transition-all text-center group"
              >
                <category.icon className="w-8 h-8 text-olive mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} items</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Built on Trust, Powered by Community
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every member earns their trust score through successful swaps, verified identity, and community feedback.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: 'Verified Profiles',
                    description: 'Identity verification and trust scores help you trade with confidence.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Community Reviews',
                    description: 'Real feedback from real exchanges builds reputation over time.',
                  },
                  {
                    icon: Heart,
                    title: 'Fair Exchange',
                    description: 'Transparent negotiation with optional cash adjustments for balanced trades.',
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-olive/10 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-olive" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1774888341203-0c914478ff8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Trust"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Trust Badge Overlay */}
              <div className="absolute top-6 right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trust Score</p>
                    <p className="text-2xl font-semibold text-trust-gold">4.9</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-olive">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of community members exchanging with purpose
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('register')}
                className="bg-white text-olive hover:bg-white/90"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onNavigate('login')}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
