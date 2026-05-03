import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Flag,
  Shield,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { mockCurrentUser } from "../lib/mockData";
import logoImage from "../components/logo.png";

export function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Utilisateurs" },
    { path: "/admin/items", icon: Package, label: "Annonces" },
    { path: "/admin/categories", icon: Tag, label: "Catégories" },
    { path: "/admin/moderation", icon: Flag, label: "Modération" },
    { path: "/admin/roles", icon: Shield, label: "Rôles" },
    { path: "/admin/logs", icon: FileText, label: "Logs" },
    { path: "/admin/settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
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

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockCurrentUser.avatar} alt={mockCurrentUser.name} />
                <AvatarFallback>{mockCurrentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{mockCurrentUser.name}</div>
                <div className="truncate text-xs text-neutral-500">Administrateur</div>
              </div>
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
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
      </main>
    </div>
  );
}
