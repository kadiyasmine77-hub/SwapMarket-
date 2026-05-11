import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function ManageCategories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");

  const token = localStorage.getItem("token");

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const sorted = Array.isArray(data) ? [...data].sort((a, b) => {
          const nameA = a.nom.toLowerCase();
          const nameB = b.nom.toLowerCase();
          const isOtherA = ['autre', 'autres', 'other', 'others'].includes(nameA);
          const isOtherB = ['autre', 'autres', 'other', 'others'].includes(nameB);
          if (isOtherA) return 1;
          if (isOtherB) return -1;
          return nameA.localeCompare(nameB);
        }) : [];
        setCategories(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error(t('categories.error_name_required')); return; }
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ nom: newName }),
    });
    if (res.ok) {
      toast.success(t('categories.success_create', { name: newName }));
      setNewName("");
      setIsCreateOpen(false);
      fetchCategories();
    } else {
      const data = await res.json();
      toast.error(data.message || t('admin.update_error'));
    }
  };

  const handleEdit = async () => {
    if (!editName.trim()) { toast.error(t('categories.error_name_required')); return; }
    const res = await fetch(`${API_BASE_URL}/admin/categories/${editTarget.id_categorie}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ nom: editName }),
    });
    if (res.ok) {
      toast.success(t('categories.success_edit', { name: editName }));
      setIsEditOpen(false);
      setEditTarget(null);
      fetchCategories();
    } else {
      toast.error(t('admin.update_error'));
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${deleteTarget.id_categorie}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success(t('categories.success_delete', { name: deleteTarget.nom }));
      setCategories((prev) => prev.filter((c) => c.id_categorie !== deleteTarget.id_categorie));
    } else {
      const data = await res.json();
      toast.error(data.message || t('admin.update_error'));
    }
    setDeleteTarget(null);
  };

  const maxCount = Math.max(...categories.map((c) => c.objets_count || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t('admin.manage_categories')}</h1>
          <p className="text-neutral-600">{categories.length} {t('admin_dashboard.management.categories_count', { count: categories.length })}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              {t('admin_dashboard.actions.add_category')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin_dashboard.actions.add_category')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">{t('categories.name_label')}</Label>
                <Input
                  id="cat-name"
                  placeholder={t('categories.name_placeholder')}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                {t('admin_dashboard.actions.add_category')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-neutral-500">{t('admin_dashboard.management.total_categories')}</p>
          <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-neutral-500">{t('admin_dashboard.stats.active_items')}</p>
          <p className="text-2xl font-bold text-green-600">
            {categories.reduce((sum, c) => sum + (c.objets_count || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-neutral-500">{t('admin_dashboard.management.most_popular')}</p>
          <p className="text-lg font-bold text-orange-600">
            {categories.sort((a, b) => (b.objets_count || 0) - (a.objets_count || 0))[0]?.nom || "—"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin_dashboard.table.name')}</TableHead>
              <TableHead>{t('admin_dashboard.table.items_count')}</TableHead>
              <TableHead>{t('admin_dashboard.table.popularity')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-neutral-100 rounded animate-pulse" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-neutral-400">{t('admin_dashboard.management.no_categories')}</TableCell>
              </TableRow>
            ) : (
              categories
                .map((cat) => (
                  <TableRow key={cat.id_categorie}>
                    <TableCell>
                      <span className="font-medium">{cat.nom}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-neutral-600">{cat.objets_count || 0} {t('items.objects_count', { count: cat.objets_count || 0 })}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className="h-full bg-[#2d80d3]"
                            style={{ width: `${Math.min(((cat.objets_count || 0) / maxCount) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-neutral-600">
                          {Math.round(((cat.objets_count || 0) / maxCount) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditTarget(cat); setEditName(cat.nom); setIsEditOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin_dashboard.actions.edit_category')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('categories.new_name_label')}</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              />
            </div>
            <Button onClick={handleEdit} className="w-full">{t('common.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('categories.confirm_delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('categories.confirm_delete_desc', { name: deleteTarget?.nom })}
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
