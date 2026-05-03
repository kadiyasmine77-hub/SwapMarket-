import { Search, Heart, MessageSquare, User, Menu } from 'lucide-react';
import logoImage from './logo.png';
import { Button } from './Button';
import { useState } from 'react';
import { Link } from 'react-router';
import { getStorageUrl } from '../config';

interface NavbarProps {
  variant?: 'public' | 'authenticated';
  currentPage?: string;
}

export function Navbar({ variant = 'public', currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                  Explorer
                </Link>
                <Link
                  to="/user/history"
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'swaps' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mes Trocs
                </Link>
                <Link
                  to="/user"
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'items' ? 'text-olive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mes Objets
                </Link>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
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
                  <span className="hidden lg:block text-sm font-medium text-foreground">{currentUser?.nom_complet || 'Utilisateur'}</span>
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
              <Link to="/user/search" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                Explorer
              </Link>
              <Link to="/user/history" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                Mes Trocs
              </Link>
              <Link to="/user" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary">
                Mes Objets
              </Link>
              <Link to="/user/profile" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary text-olive">
                Mon Profil
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
