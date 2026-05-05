import { Link } from 'react-router';
import { Github, Twitter, Instagram, Mail, ShieldCheck, MapPin, Phone } from 'lucide-react';
import logoImage from './logo.png';
import { useLanguage } from '../LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'Github' },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white rounded-lg p-1.5 transition-transform group-hover:scale-105">
                <img src={logoImage} alt="SwapMarket" className="h-7 w-auto" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Swap<span className="text-olive">Market</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-olive hover:border-olive transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
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
              <li><Link to="/explore" className="text-white/70 hover:text-white transition-colors">{t('footer.explore')}</Link></li>
              <li><Link to="/categories" className="text-white/70 hover:text-white transition-colors">{t('footer.categories')}</Link></li>
              <li><Link to="/#how-it-works" className="text-white/70 hover:text-white transition-colors">{t('footer.how_it_works')}</Link></li>
              <li>
                <Link to="/trust" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4 text-olive" />
                  {t('footer.trust_safety')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-olive mb-6">
              {t('footer.community')}
            </h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-olive shrink-0" />
                <a href={`mailto:${t('footer.email')}`} className="hover:text-white transition-colors">
                  {t('footer.email')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-olive mb-6">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/terms" className="text-white/70 hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/rules" className="text-white/70 hover:text-white transition-colors">{t('footer.rules')}</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
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
