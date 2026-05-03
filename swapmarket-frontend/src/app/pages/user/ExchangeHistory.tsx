import { API_BASE_URL, getStorageUrl } from "../../config";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Star, ArrowRightLeft, CheckCircle2, Clock, XCircle, AlertTriangle, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export function ExchangeHistory() {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const [confirmCancel, setConfirmCancel] = useState<{ id: number; attempts: number } | null>(null);
  const [reviewItem, setReviewItem] = useState<{ id_echange: number, id_objet: number, titre: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setExchanges(data);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
      toast.error("Impossible de charger l'historique.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges/${id}/statut`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ statut: status })
      });

      if (response.ok) {
        let msg = "Statut mis à jour.";
        if (status === 'valide') msg = "Échange accepté !";
        else if (status === 'refuse') msg = "Échange refusé.";
        else if (status === 'termine') msg = "Échange terminé avec succès !";
        else if (status === 'annule') msg = "Échange annulé.";
        toast.success(msg);
        fetchExchanges();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Error updating exchange:", error);
      toast.error("Erreur de connexion.");
    }
  };

  const handleSubmittingReview = async () => {
    if (!reviewItem) return;
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/objets/${reviewItem.id_objet}/avis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          note: rating,
          commentaire: comment
        })
      });

      if (response.ok) {
        toast.success("Avis soumis avec succès !");
        setReviewItem(null);
        setRating(5);
        setComment("");
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors de la soumission de l'avis.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Erreur de connexion.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges/${id}/pdf`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bon-echange-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download error:", error);
      toast.error("Impossible de télécharger le PDF.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "valide":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "termine":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case "refuse":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "annule":
        return <XCircle className="h-5 w-5 text-neutral-400" />;
      default:
        return <ArrowRightLeft className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "valide":
        return <Badge className="bg-green-600">Accepté</Badge>;
      case "termine":
        return <Badge variant="secondary">Terminé</Badge>;
      case "refuse":
        return <Badge variant="destructive">Refusé</Badge>;
      case "annule":
        return <Badge variant="outline" className="text-neutral-500 border-neutral-200">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingExchanges = exchanges.filter((e) => e.statut === "en_attente");
  const acceptedExchanges = exchanges.filter((e) => e.statut === "valide");
  const completedExchanges = exchanges.filter((e) => e.statut === "termine");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Historique des échanges</h1>
        <p className="text-neutral-600">Gérez vos propositions et échanges réalisés</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Tous ({exchanges.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({pendingExchanges.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Acceptés ({acceptedExchanges.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminés ({completedExchanges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <p className="py-10 text-center text-neutral-500">Chargement de l'historique...</p>
          ) : exchanges.length > 0 ? (
            exchanges.map((exchange) => (
              <ExchangeCard 
                key={exchange.id_echange} 
                exchange={exchange} 
                currentUser={currentUser} 
                onUpdate={handleUpdateStatus} 
                onConfirmCancel={(id: number, attempts: number) => setConfirmCancel({ id, attempts })}
                onReview={(id: number, id_objet: number, titre: string) => setReviewItem({ id_echange: id, id_objet, titre })}
                onDownloadPDF={handleDownloadPDF}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingExchanges.length > 0 ? (
            pendingExchanges.map((exchange) => (
              <ExchangeCard 
                key={exchange.id_echange} 
                exchange={exchange} 
                currentUser={currentUser} 
                onUpdate={handleUpdateStatus} 
                onConfirmCancel={(id: number, attempts: number) => setConfirmCancel({ id, attempts })}
                onReview={(id: number, id_objet: number, titre: string) => setReviewItem({ id_echange: id, id_objet, titre })}
                onDownloadPDF={handleDownloadPDF}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedExchanges.length > 0 ? (
            acceptedExchanges.map((exchange) => (
              <ExchangeCard 
                key={exchange.id_echange} 
                exchange={exchange} 
                currentUser={currentUser} 
                onUpdate={handleUpdateStatus} 
                onConfirmCancel={(id: number, attempts: number) => setConfirmCancel({ id, attempts })}
                onReview={(id: number, id_objet: number, titre: string) => setReviewItem({ id_echange: id, id_objet, titre })}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedExchanges.length > 0 ? (
            completedExchanges.map((exchange) => (
              <ExchangeCard 
                key={exchange.id_echange} 
                exchange={exchange} 
                currentUser={currentUser} 
                onUpdate={handleUpdateStatus}
                onConfirmCancel={(id: number, attempts: number) => setConfirmCancel({ id, attempts })}
                onReview={(id: number, id_objet: number, titre: string) => setReviewItem({ id_echange: id, id_objet, titre })}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Confirmer l'annulation</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Voulez-vous vraiment annuler votre demande ?
              <div className="mt-3 rounded-lg bg-neutral-50 p-3 text-neutral-900 font-medium border border-neutral-100">
                Il vous restera <span className="text-red-600 font-bold">{3 - (confirmCancel?.attempts || 1)}</span> tentative(s) pour proposer un échange avec cet objet.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4 mt-2">
            <Button variant="outline" onClick={() => setConfirmCancel(null)} className="sm:w-32">
              Retour
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirmCancel) handleUpdateStatus(confirmCancel.id, 'annule');
                setConfirmCancel(null);
              }}
              className="sm:w-40"
            >
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reviewItem} onOpenChange={() => setReviewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Laisser un avis</DialogTitle>
            <DialogDescription>
              Comment s'est passé votre échange pour <strong>{reviewItem?.titre}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-neutral-600">Note</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Votre commentaire</Label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setReviewItem(null)}>Annuler</Button>
            <Button 
              onClick={handleSubmittingReview} 
              disabled={isSubmittingReview || !comment.trim()}
              className="bg-black text-white hover:bg-black/90"
            >
              {isSubmittingReview ? "Envoi..." : "Publier l'avis"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExchangeCard({ exchange, currentUser, onUpdate, onConfirmCancel, onReview, onDownloadPDF }: { exchange: any, currentUser: any, onUpdate: any, onConfirmCancel: any, onReview: any, onDownloadPDF: any }) {
  const isDemandeur = exchange.id_demandeur === currentUser?.id_user;
  const otherUser = isDemandeur ? exchange.destinataire : exchange.demandeur;
  const myItem = isDemandeur ? exchange.objet1 : exchange.objet2;
  const theirItem = isDemandeur ? exchange.objet2 : exchange.objet1;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_attente": return <Clock className="h-5 w-5 text-yellow-600" />;
      case "valide": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "termine": return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case "refuse": return <XCircle className="h-5 w-5 text-red-600" />;
      case "annule": return <XCircle className="h-5 w-5 text-neutral-400" />;
      default: return <ArrowRightLeft className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente": return <Badge variant="outline">En attente</Badge>;
      case "valide": return <Badge className="bg-green-600">Accepté</Badge>;
      case "termine": return <Badge variant="secondary">Terminé</Badge>;
      case "refuse": return <Badge variant="destructive">Refusé</Badge>;
      case "annule": return <Badge variant="outline" className="text-neutral-500 border-neutral-200">Annulé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-neutral-100 p-3">
          {getStatusIcon(exchange.statut)}
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="mb-1 font-semibold">
                Échange avec {otherUser?.nom_complet || "Utilisateur"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="font-medium text-olive">{myItem?.titre}</span>
                <ArrowRightLeft className="h-4 w-4" />
                <span className="font-medium">{theirItem?.titre}</span>
              </div>
            </div>
            {getStatusBadge(exchange.statut)}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={getStorageUrl(otherUser?.photo_profil) || undefined} />
              <AvatarFallback>{otherUser?.nom_complet?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-500">
              {new Date(exchange.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            {exchange.statut === "en_attente" && !isDemandeur && (
              <>
                <Button size="sm" className="bg-black text-white hover:bg-black/90" onClick={() => onUpdate(exchange.id_echange, 'valide')}>
                  Accepter
                </Button>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/20" onClick={() => onUpdate(exchange.id_echange, 'refuse')}>
                  Refuser
                </Button>
              </>
            )}
            {exchange.statut === "en_attente" && isDemandeur && (
              <div className="flex flex-col gap-1">
                <p className="text-sm italic text-neutral-500 mb-1">En attente de réponse du destinataire...</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:bg-red-50 hover:text-red-600 w-fit h-7 px-2 text-xs" 
                  onClick={() => onConfirmCancel(exchange.id_echange, exchange.attempts_count)}
                >
                  Annuler ma demande
                </Button>
              </div>
            )}
            {(exchange.statut === "valide" || exchange.statut === "termine") && (
              <Button variant="outline" size="sm" onClick={() => window.location.href = `/user/messages?echange_id=${exchange.id_echange}`}>
                Contacter
              </Button>
            )}
            {exchange.statut === "termine" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-olive text-olive hover:bg-olive/5"
                onClick={() => onReview(exchange.id_echange, isDemandeur ? exchange.id_objet2 : exchange.id_objet1, isDemandeur ? exchange.objet2?.titre : exchange.objet1?.titre)}
              >
                <Star className="mr-2 h-4 w-4" />
                Laisser un avis
              </Button>
            )}
            {exchange.statut === "valide" && (
              <>
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => onUpdate(exchange.id_echange, 'termine')}>
                  Marquer comme terminé
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive border-destructive/20" 
                  onClick={() => onConfirmCancel(exchange.id_echange, exchange.attempts_count)}
                >
                  Annuler l'échange
                </Button>
              </>
            )}
            {(exchange.statut === "valide" || exchange.statut === "termine") && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => onDownloadPDF(exchange.id_echange)}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center border-2 border-dashed rounded-xl">
      <p className="text-neutral-500">Aucun échange trouvé dans cette catégorie.</p>
    </div>
  );
}
