import { useState, useEffect } from "react";
import { Flag, CheckCircle, XCircle, Clock, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { Link } from "react-router";
import { useLanguage } from "../../LanguageContext";

export function AdminReports() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/signalements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(t('reports.error_fetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateReportStatus = async (id: number, statut: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/signalements/${id}/statut`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut }),
      });
      
      if (res.ok) {
        toast.success(t('reports.success_update', { status: t(`reports.status_${statut}`) }));
        fetchReports();
      } else {
        toast.error(t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(t('auth.error_server'));
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> {t('reports.status_en_attente')}</Badge>;
      case "traite":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> {t('reports.status_traite')}</Badge>;
      case "rejete":
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-200"><XCircle className="w-3 h-3 mr-1" /> {t('reports.status_rejete')}</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getMotifLabel = (motif: string) => {
    const motifs: Record<string, string> = {
      "spam": t('items.motif_spam'),
      "inapproprie": t('items.motif_inappropriate'),
      "contrefacon": t('items.motif_counterfeit'),
      "arnaque": t('items.motif_scam'),
      "autre": t('items.motif_other')
    };
    return motifs[motif] || motif;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t('admin_nav.reports')}</h1>
          <p className="text-neutral-600">{t('reports.management_desc')}</p>
        </div>
        <Button variant="outline" onClick={fetchReports} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('reports.refresh')}
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports.reported_by')}</TableHead>
              <TableHead>{t('reports.reported_item')}</TableHead>
              <TableHead>{t('items.report_motif')}</TableHead>
              <TableHead>{t('reports.details')}</TableHead>
              <TableHead>{t('admin_dashboard.table.date')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-3">
                      <Flag className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-medium text-lg">{t('reports.no_reports_title')}</p>
                    <p className="text-sm">{t('reports.no_reports_desc')}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id_signalement} className={report.statut === 'en_attente' ? 'bg-red-50/30' : ''}>
                  <TableCell>
                    <div className="font-medium text-sm">{report.user?.nom_complet || t('reports.unknown_user')}</div>
                    <div className="text-xs text-neutral-500">{report.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded overflow-hidden bg-neutral-100 border">
                        {report.objet?.image ? (
                          <img src={getStorageUrl(report.objet.image)!} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <AlertCircle className="h-4 w-4 m-auto text-neutral-400 mt-2" />
                        )}
                      </div>
                      <span className="font-medium text-sm line-clamp-1 max-w-[150px]" title={report.objet?.titre}>
                        {report.objet?.titre || t('reports.deleted_item')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-sm text-neutral-700">{getMotifLabel(report.motif)}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-neutral-600 line-clamp-2 max-w-[200px]" title={report.description}>
                      {report.description || <span className="italic text-neutral-400">{t('reports.no_details')}</span>}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 whitespace-nowrap">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.statut)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <AlertCircle className="h-4 w-4 text-neutral-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {report.objet && (
                          <Link to={`/item/${report.id_objet}`} target="_blank">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              {t('items.view_annonce')}
                            </DropdownMenuItem>
                          </Link>
                        )}
                        <DropdownMenuSeparator />
                        {report.statut !== 'traite' && (
                          <DropdownMenuItem onClick={() => updateReportStatus(report.id_signalement, 'traite')} className="cursor-pointer text-green-600 focus:text-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {t('reports.action_traite')}
                          </DropdownMenuItem>
                        )}
                        {report.statut !== 'rejete' && (
                          <DropdownMenuItem onClick={() => updateReportStatus(report.id_signalement, 'rejete')} className="cursor-pointer">
                            <XCircle className="mr-2 h-4 w-4" />
                            {t('reports.action_rejete')}
                          </DropdownMenuItem>
                        )}
                        {report.statut !== 'en_attente' && (
                          <DropdownMenuItem onClick={() => updateReportStatus(report.id_signalement, 'en_attente')} className="cursor-pointer">
                            <Clock className="mr-2 h-4 w-4" />
                            {t('reports.action_pending')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
