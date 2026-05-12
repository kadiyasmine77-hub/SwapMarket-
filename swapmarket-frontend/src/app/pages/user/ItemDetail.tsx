import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Heart, MapPin, Calendar, CheckCircle2, ShieldCheck, Share2, MessageSquare, AlertTriangle, Star, Flag, Package } from "lucide-react";
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
import { useLanguage } from "../../LanguageContext";

export function ItemDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMyItems, setLoadingMyItems] = useState(false);

  // Signaler states
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportMotif, setReportMotif] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/objets/${id}`, { headers })
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
      toast.error(t('items.must_be_logged'));
      return;
    }

    if (currentUser.role === 'admin') {
      toast.info("Vous êtes connecté en tant qu'administrateur. Cette action est réservée aux comptes utilisateurs.");
      return;
    }

    if (item.id_user === currentUser.id_user) {
      toast.error(t('items.cannot_swap_self'));
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
      toast.error(t('items.no_items_available'));
    } finally {
      setLoadingMyItems(false);
    }
  };

  const handleConfirmProposal = async () => {
    if (!selectedItemId) {
      toast.error(t('items.select_motif'));
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
        toast.success(t('items.proposal_sent'));
        setShowProposalDialog(false);
        navigate("/user/history");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error proposing exchange:", error);
      toast.error("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessage = () => {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (currentUser?.role === 'admin') {
      toast.info("Vous êtes connecté en tant qu'administrateur. Cette action est réservée aux comptes utilisateurs.");
      return;
    }

    toast.success(t('items.message_interest_toast', { title: item.titre }));
    // On pourrait aussi rediriger vers la page de profil du propriétaire
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser || !token) {
        toast.info(t('items.must_be_logged_fav'));
        return;
      }

      if (currentUser.role === 'admin') {
        toast.info(t('items.admin_restricted'));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/favoris/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ id_objet: item.id_objet })
      });

      const data = await response.json();
      if (response.ok) {
        setItem((prev: any) => ({ ...prev, is_favorited: data.status === 'added' }));
        toast.success(data.message);
      } else {
        toast.error(data.message || t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(t('admin.update_error'));
    }
  };

  const handleReport = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error(t('items.must_be_logged'));
      return;
    }

    const currentUser = JSON.parse(userStr);
    if (currentUser.role === 'admin') {
      toast.info("Vous êtes connecté en tant qu'administrateur. Cette action est réservée aux comptes utilisateurs.");
      return;
    }
    setShowReportDialog(true);
  };

  const submitReport = async () => {
    if (!reportMotif) {
      toast.error(t('items.select_motif'));
      return;
    }

    setIsReporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/signalements`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          id_objet: item.id_objet,
          motif: reportMotif,
          description: reportDesc
        })
      });

      const data = await response.json();
      
      if (response.ok || response.status === 201) {
        toast.success(data.message || t('items.report_success'));
        setShowReportDialog(false);
        setReportMotif("");
        setReportDesc("");
      } else {
        toast.error(data.message || t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error");
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium">{t('common.loading')}</div>;
  if (!item) return <div className="text-center py-20 font-medium text-destructive">{t('items.not_found')}</div>;

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
              <span>{item.user?.ville || "—"}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>{t('items.posted_on')} {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {item.categorie?.nom || "—"}
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
              {item.disponibilite === 'echange' ? t('common.exchanged') : 
               item.disponibilite === 'reserve' ? t('common.reserved') : 
               item.disponibilite === 'disponible' ? t('common.available') : item.disponibilite}
            </Badge>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">{t('items.description')}</h2>
            <p className="text-neutral-700">{item.description}</p>
          </div>

          <Separator />

          {/* Owner */}
          <div>
            <h2 className="mb-3 font-semibold">{t('items.proposed_by')}</h2>
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
                  <span>{t('items.objects_count', { count: item.user?.objets_count || 0 })}</span>
                </div>
              </div>
              <Link to={`/user/profile/${item.user?.id_user}`}>
                <Button variant="outline" size="sm">
                  {t('items.view_profile')}
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
                    ? t('items.unavailable_accepted') 
                    : t('items.unavailable_exchanged')}
                </p>
                <Button disabled size="lg" className="w-full mt-3 bg-neutral-300 text-neutral-500 cursor-not-allowed">
                  {t('items.swap_unavailable')}
                </Button>
              </div>
            ) : (
              <Button onClick={handlePropose} size="lg" className="w-full bg-black text-white hover:bg-black/90">
                {t('common.propose_swap')}
              </Button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2" onClick={handleMessage}>
                <MessageSquare className="h-5 w-5" />
                {t('items.message')}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleReport}>
                <Flag className="h-5 w-5" />
                {t('items.report')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('items.propose_swap_title')}</DialogTitle>
            <DialogDescription>
              {t('items.propose_swap_desc', { title: item.titre })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loadingMyItems ? (
              <div className="py-10 text-center text-sm text-neutral-500">{t('common.loading')}</div>
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
                      <p className="text-xs text-neutral-500">{myObj.categorie?.nom || "—"}</p>
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
                <p className="mb-4 text-sm text-neutral-500">{t('items.no_items_available')}</p>
                <Link to="/user/publish">
                  <Button variant="outline" size="sm" className="border-olive text-olive">
                    {t('common.publish')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProposalDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleConfirmProposal}
              disabled={!selectedItemId || isSubmitting}
              className="bg-black text-white hover:bg-black/90"
            >
              {isSubmitting ? t('common.loading') : t('items.confirm_proposal')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Signaler */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('items.report_title')}</DialogTitle>
            <DialogDescription>
              {t('items.report_desc', { title: item.titre })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('items.report_motif')} <span className="text-red-500">*</span></label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm"
                value={reportMotif}
                onChange={(e) => setReportMotif(e.target.value)}
              >
                <option value="" disabled>{t('items.select_motif')}</option>
                <option value="spam">{t('items.motif_spam')}</option>
                <option value="inapproprie">{t('items.motif_inappropriate')}</option>
                <option value="contrefacon">{t('items.motif_counterfeit')}</option>
                <option value="arnaque">{t('items.motif_scam')}</option>
                <option value="autre">{t('items.motif_other')}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('items.report_details')}</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-neutral-400"
                placeholder="..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={submitReport}
              disabled={!reportMotif || isReporting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isReporting ? t('common.loading') : t('items.report_send')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
