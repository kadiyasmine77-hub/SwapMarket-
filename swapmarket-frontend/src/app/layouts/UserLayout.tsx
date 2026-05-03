import { Outlet, Link, useLocation } from "react-router";
import logoImage from "../components/logo.png";
import { Home, Search, Plus, MessageSquare, Heart, History, User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { getStorageUrl } from "../config";



export function UserLayout() {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : { nom_complet: 'Utilisateur', photo_profil: null };

  const isActive = (path: string) => {
    if (path === "/user") {
      return location.pathname === "/user";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/user", icon: Home, label: "Accueil" },
    { path: "/user/search", icon: Search, label: "Rechercher" },
    { path: "/user/publish", icon: Plus, label: "Publier" },
    { path: "/user/messages", icon: MessageSquare, label: "Messages" },
    { path: "/user/favorites", icon: Heart, label: "Favoris" },
    { path: "/user/history", icon: History, label: "Historique" },
  ];

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
                  <LogOut className="h-5 w-5" />
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
              return (
                <Link key={item.path} to={item.path}>
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
