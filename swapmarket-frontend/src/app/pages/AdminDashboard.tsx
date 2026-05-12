import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  FolderTree,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  MoreVertical,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type Tab = 'dashboard' | 'users' | 'items' | 'reports' | 'categories' | 'logs';

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', trend: 'up', icon: Users },
    { label: 'Active Items', value: '3,847', change: '+8%', trend: 'up', icon: Package },
    { label: 'Total Swaps', value: '24,592', change: '+18%', trend: 'up', icon: TrendingUp },
    { label: 'Pending Reports', value: '23', change: '-5%', trend: 'down', icon: Flag },
  ];

  const recentUsers = [
    { id: '1', name: 'Emma Watson', email: 'emma.w@email.com', joined: '2 hours ago', status: 'active', trustScore: 0 },
    { id: '2', name: 'Michael Brown', email: 'michael.b@email.com', joined: '5 hours ago', status: 'active', trustScore: 0 },
    { id: '3', name: 'Sophia Garcia', email: 'sophia.g@email.com', joined: '1 day ago', status: 'active', trustScore: 0 },
  ];

  const flaggedItems = [
    { id: '1', title: 'Vintage Camera', owner: 'John Doe', reason: 'Misleading description', status: 'pending', reported: '2 hours ago' },
    { id: '2', title: 'Designer Chair', owner: 'Jane Smith', reason: 'Fake brand', status: 'pending', reported: '5 hours ago' },
    { id: '3', title: 'Book Collection', owner: 'Bob Johnson', reason: 'Inappropriate content', status: 'reviewing', reported: '1 day ago' },
  ];

  const reports = [
    { id: '1', type: 'User', target: 'Sarah Chen', reason: 'Spam messages', reporter: 'Alex Turner', date: '1 hour ago', status: 'pending' },
    { id: '2', type: 'Item', target: 'Vintage Bicycle', reason: 'Counterfeit item', reporter: 'Maya Rodriguez', date: '3 hours ago', status: 'reviewing' },
    { id: '3', type: 'Message', target: 'Chat conversation', reason: 'Harassment', reporter: 'Jordan Lee', date: '5 hours ago', status: 'pending' },
  ];

  const categories = [
    { id: '1', name: 'Photography', itemCount: 234, status: 'active' },
    { id: '2', name: 'Furniture', itemCount: 189, status: 'active' },
    { id: '3', name: 'Books', itemCount: 456, status: 'active' },
    { id: '4', name: 'Music', itemCount: 167, status: 'active' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Admin Panel</h2>
                <p className="text-xs text-sidebar-foreground/60">SwapMarket</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'items', label: 'Items', icon: Package },
              { id: 'reports', label: 'Reports', icon: Flag },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'logs', label: 'Activity Logs', icon: Activity },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-black/5 hover:text-black/80 dark:hover:bg-white/5 dark:hover:text-white/80'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => onNavigate('landing')}
            className="w-full px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors text-left"
          >
            {!sidebarCollapsed ? 'Exit Admin' : '←'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-6">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'items' && 'Item Moderation'}
            {activeTab === 'reports' && 'Reports'}
            {activeTab === 'categories' && 'Category Management'}
            {activeTab === 'logs' && 'Activity Logs'}
          </h1>
        </header>

        <main className="p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-olive/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-olive" />
                      </div>
                      <Badge variant={stat.trend === 'up' ? 'success' : 'warning'} size="sm">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-3xl font-semibold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold mb-4">Recent Users</h2>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="success" size="sm">{user.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{user.joined}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged Items */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold mb-4">Flagged Items</h2>
                  <div className="space-y-4">
                    {flaggedItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">by {item.owner}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                        </div>
                        <Badge variant="warning" size="sm">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-4 text-sm font-semibold">User</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Email</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Trust Score</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Swaps</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sarah Chen', email: 'sarah.c@email.com', trust: 4.9, swaps: 47, status: 'active', verified: true },
                        { name: 'Marcus Johnson', email: 'marcus.j@email.com', trust: 4.7, swaps: 32, status: 'active', verified: true },
                        { name: 'Emma Rodriguez', email: 'emma.r@email.com', trust: 4.8, swaps: 28, status: 'active', verified: false },
                        { name: 'Alex Turner', email: 'alex.t@email.com', trust: 4.6, swaps: 19, status: 'suspended', verified: true },
                      ].map((user, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                                {user.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                {user.verified && (
                                  <div className="flex items-center gap-1 text-xs text-trust-verified">
                                    <Shield className="w-3 h-3" />
                                    Verified
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-trust-gold">{user.trust}</span>
                          </td>
                          <td className="px-6 py-4 text-sm">{user.swaps}</td>
                          <td className="px-6 py-4">
                            <Badge variant={user.status === 'active' ? 'success' : 'danger'} size="sm">
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-4 text-sm font-semibold">Item</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Owner</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Category</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Posted</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flaggedItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-destructive mt-1">Flagged: {item.reason}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{item.owner}</td>
                          <td className="px-6 py-4 text-sm">Photography</td>
                          <td className="px-6 py-4">
                            <Badge variant="warning" size="sm">{item.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">{item.reported}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button variant="olive" size="sm">
                                <CheckCircle className="w-3 h-3" />
                                Approve
                              </Button>
                              <Button variant="danger" size="sm">
                                <XCircle className="w-3 h-3" />
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-4 text-sm font-semibold">Type</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Target</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Reason</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Reporter</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <Badge variant="default" size="sm">{report.type}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">{report.target}</td>
                          <td className="px-6 py-4 text-sm">{report.reason}</td>
                          <td className="px-6 py-4 text-sm">{report.reporter}</td>
                          <td className="px-6 py-4 text-sm">{report.date}</td>
                          <td className="px-6 py-4">
                            <Badge variant={report.status === 'pending' ? 'warning' : 'olive'} size="sm">
                              {report.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="olive" size="sm">
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">Manage marketplace categories</p>
                <Button variant="olive">
                  Add Category
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-4 text-sm font-semibold">Category Name</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Item Count</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-6 py-4 font-medium">{category.name}</td>
                          <td className="px-6 py-4 text-sm">{category.itemCount} items</td>
                          <td className="px-6 py-4">
                            <Badge variant="success" size="sm">{category.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-4">
                {[
                  { action: 'User suspended', user: 'admin@swapmarket.com', target: 'Alex Turner', time: '10 minutes ago' },
                  { action: 'Item removed', user: 'admin@swapmarket.com', target: 'Vintage Camera', time: '1 hour ago' },
                  { action: 'Report resolved', user: 'admin@swapmarket.com', target: 'Report #1234', time: '2 hours ago' },
                  { action: 'Category created', user: 'admin@swapmarket.com', target: 'Collectibles', time: '1 day ago' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-olive" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.user} • {log.target}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
