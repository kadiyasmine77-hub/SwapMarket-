import { Outlet, Link, useLocation } from "react-router";
import logoImage from "../../assets/logo.png";
import { Home, Search, Plus, MessageSquare, Heart, History, User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { getStorageUrl } from "../config";
import { useLanguage } from "../LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { toast } from "sonner";

// Had l-layouthowa li kay-dir s-smiya o l-menu d-navigation dyal l-utilisateur (User)
export function UserLayout() {
  const location = useLocation();
  const { t } = useLanguage();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : { nom_complet: 'Utilisateur', photo_profil: null };

  // Had l-fonction kat-chof wash l-page li l-user fiha db hiya l-page d-link bash t-biynha active
  const isActive = (path: string) => {
    if (path === "/user") {
      return location.pathname === "/user";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/user", icon: Home, label: t('user_nav.home') },
    { path: "/user/search", icon: Search, label: t('user_nav.search') },
    { path: "/user/publish", icon: Plus, label: t('user_nav.publish') },
    { path: "/user/messages", icon: MessageSquare, label: t('user_nav.messages') },
    { path: "/user/favorites", icon: Heart, label: t('user_nav.favorites') },
    { path: "/user/history", icon: History, label: t('user_nav.history') },
  ];

    // Had l-fonction kat-khwi l-localStorage o kat-khrej l-user mn site
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link to="/user" className="flex items-center">
              <img src={logoImage} alt="SwapMarket" className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {currentUser.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" className="gap-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold hidden sm:flex">
                    {t('nav.admin_panel')}
                  </Button>
                </Link>
              )}
              <Link to="/user/profile">
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getStorageUrl(currentUser.photo_profil) || undefined} alt={currentUser.nom_complet} />
                    <AvatarFallback>{currentUser.nom_complet.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{currentUser.nom_complet}</span>
                </Button>
              </Link>
              <Link to="/" onClick={handleLogout}>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" title={t('nav.logout')} />
                </Button>
              </Link>
            </div>
          </div>
        </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isBlockedForAdmin = currentUser?.role === 'admin' && ['/user/publish', '/user/messages', '/user/favorites', '/user/history'].includes(item.path);

              // Had l-fonction kat-blokki l-admin bash ma-ydirsh shi hwayej d-users 3adiyin
              const handleClick = (e: React.MouseEvent) => {
                if (isBlockedForAdmin) {
                  e.preventDefault();
                  toast.info("Vous êtes connecté en tant qu'administrateur. Cette action est réservée aux comptes utilisateurs.");
                }
              };

              return (
                <Link key={item.path} to={item.path} onClick={handleClick}>
                  <button
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                      active
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
