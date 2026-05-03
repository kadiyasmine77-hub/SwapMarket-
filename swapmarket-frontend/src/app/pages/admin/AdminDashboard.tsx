import { Card } from "../../components/ui/card";
import { Users, Package, TrendingUp, Flag, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockAdminStats } from "../../lib/mockData";

const activityData = [
  { date: "Lun", exchanges: 12, items: 24, users: 8 },
  { date: "Mar", exchanges: 19, items: 32, users: 15 },
  { date: "Mer", exchanges: 15, items: 28, users: 12 },
  { date: "Jeu", exchanges: 22, items: 35, users: 18 },
  { date: "Ven", exchanges: 28, items: 42, users: 22 },
  { date: "Sam", exchanges: 32, items: 48, users: 25 },
  { date: "Dim", exchanges: 25, items: 38, users: 16 },
];

export function AdminDashboard() {
  const stats = [
    {
      label: "Utilisateurs actifs",
      value: mockAdminStats.activeUsers,
      total: mockAdminStats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
      isUp: true,
    },
    {
      label: "Annonces actives",
      value: mockAdminStats.activeItems,
      total: mockAdminStats.totalItems,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+8%",
      isUp: true,
    },
    {
      label: "Échanges réalisés",
      value: mockAdminStats.completedExchanges,
      total: mockAdminStats.totalExchanges,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+15%",
      isUp: true,
    },
    {
      label: "Signalements en attente",
      value: mockAdminStats.pendingReports,
      total: mockAdminStats.resolvedReports + mockAdminStats.pendingReports,
      icon: Flag,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "-3%",
      isUp: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Dashboard Administrateur</h1>
        <p className="text-neutral-600">Vue d'ensemble de la plateforme TrocPlateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-full ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.isUp ? "text-green-600" : "text-red-600"}`}>
                  {stat.isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-neutral-500">sur {stat.total} au total</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Activité de la semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="exchanges" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="items" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#9333ea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
              <span className="text-neutral-600">Échanges</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600"></div>
              <span className="text-neutral-600">Annonces</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-600"></div>
              <span className="text-neutral-600">Utilisateurs</span>
            </div>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Catégories populaires</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { category: "Électronique", count: 145 },
                { category: "Vêtements", count: 312 },
                { category: "Livres", count: 198 },
                { category: "Maison", count: 267 },
                { category: "Sports", count: 89 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="category" stroke="#737373" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Activité récente</h2>
        <div className="space-y-3">
          {[
            {
              user: "Sophie Martin",
              action: "a publié un nouvel objet",
              item: "Appareil photo Canon",
              time: "Il y a 5 min",
            },
            {
              user: "Marc Dupont",
              action: "a complété un échange avec",
              item: "Julie Bernard",
              time: "Il y a 12 min",
            },
            {
              user: "Pierre Leroy",
              action: "s'est inscrit sur la plateforme",
              item: "",
              time: "Il y a 25 min",
            },
            {
              user: "Emma Rousseau",
              action: "a signalé une annonce",
              item: "Contenu inapproprié",
              time: "Il y a 1 h",
            },
            {
              user: "Thomas Petit",
              action: "a laissé un avis 5★",
              item: "pour Claire Moreau",
              time: "Il y a 2 h",
            },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3 border-b pb-3 last:border-0">
              <div className="h-10 w-10 rounded-full bg-neutral-100"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-neutral-600">{activity.action}</span>{" "}
                  {activity.item && <span className="font-medium">{activity.item}</span>}
                </p>
                <span className="text-xs text-neutral-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
