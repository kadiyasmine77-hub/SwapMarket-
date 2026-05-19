import { Outlet, Link, useLocation, Navigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Flag,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ArrowRightLeft,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

import logoImage from "../../assets/logo.png";
import { useLanguage } from "../LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

// Had layout  dyal ladmin fih sidebar o lmenu dyal ga3 lfonctions dyal ladmin
export function AdminLayout() {
  const location = useLocation();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Hna kanchofo wash l-user raah admin, ila mshih kankhrjoh
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-card border rounded-lg shadow-sm">
          <h1 className="text-6xl font-bold text-destructive mb-4">403</h1>
          <p className="text-xl text-muted-foreground mb-2">Accès refusé</p>
          <p className="text-sm text-muted-foreground mb-4">Vous n'avez pas les autorisations nécessaires pour accéder à cet espace.</p>
          <Link to="/" className="text-primary hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Had lfonction katchof wash lpage admin fiha hiya li flink bash t-biynha active
  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: t('admin_nav.dashboard') },
    { path: "/admin/users", icon: Users, label: t('admin_nav.users') },
    { path: "/admin/items", icon: Package, label: t('admin_nav.items') },
    { path: "/admin/categories", icon: Tag, label: t('admin_nav.categories') },
    { path: "/admin/echanges", icon: ArrowRightLeft, label: t('admin_nav.echanges') },
    { path: "/admin/reports", icon: Flag, label: t('admin_nav.reports') },
    { path: "/admin/logs", icon: FileText, label: t('admin_nav.logs') },
    { path: "/admin/settings", icon: Settings, label: t('admin_nav.settings') },
  ];

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Mobile Toggle Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Return Arrow & Close button for mobile */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-3">
              <Link to="/user" title={t('admin_nav.back')}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <img src={logoImage} alt="SwapMarket" className="h-9 w-auto" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <button
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photo_profil ? `http://localhost:8000/storage/${user.photo_profil}` : undefined} alt={user.nom_complet || "Admin"} />
                <AvatarFallback>{user.nom_complet ? user.nom_complet[0] : "A"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{user.nom_complet || "Admin"}</div>
                <div className="truncate text-xs text-neutral-500">{t('admin.role_admin')}</div>
              </div>
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" title={t('nav.logout')} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-neutral-600" />
            </Button>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
