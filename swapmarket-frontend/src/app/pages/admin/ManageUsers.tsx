import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Search, MoreVertical, UserCheck, UserX, Ban, Shield } from "lucide-react";
import { mockUsers } from "../../lib/mockData";
import { toast } from "sonner";

export function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge>Actif</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspendu</Badge>;
      case "banned":
        return <Badge variant="destructive">Banni</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="secondary">Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary">Modérateur</Badge>;
      default:
        return <Badge variant="outline">Utilisateur</Badge>;
    }
  };

  const handleAction = (action: string, userName: string) => {
    toast.success(`${action} appliqué à ${userName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Gestion des utilisateurs</h1>
        <p className="text-neutral-600">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé
          {filteredUsers.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="suspended">Suspendus</SelectItem>
            <SelectItem value="banned">Bannis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Confiance</TableHead>
              <TableHead>Échanges</TableHead>
              <TableHead>Membre depuis</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-600">{user.email}</TableCell>
                <TableCell className="text-neutral-600">{user.city}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{user.trustScore}</span>
                    <span className="text-neutral-400">/5</span>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-600">{user.exchanges}</TableCell>
                <TableCell className="text-neutral-600">{user.joinedAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction("Voir profil", user.name)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Voir profil
                      </DropdownMenuItem>
                      {user.status === "suspended" ? (
                        <DropdownMenuItem onClick={() => handleAction("Réactivation", user.name)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Réactiver
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleAction("Suspension", user.name)}>
                          <UserX className="mr-2 h-4 w-4" />
                          Suspendre
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAction("Bannissement", user.name)}
                        className="text-red-600"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Bannir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Changement de rôle", user.name)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Changer le rôle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
