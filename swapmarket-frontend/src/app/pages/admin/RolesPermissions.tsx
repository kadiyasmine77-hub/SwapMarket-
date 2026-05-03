import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Shield, Plus, Users } from "lucide-react";
import { toast } from "sonner";

const roles = [
  {
    id: "1",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    users: 2,
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      items: { view: true, create: true, edit: true, delete: true },
      moderation: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    id: "2",
    name: "Modérateur",
    description: "Gestion de la modération et des signalements",
    users: 5,
    permissions: {
      users: { view: true, create: false, edit: true, delete: false },
      items: { view: true, create: false, edit: true, delete: true },
      moderation: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: false, edit: false, delete: false },
    },
  },
  {
    id: "3",
    name: "Utilisateur",
    description: "Accès standard aux fonctionnalités utilisateur",
    users: 1240,
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      items: { view: true, create: true, edit: true, delete: true },
      moderation: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
];

const permissionCategories = [
  { key: "users", label: "Gestion utilisateurs" },
  { key: "items", label: "Gestion annonces" },
  { key: "moderation", label: "Modération" },
  { key: "settings", label: "Paramètres" },
];

export function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePermissionToggle = (category: string, action: string) => {
    toast.success("Permission mise à jour");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Rôles et permissions</h1>
          <p className="text-neutral-600">Gérez les rôles et leurs permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Nouveau rôle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau rôle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom du rôle</Label>
                <Input placeholder="Ex: Support Client" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Description du rôle..." />
              </div>
              <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                Créer le rôle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Total rôles", value: roles.length, icon: Shield },
          { label: "Total utilisateurs", value: "1,247", icon: Users },
          { label: "Permissions actives", value: "48", icon: Shield },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-blue-50 p-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="rounded-xl border bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-xl font-bold">{role.name}</h3>
                  <Badge variant="secondary">{role.users} utilisateurs</Badge>
                </div>
                <p className="text-neutral-600">{role.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
              >
                {selectedRole?.id === role.id ? "Fermer" : "Gérer permissions"}
              </Button>
            </div>

            {selectedRole?.id === role.id && (
              <div className="border-t pt-4">
                <h4 className="mb-4 font-semibold">Permissions</h4>
                <div className="space-y-4">
                  {permissionCategories.map((category) => (
                    <div key={category.key} className="rounded-lg border p-4">
                      <p className="mb-3 font-medium">{category.label}</p>
                      <div className="grid gap-3 sm:grid-cols-4">
                        {["view", "create", "edit", "delete"].map((action) => (
                          <div key={action} className="flex items-center justify-between">
                            <label className="text-sm capitalize">{action === "view" ? "Voir" : action === "create" ? "Créer" : action === "edit" ? "Modifier" : "Supprimer"}</label>
                            <Switch
                              checked={
                                role.permissions[category.key as keyof typeof role.permissions]?.[
                                  action as keyof typeof role.permissions.users
                                ]
                              }
                              onCheckedChange={() => handlePermissionToggle(category.key, action)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Matrice des permissions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rôle</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Annonces</TableHead>
                <TableHead>Modération</TableHead>
                <TableHead>Paramètres</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-neutral-500">{role.users} membres</p>
                    </div>
                  </TableCell>
                  {permissionCategories.map((category) => {
                    const perms = role.permissions[category.key as keyof typeof role.permissions];
                    const activePerms = Object.values(perms || {}).filter(Boolean).length;
                    return (
                      <TableCell key={category.key}>
                        <Badge variant={activePerms === 4 ? "default" : activePerms > 0 ? "secondary" : "outline"}>
                          {activePerms}/4
                        </Badge>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
