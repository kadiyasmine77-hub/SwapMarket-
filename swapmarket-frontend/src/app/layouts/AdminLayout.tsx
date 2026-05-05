import { Outlet, Link, useLocation } from "react-router";
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
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { mockCurrentUser } from "../lib/mockData";
import logoImage from "../components/logo.png";
import { useLanguage } from "../LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Footer } from "../components/Footer";

export function AdminLayout() {
  const location = useLocation();
  const { t } = useLanguage();

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
    { path: "/admin/reports", icon: Flag, label: t('admin_nav.reports') },
    { path: "/admin/logs", icon: FileText, label: t('admin_nav.logs') },
    { path: "/admin/settings", icon: Settings, label: t('admin_nav.settings') },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-full flex-col">
          {/* Logo & Return Arrow */}
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <Link to="/user" title={t('admin_nav.back')}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <img src={logoImage} alt="SwapMarket" className="h-9 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}>
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

          {/* Language Switcher */}
          <div className="px-6 py-3 border-t">
            <LanguageSwitcher />
          </div>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockCurrentUser.avatar} alt={mockCurrentUser.name} />
                <AvatarFallback>{mockCurrentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{mockCurrentUser.name}</div>
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
      <main className="ml-64 flex-1">
        <div className="mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
