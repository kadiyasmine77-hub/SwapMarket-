import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Users, Package, TrendingUp, MessageSquare, ArrowUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { API_BASE_URL } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
      {
        label: t('admin_dashboard.stats.stat_users'),
        value: stats.users_actifs,
        total: stats.users,
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "+12%",
      },
      {
        label: t('admin_dashboard.stats.stat_items'),
        value: stats.objets_dispo,
        total: stats.objets,
        icon: Package,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "+8%",
      },
      {
        label: t('admin_dashboard.stats.stat_swaps'),
        value: stats.echanges_valides,
        total: stats.echanges,
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: "+15%",
      },
      {
        label: t('admin_dashboard.stats.stat_reviews'),
        value: stats.avis,
        total: stats.messages,
        icon: MessageSquare,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: "+5%",
      },
    ]
    : [];

  // Build chart data from API
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const exchangesByMonth: any[] = stats?.echanges_par_mois?.map((item: any) => ({
    date: monthNames[item.mois - 1],
    exchanges: item.total,
  })) ?? [];

  const categoriesData: any[] = (stats?.objets_par_categorie ?? [])
    .sort((a: any, b: any) => {
      const nameA = a.nom.toLowerCase();
      const nameB = b.nom.toLowerCase();
      if (nameA === 'autre' || nameA === 'other') return 1;
      if (nameB === 'autre' || nameB === 'other') return -1;
      return nameA.localeCompare(nameB);
    })
    .map((item: any) => ({
      category: item.nom,
      count: item.total,
    }));

  const PIE_COLORS = ['#14213d', '#ef4444'];

  const pieChartData = stats ? [
    { name: t('admin_dashboard.charts.status_active', { defaultValue: 'Actifs' }), value: stats.users_actifs || 0 },
    { name: t('admin_dashboard.charts.status_suspended', { defaultValue: 'Suspendus' }), value: stats.users_suspendus || 0 }
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('admin_dashboard.sidebar.dashboard')}</h1>
        <p className="text-neutral-600">{t('admin_dashboard.desc')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-6 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-neutral-200 mb-4" />
              <div className="h-4 w-24 bg-neutral-200 rounded mb-2" />
              <div className="h-8 w-16 bg-neutral-200 rounded" />
            </div>
          ))
          : statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-full ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value ?? 0}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {t('admin_dashboard.stats.stat_total_of', { total: stat.total ?? 0 })}
                </p>
              </div>
            );
          })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="media-container p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-bold">{t('admin_dashboard.charts.swaps')}</h2>
          {exchangesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 280}>
              <LineChart data={exchangesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="exchanges" stroke="#2d80d3" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 sm:h-64 items-center justify-center text-neutral-400">{t('admin_dashboard.charts.no_data')}</div>
          )}
        </div>

        <div className="media-container p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-bold">{t('admin_dashboard.charts.categories')}</h2>
          {categoriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 280}>
              <BarChart data={categoriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="category" stroke="#737373" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#14213d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 sm:h-64 items-center justify-center text-neutral-400">{t('admin_dashboard.charts.no_data')}</div>
          )}
        </div>
      </div>

      {/* Circle Graph (Pie Chart) */}
      <div className="media-container p-4 sm:p-6 mt-4 sm:mt-6">
        <h2 className="mb-4 text-xl font-bold">{t('admin_dashboard.charts.users_distribution', { defaultValue: 'Répartition des utilisateurs' })}</h2>
        {pieChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-48 sm:h-64 items-center justify-center text-neutral-400">{t('admin_dashboard.charts.no_data')}</div>
        )}
      </div>

      {/* Summary */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 flex items-center gap-4">
            <div className="rounded-full bg-yellow-50 p-3">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">{t('admin_dashboard.stats.pending_swaps')}</p>
              <p className="text-2xl font-bold">{stats.echanges_en_attente}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 flex items-center gap-4">
            <div className="rounded-full bg-red-50 p-3">
              <Users className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">{t('admin_dashboard.stats.suspended_users')}</p>
              <p className="text-2xl font-bold">{stats.users_suspendus}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 flex items-center gap-4">
            <div className="rounded-full bg-blue-50 p-3">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">{t('admin_dashboard.stats.total_reviews')}</p>
              <p className="text-2xl font-bold">{stats.avis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
