import { Link } from 'react-router';
import { Github, Twitter, Instagram, Mail, ShieldCheck, MapPin, Phone, Scale, Lock, ShieldAlert, FileText, Search, Plus, Tag, User, MessageSquare, Heart, History } from 'lucide-react';
import logoImage from './logo.png';
import { useLanguage } from '../LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/kadiyasmine77-hub', label: 'Github' },
  ];

  return (
    <footer className="bg-neutral-100 text-neutral-900 pt-12 pb-6 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img src={logoImage} alt="SwapMarket" className="h-10 w-auto" />
            </Link>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:border-olive transition-all duration-300 group shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-neutral-600 group-hover:text-olive group-hover:scale-110 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-olive mb-6">
              {t('footer.market')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-2 text-neutral-600 hover:text-olive transition-colors group">
                <Search className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/search">{t('user_nav.search')}</Link>
              </li>
              <li className="flex items-center gap-2 text-neutral-600 hover:text-olive transition-colors group">
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/publish">{t('user_nav.publish')}</Link>
              </li>
              <li className="flex items-center gap-2 text-neutral-600 hover:text-olive transition-colors group">
                <Tag className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/search">{t('footer.categories')}</Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-olive mb-6">
              {t('nav.profile')}
            </h4>
            <ul className="space-y-4 text-sm text-neutral-600">
              <li className="flex items-center gap-2 hover:text-olive transition-colors group">
                <User className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/profile">{t('nav.profile')}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-olive transition-colors group">
                <MessageSquare className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/messages">{t('user_nav.messages')}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-olive transition-colors group">
                <Heart className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/favorites">{t('user_nav.favorites')}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-olive transition-colors group">
                <History className="w-4 h-4 text-neutral-400 group-hover:text-olive" />
                <Link to="/user/history">{t('user_nav.history')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-olive mb-6">
              {t('footer.community')}
            </h4>
            <ul className="space-y-4 text-sm text-neutral-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('footer.address'))}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-olive transition-colors"
                >
                  {t('footer.address')}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <a 
                  href={`https://wa.me/${t('footer.phone').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-olive transition-colors"
                >
                  {t('footer.phone')}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <a href={`mailto:${t('footer.email')}`} className="hover:text-olive transition-colors">
                  {t('footer.email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
          <p>© {currentYear} SwapMarket. {t('common.all_rights_reserved')}</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
