import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Search, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function ActivityLogs() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAllLogs(data);
        }
      } catch (error) {
        console.error("Erreur fetch logs:", error);
        toast.error(t('logs.error_fetch'));
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === "all" ||
      log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    if (action.includes("Suspendu") || action.includes("Supprimé") || action.includes("Banni")) {
      return <Badge variant="destructive">{action}</Badge>;
    } else if (action.includes("Créé") || action.includes("Approuvé") || action.includes("Réactivé")) {
      return <Badge>{action}</Badge>;
    } else if (action.includes("Modifié")) {
      return <Badge variant="secondary">{action}</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast.error(t('logs.error_no_data_export'));
      return;
    }

    const headers = [t('admin_dashboard.table.user'), t('admin_dashboard.table.type'), t('admin_dashboard.table.target'), t('admin_dashboard.table.date'), t('reports.details')];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        `"${log.admin}"`,
        `"${log.action}"`,
        `"${log.target}"`,
        `"${log.timestamp}"`,
        `"${log.details || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `logs-swapmarket-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t('logs.success_export'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t('admin_nav.logs')}</h1>
          <p className="text-neutral-600">
            {t('logs.history_desc', { count: filteredLogs.length })}
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-5 w-5" />
          {t('admin.export')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        {[
          { 
            label: t('logs.stat_total'), 
            value: allLogs.length, 
            color: "bg-blue-50 text-blue-600" 
          },
          { 
            label: t('logs.stat_today'), 
            value: allLogs.filter(l => {
              const d = new Date(l.timestamp);
              const today = new Date();
              return d.getDate() === today.getDate() && 
                     d.getMonth() === today.getMonth() && 
                     d.getFullYear() === today.getFullYear();
            }).length, 
            color: "bg-green-50 text-green-600" 
          },
          { 
            label: t('logs.stat_week'), 
            value: allLogs.filter(l => {
              const d = new Date(l.timestamp);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return d >= weekAgo;
            }).length, 
            color: "bg-purple-50 text-purple-600" 
          },
          { 
            label: t('logs.stat_month'), 
            value: allLogs.filter(l => {
              const d = new Date(l.timestamp);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return d >= monthAgo;
            }).length, 
            color: "bg-orange-50 text-orange-600" 
          },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder={t('logs.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('logs.filter_all')}</SelectItem>
            <SelectItem value="créé">{t('logs.filter_create')}</SelectItem>
            <SelectItem value="modifié">{t('logs.filter_update')}</SelectItem>
            <SelectItem value="supprimé">{t('logs.filter_delete')}</SelectItem>
            <SelectItem value="suspendu">{t('logs.filter_suspend')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.user')}</TableHead>
              <TableHead>{t('admin_dashboard.table.type')}</TableHead>
              <TableHead>{t('admin_dashboard.table.target')}</TableHead>
              <TableHead>{t('admin_dashboard.table.date_time')}</TableHead>
              <TableHead>{t('reports.details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">{t('common.loading')}</TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">{t('logs.no_logs')}</TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-neutral-600" />
                      </div>
                      <span className="font-medium">{log.admin}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="font-medium">{log.target}</TableCell>
                  <TableCell className="text-neutral-600">{log.timestamp}</TableCell>
                  <TableCell className="text-sm text-neutral-600">{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Timeline View */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">{t('logs.timeline_view')}</h2>
        <div className="space-y-4">
          {filteredLogs.slice(0, 5).map((log, idx) => (
            <div key={log.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-600 p-2">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                {idx < 4 && <div className="mt-2 h-full w-px bg-neutral-200"></div>}
              </div>
              <div className="flex-1 pb-6">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{log.admin}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-sm text-neutral-500">{log.timestamp}</span>
                </div>
                <p className="mb-1 text-neutral-900">
                  {log.action} <span className="font-medium">{log.target}</span>
                </p>
                <p className="text-sm text-neutral-600">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
