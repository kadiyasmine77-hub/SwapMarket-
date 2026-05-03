import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Flag, AlertTriangle, MessageSquare, Package, User, CheckCircle, XCircle } from "lucide-react";
import { mockReports } from "../../lib/mockData";
import { toast } from "sonner";

export function Moderation() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [actionNote, setActionNote] = useState("");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "item":
        return <Package className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      case "message":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Flag className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "under_review":
        return <Badge>En cours</Badge>;
      case "resolved":
        return <Badge variant="secondary">Résolu</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleResolve = (action: string) => {
    toast.success(`Signalement ${action}`);
    setSelectedReport(null);
    setActionNote("");
  };

  const pendingReports = mockReports.filter((r) => r.status === "pending");
  const underReviewReports = mockReports.filter((r) => r.status === "under_review");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Modération</h1>
        <p className="text-neutral-600">
          Gérez les signalements et les contenus inappropriés
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        {[
          {
            label: "En attente",
            value: pendingReports.length,
            icon: AlertTriangle,
            color: "text-yellow-600 bg-yellow-50",
          },
          {
            label: "En cours",
            value: underReviewReports.length,
            icon: Flag,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Résolus (7j)",
            value: "24",
            icon: CheckCircle,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Rejetés (7j)",
            value: "8",
            icon: XCircle,
            color: "text-red-600 bg-red-50",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border bg-white p-6">
              <div className="mb-2 flex items-center gap-2">
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mb-1 text-sm text-neutral-600">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Tous ({mockReports.length})</TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="review">
            En cours ({underReviewReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Raison</TableHead>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Cible</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{report.reason}</span>
                    </TableCell>
                    <TableCell className="text-neutral-600">{report.reportedBy}</TableCell>
                    <TableCell className="text-neutral-600">{report.target}</TableCell>
                    <TableCell className="text-neutral-600">{report.date}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        Examiner
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report.id} className="rounded-xl border bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-full bg-yellow-50 p-3">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">{report.reason}</h3>
                      <p className="mb-2 text-sm text-neutral-600">
                        <span className="capitalize">{report.type}</span> signalé(e) :{" "}
                        <span className="font-medium">{report.target}</span>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Par {report.reportedBy} • {report.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                    Examiner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="space-y-4">
            {underReviewReports.map((report) => (
              <div key={report.id} className="rounded-xl border bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-full bg-blue-50 p-3">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{report.reason}</h3>
                        <Badge>En cours</Badge>
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        <span className="capitalize">{report.type}</span> signalé(e) :{" "}
                        <span className="font-medium">{report.target}</span>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Par {report.reportedBy} • {report.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                    Continuer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Examiner le signalement</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="mb-1 text-sm text-neutral-600">Type</p>
                <p className="mb-3 font-medium capitalize">{selectedReport.type}</p>
                <p className="mb-1 text-sm text-neutral-600">Raison</p>
                <p className="mb-3 font-medium">{selectedReport.reason}</p>
                <p className="mb-1 text-sm text-neutral-600">Cible</p>
                <p className="mb-3 font-medium">{selectedReport.target}</p>
                <p className="mb-1 text-sm text-neutral-600">Signalé par</p>
                <p className="font-medium">{selectedReport.reportedBy}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note d'action</label>
                <Textarea
                  placeholder="Ajoutez une note sur votre décision..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => handleResolve("supprimé")}>
              Supprimer le contenu
            </Button>
            <Button onClick={() => handleResolve("résolu")}>
              Marquer comme résolu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
