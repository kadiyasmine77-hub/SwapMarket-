import { Search, Heart, MessageSquare, User, Menu } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import { Button } from './Button';
import { useState } from 'react';
import { Link } from 'react-router';
import { getStorageUrl } from '../config';
import { useLanguage } from '../LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  variant?: 'public' | 'authenticated';
  currentPage?: string;
}

// Had lcomposant fih lmenu lfoqani dial lsite Navbar li fih ga3 les liens w linfos dial luser li mconnecté
export function Navbar({ variant = 'public', currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImage} alt="SwapMarket" className="h-9 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            {variant === 'authenticated' && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/user/search"
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'explore' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('nav.explore')}
                </Link>
                <Link
                  to="/user/history"
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'swaps' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('nav.my_swaps')}
                </Link>
                <Link
                  to="/user"
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'items' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('nav.my_items')}
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                  >
                    {t('nav.admin_panel')}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block mr-2">
              <LanguageSwitcher />
            </div>

            {variant === 'authenticated' && currentUser && (
              <>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors hidden sm:block">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative hidden sm:block">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-olive rounded-full"></span>
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative hidden sm:block">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
                <Link to="/user/profile" className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive font-medium overflow-hidden border border-olive/20">
                    {currentUser?.photo_profil ? (
                      <img src={getStorageUrl(currentUser.photo_profil)!} alt="" className="w-full h-full object-cover" />
                    ) : (
                      currentUser?.nom_complet?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-foreground">{currentUser?.nom_complet || t('common.user')}</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            {variant === 'authenticated' && currentUser && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {variant === 'authenticated' && mobileMenuOpen && currentUser && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <div className="px-3 mb-2">
                <LanguageSwitcher />
              </div>
              <Link to="/user/search" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                {t('nav.explore')}
              </Link>
              <Link to="/user/history" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                {t('nav.my_swaps')}
              </Link>
              <Link to="/user" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                {t('nav.my_items')}
              </Link>
              <Link to="/user/profile" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary text-olive">
                {t('nav.profile')}
              </Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" className="px-3 py-2 text-sm font-bold rounded-lg bg-red-50 text-red-600 border border-red-100">
                  {t('nav.admin_panel')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
