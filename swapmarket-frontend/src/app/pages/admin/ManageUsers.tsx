import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Search, MoreVertical, UserCheck, UserX, Shield, ShieldOff, ChevronLeft, ChevronRight, Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function ManageUsers() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = (page = 1) => {
    setLoading(true);
    const token = getToken();
    const params = new URLSearchParams({ page: String(page) });
    if (searchQuery) params.append("search", searchQuery);
    if (statusFilter !== "all") params.append("statut", statusFilter);

    fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.data || []);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(1);
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateStatut = async (userId: number, statut: string, userName: string) => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/statut`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) {
      toast.success(t('admin.status_updated', { name: userName, status: statut }));
      fetchUsers(currentPage);
    } else {
      const data = await res.json();
      toast.error(data.message || t('admin.update_error'));
    }
  };

  const updateRole = async (userId: number, role: string, userName: string) => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      toast.success(t('admin.role_updated', { name: userName, role: role }));
      fetchUsers(currentPage);
    } else {
      const data = await res.json();
      toast.error(data.message || t('admin.update_error'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id_user, nom_complet } = deleteTarget;

    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/admin/users/${id_user}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success(t('admin.user_deleted', { name: nom_complet }));
      fetchUsers(currentPage);
    } else {
      const data = await res.json();
      toast.error(data.message || t('admin.update_error'));
    }
    setDeleteTarget(null);
  };

  const handleImportXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("fichier_xml", file);

    const token = getToken();
    toast.info(t('admin.importing'));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/import/xml`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || t('admin.import_success'));
        fetchUsers(1);
      } else {
        toast.error(data.message || t('admin.import_error'));
      }
    } catch (error) {
      toast.error(t('admin.import_error'));
    }

    // Reset input
    event.target.value = "";
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('admin.status_active')}</Badge>;
      case "suspendu":
        return <Badge variant="destructive">{t('admin.status_suspended')}</Badge>;
      case "desactive":
        return <Badge variant="outline" className="text-neutral-500">{t('admin.status_deactivated')}</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === "admin"
      ? <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      : <Badge variant="outline">{t('common.user')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('admin.manage_users')}</h1>
        <p className="text-neutral-600">{total} {t('admin.total_users')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder={t('admin.search_placeholder')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="xml-import"
            className="hidden"
            accept=".xml"
            onChange={handleImportXML}
          />
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => document.getElementById("xml-import")?.click()}
          >
            <Upload className="h-4 w-4" />
            {t('admin.import_xml')}
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('admin.all_statuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.all_statuses')}</SelectItem>
              <SelectItem value="actif">{t('admin.status_active')}</SelectItem>
              <SelectItem value="suspendu">{t('admin.status_suspended')}</SelectItem>
              <SelectItem value="desactive">{t('admin.status_deactivated')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.user')}</TableHead>
              <TableHead>{t('admin.email')}</TableHead>
              <TableHead>{t('profile.city')}</TableHead>
              <TableHead>{t('admin.role')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead>{t('admin.items_count')}</TableHead>
              <TableHead>{t('admin.member_since')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-400">
                  {t('admin.no_users')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id_user}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <Avatar className="h-9 w-9 border border-neutral-200">
                        <AvatarImage src={getStorageUrl(user.photo_profil) || undefined} alt={user.nom_complet} />
                        <AvatarFallback>{user.nom_complet?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.nom_complet}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">{user.email}</TableCell>
                  <TableCell className="text-neutral-600">{user.ville || "—"}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.statut_compte)}</TableCell>
                  <TableCell className="text-neutral-600">{user.objets_count}</TableCell>
                  <TableCell className="text-neutral-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.statut_compte === "suspendu" || user.statut_compte === "desactive" ? (
                          <DropdownMenuItem onClick={() => updateStatut(user.id_user, "actif", user.nom_complet)}>
                            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                            {t('admin.reactivate')}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateStatut(user.id_user, "suspendu", user.nom_complet)}>
                            <UserX className="mr-2 h-4 w-4 text-yellow-600" />
                            {t('admin.suspend')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => updateStatut(user.id_user, "desactive", user.nom_complet)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          {t('admin.deactivate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.role === "admin" ? (
                          <DropdownMenuItem onClick={() => updateRole(user.id_user, "user", user.nom_complet)}>
                            <ShieldOff className="mr-2 h-4 w-4" />
                            {t('admin.demote')}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateRole(user.id_user, "admin", user.nom_complet)}>
                            <Shield className="mr-2 h-4 w-4 text-purple-600" />
                            {t('admin.promote')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive font-medium"
                          onClick={() => setDeleteTarget(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Page {currentPage} sur {lastPage}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => p - 1); fetchUsers(currentPage - 1); }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === lastPage}
              onClick={() => { setCurrentPage(p => p + 1); fetchUsers(currentPage + 1); }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.confirm_delete_user', { name: deleteTarget?.nom_complet })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
