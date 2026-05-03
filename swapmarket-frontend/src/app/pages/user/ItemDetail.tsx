import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Heart, MapPin, Calendar, CheckCircle2, ShieldCheck, Share2, MessageSquare, AlertTriangle, Star, Flag } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { ImageSlider } from "../../components/ImageSlider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMyItems, setLoadingMyItems] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/objets/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching item:", err);
        setLoading(false);
      });
  }, [id]);

  const handlePropose = async () => {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser) {
      toast.error("Vous devez être connecté pour proposer un échange.");
      return;
    }

    if (item.id_user === currentUser.id_user) {
      toast.error("Vous ne pouvez pas échanger un objet avec vous-même !");
      return;
    }

    setShowProposalDialog(true);
    setLoadingMyItems(true);

    try {
      const response = await fetch(`${API_BASE_URL}/objets?user_id=${currentUser.id_user}`);
      const data = await response.json();
      const items = (data.data || data).filter((i: any) => i.disponibilite === 'disponible');
      setMyItems(items);
    } catch (error) {
      console.error("Error fetching my items:", error);
      toast.error("Impossible de charger vos objets.");
    } finally {
      setLoadingMyItems(false);
    }
  };

  const handleConfirmProposal = async () => {
    if (!selectedItemId) {
      toast.error("Veuillez sélectionner un objet à échanger.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          id_objet1: selectedItemId, // Mon objet
          id_objet2: item.id_objet,  // Son objet
        })
      });

      if (response.ok) {
        toast.success("Proposition d'échange envoyée !");
        setShowProposalDialog(false);
        navigate("/user/history");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de l'envoi de la proposition.");
      }
    } catch (error) {
      console.error("Error proposing exchange:", error);
      toast.error("Erreur de connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessage = () => {
    toast.success(`Votre intérêt pour "${item.titre}" a été noté. Vous pourrez discuter une fois l'échange proposé !`);
    // On pourrait aussi rediriger vers la page de profil du propriétaire
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favoris/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ id_objet: item.id_objet })
      });

      if (response.ok) {
        const data = await response.json();
        setItem((prev: any) => ({ ...prev, is_favorited: data.status === 'added' }));
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Une erreur est survenue.");
    }
  };

  const handleReport = () => {
    toast.success("L'objet a été signalé à l'équipe de modération. Merci de votre vigilance.");
  };

  if (loading) return <div className="text-center py-20 font-medium">Chargement de l'objet...</div>;
  if (!item) return <div className="text-center py-20 font-medium text-destructive">Objet non trouvé.</div>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="relative aspect-square overflow-hidden rounded-xl border">
          <ImageSlider 
            images={[
              ...(item.image ? [getStorageUrl(item.image)!] : []),
              ...(item.images?.map((img: any) => getStorageUrl(img.image_url)!) || [])
            ]} 
            alt={item.titre} 
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{item.titre}</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${item.is_favorited ? "text-red-500 hover:text-red-600" : "text-neutral-400 hover:text-neutral-500"}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-6 w-6 ${item.is_favorited ? "fill-current" : ""}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <MapPin className="h-4 w-4" />
              <span>{item.user?.ville || "Localisation inconnue"}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>Publié le {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {item.categorie?.nom || "Autre"}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {item.etat}
            </Badge>
            <Badge 
              className={`${
                item.disponibilite === 'echange' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                item.disponibilite === 'reserve' ? 'bg-neutral-500 hover:bg-neutral-600' : 
                'bg-green-500 hover:bg-green-600'
              } text-white text-sm font-bold`}
            >
              {item.disponibilite === 'echange' ? 'En échange' : 
               item.disponibilite === 'reserve' ? 'Réservé' : 
               item.disponibilite === 'disponible' ? 'Disponible' : item.disponibilite}
            </Badge>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="text-neutral-700">{item.description}</p>
          </div>

          <Separator />

          {/* Owner */}
          <div>
            <h2 className="mb-3 font-semibold">Proposé par</h2>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={getStorageUrl(item.user?.photo_profil) || undefined} alt={item.user?.nom_complet} />
                <AvatarFallback>{item.user?.nom_complet?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{item.user?.nom_complet}</p>
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.user?.avg_rating || "0.0"}</span>
                  <span>•</span>
                  <span>{item.user?.objets_count || 0} objets</span>
                </div>
              </div>
              <Link to={`/user/profile/${item.user?.id_user}`}>
                <Button variant="outline" size="sm">
                  Voir profil
                </Button>
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {item.disponibilite !== 'disponible' ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-800 font-medium text-center">
                  {item.disponibilite === 'echange' 
                    ? "Cet objet n'est plus disponible car un troc a déjà été accepté." 
                    : "Cet objet a déjà été échangé."}
                </p>
                <Button disabled size="lg" className="w-full mt-3 bg-neutral-300 text-neutral-500 cursor-not-allowed">
                  Échange indisponible
                </Button>
              </div>
            ) : (
              <Button onClick={handlePropose} size="lg" className="w-full bg-black text-white hover:bg-black/90">
                Proposer un échange
              </Button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2" onClick={handleMessage}>
                <MessageSquare className="h-5 w-5" />
                Message
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleReport}>
                <Flag className="h-5 w-5" />
                Signaler
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Proposer un échange</DialogTitle>
            <DialogDescription>
              Choisissez l'un de vos objets pour l'échanger contre <strong>{item.titre}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loadingMyItems ? (
              <div className="py-10 text-center text-sm text-neutral-500">Chargement de vos objets...</div>
            ) : myItems.length > 0 ? (
              <div className="grid gap-3 max-h-[300px] overflow-y-auto p-1">
                {myItems.map((myObj) => (
                  <div
                    key={myObj.id_objet}
                    onClick={() => setSelectedItemId(myObj.id_objet.toString())}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-neutral-50 ${
                      selectedItemId === myObj.id_objet.toString()
                        ? "border-olive bg-olive/5 ring-1 ring-olive"
                        : "border-border"
                    }`}
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-100">
                      {myObj.image ? (
                        <img
                          src={getStorageUrl(myObj.image)!}
                          alt={myObj.titre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{myObj.titre}</p>
                      <p className="text-xs text-neutral-500">{myObj.categorie?.nom || "Sans catégorie"}</p>
                    </div>
                    {selectedItemId === myObj.id_objet.toString() && (
                      <div className="h-5 w-5 rounded-full bg-olive flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <p className="mb-4 text-sm text-neutral-500">Vous n'avez aucun objet disponible pour l'échange.</p>
                <Link to="/user/publish">
                  <Button variant="outline" size="sm" className="border-olive text-olive">
                    Publier un objet
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposalDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmProposal}
              disabled={!selectedItemId || isSubmitting}
              className="bg-black text-white hover:bg-black/90"
            >
              {isSubmitting ? "Envoi..." : "Confirmer la proposition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
