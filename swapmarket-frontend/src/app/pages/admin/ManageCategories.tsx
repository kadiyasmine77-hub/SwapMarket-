import { useState } from "react";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { mockCategories } from "../../lib/mockData";
import { toast } from "sonner";

export function ManageCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });

  const handleCreate = () => {
    toast.success(`Catégorie "${newCategory.name}" créée avec succès`);
    setNewCategory({ name: "", icon: "" });
    setIsDialogOpen(false);
  };

  const handleDelete = (name: string) => {
    toast.success(`Catégorie "${name}" supprimée`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Gestion des catégories</h1>
          <p className="text-neutral-600">
            {mockCategories.length} catégories configurées
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Nom de la catégorie</Label>
                <Input
                  id="cat-name"
                  placeholder="Ex: Art & Décoration"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-icon">Icône (Lucide icon name)</Label>
                <Input
                  id="cat-icon"
                  placeholder="Ex: Palette"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Créer la catégorie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total catégories", value: mockCategories.length, color: "bg-blue-50 text-blue-600" },
          { label: "Catégories actives", value: mockCategories.length, color: "bg-green-50 text-green-600" },
          { label: "Total annonces", value: "1,245", color: "bg-purple-50 text-purple-600" },
          { label: "Catégorie la plus populaire", value: "Vêtements", color: "bg-orange-50 text-orange-600" },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border bg-white p-6">
            <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Icône</TableHead>
              <TableHead>Nombre d'annonces</TableHead>
              <TableHead>Popularité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <span className="font-medium">{category.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{category.icon}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{category.count} annonces</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${Math.min((category.count / 312) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-neutral-600">
                      {Math.round((category.count / 312) * 100)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
