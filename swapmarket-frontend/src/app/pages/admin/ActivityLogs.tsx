import { useState } from "react";
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
import { mockActivityLogs } from "../../lib/mockData";
import { toast } from "sonner";

const allLogs = [
  ...mockActivityLogs,
  {
    id: "4",
    admin: "Admin System",
    action: "Modifié catégorie",
    target: "Électronique",
    timestamp: "2026-04-11 14:20",
    details: "Mise à jour du nom et de l'icône",
  },
  {
    id: "5",
    admin: "Modérateur Jean",
    action: "Approuvé annonce",
    target: "Annonce #3456",
    timestamp: "2026-04-11 12:05",
    details: "Après vérification du contenu",
  },
  {
    id: "6",
    admin: "Admin System",
    action: "Réactivé utilisateur",
    target: "Marc Dupont",
    timestamp: "2026-04-10 18:30",
    details: "Suspension levée après appel",
  },
  {
    id: "7",
    admin: "Modérateur Sophie",
    action: "Résolu signalement",
    target: "Signalement #234",
    timestamp: "2026-04-10 16:15",
    details: "Contenu conforme aux règles",
  },
  {
    id: "8",
    admin: "Admin System",
    action: "Modifié paramètres",
    target: "Paramètres généraux",
    timestamp: "2026-04-10 09:45",
    details: "Mise à jour des règles de modération",
  },
];

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

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
    toast.success("Export des logs en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Logs d'activité</h1>
          <p className="text-neutral-600">
            Historique des actions administratives ({filteredLogs.length} entrées)
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-5 w-5" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        {[
          { label: "Total actions", value: allLogs.length, color: "bg-blue-50 text-blue-600" },
          { label: "Aujourd'hui", value: "5", color: "bg-green-50 text-green-600" },
          { label: "Cette semaine", value: "24", color: "bg-purple-50 text-purple-600" },
          { label: "Ce mois", value: "142", color: "bg-orange-50 text-orange-600" },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border bg-white p-6">
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
            placeholder="Rechercher dans les logs..."
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
            <SelectItem value="all">Toutes les actions</SelectItem>
            <SelectItem value="créé">Créations</SelectItem>
            <SelectItem value="modifié">Modifications</SelectItem>
            <SelectItem value="supprimé">Suppressions</SelectItem>
            <SelectItem value="suspendu">Suspensions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Administrateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Cible</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Timeline View */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Vue chronologique</h2>
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
