import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
import { Search, MoreVertical, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { Link } from "react-router";
import { useLanguage } from "../../LanguageContext";

export function ManageItems() {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchItems = () => {
    setLoading(true);
    const token = getToken();
    fetch(`${API_BASE_URL}/admin/objets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/admin/objets/${deleteTarget.id_objet}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success(t('items.success_delete', { title: deleteTarget.titre }));
      setItems((prev) => prev.filter((i) => i.id_objet !== deleteTarget.id_objet));
    } else {
      toast.error(t('admin.update_error'));
    }
    setDeleteTarget(null);
  };

  const filtered = items.filter((item) =>
    item.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.user?.nom_complet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDispobadge = (dispo: string) => {
    switch (dispo) {
      case "disponible":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('common.available')}</Badge>;
      case "echange":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('common.exchanged')}</Badge>;
      case "reserve":
        return <Badge variant="outline">{t('common.reserved')}</Badge>;
      default:
        return <Badge variant="outline">{dispo}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('admin.manage_items')}</h1>
        <p className="text-neutral-600">{t('items.objects_count', { count: filtered.length })}</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 rounded-xl border bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder={t('admin_dashboard.table.search_items')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">{t('admin_dashboard.table.item')}</TableHead>
              <TableHead>{t('admin_dashboard.table.owner')}</TableHead>
              <TableHead>{t('admin_dashboard.table.category')}</TableHead>
              <TableHead>{t('publish_edit.condition_label').replace('*', '').trim()}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead>{t('profile.city')}</TableHead>
              <TableHead>{t('admin_dashboard.table.date')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-400">
                  {t('admin_dashboard.management.no_items')}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id_objet}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[200px]">
                      {item.image ? (
                        <img
                          src={getStorageUrl(item.image) || ""}
                          alt={item.titre}
                          className="media-thumbnail"
                        />
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">N/A</div>
                      )}
                      <p className="font-medium line-clamp-1 text-sm">{item.titre}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={getStorageUrl(item.user?.photo_profil) || undefined} />
                        <AvatarFallback>{item.user?.nom_complet?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{item.user?.nom_complet || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.categorie?.nom || "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.etat}</Badge>
                  </TableCell>
                  <TableCell>{getDispobadge(item.disponibilite)}</TableCell>
                  <TableCell className="text-neutral-600">{item.user?.ville || "—"}</TableCell>
                  <TableCell className="text-neutral-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/user/item/${item.id_objet}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('items.view_annonce')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteTarget(item)}
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

      {/* Confirm Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('items.confirm_delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('items.confirm_delete_desc', { title: deleteTarget?.titre })}
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
