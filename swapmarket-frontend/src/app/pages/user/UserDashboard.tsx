import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { ImageSlider } from "../../components/ImageSlider";

export function UserDashboard() {
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const [recommendedItems, setRecommendedItems] = useState<any[]>([]);
  const [recentExchanges, setRecentExchanges] = useState<any[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    


    // Fetch Recent Exchanges
    fetch(`${API_BASE_URL}/echanges`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRecentExchanges(data.slice(0, 3)))
      .catch(err => console.error("Error fetching exchanges:", err));

    // Fetch Unread Messages Count
    fetch(`${API_BASE_URL}/messages/unread-count`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.count !== undefined) {
          setUnreadMessagesCount(data.count);
        }
      })
      .catch(err => console.error("Error fetching unread count:", err));

    // Fetch Recommended Items (latest items for now)
    fetch(`${API_BASE_URL}/objets?per_page=4`)
      .then(res => res.json())
      .then(data => {
        setRecommendedItems(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching recommended items:", err);
        setLoading(false);
      });
  }, []);



  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">Bienvenue, {currentUser?.nom_complet || 'Utilisateur'} 👋</h1>
        <p className="text-neutral-600">
          Voici un aperçu de votre activité sur SwapMarket
        </p>
      </div>



      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Actions rapides</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/user/publish">
            <Button className="w-full" size="lg">
              Publier un objet
            </Button>
          </Link>
          <Link to="/user/search">
            <Button variant="outline" className="w-full" size="lg">
              Rechercher
            </Button>
          </Link>
          <Link to="/user/messages">
            <Button variant="outline" className="w-full" size="lg">
              Messagerie
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Messages</h2>
            <Link to="/user/messages">
              <Button variant="ghost" size="sm">Ouvrir</Button>
            </Link>
          </div>
          <div className="space-y-4 h-[120px] flex flex-col justify-center items-center bg-neutral-50/50 rounded-lg border border-dashed">
            <MessageSquare className={`h-8 w-8 mb-2 ${unreadMessagesCount > 0 ? 'text-olive' : 'text-neutral-300'}`} />
            {unreadMessagesCount > 0 ? (
              <div className="text-center">
                <p className="font-semibold text-olive">Vous avez {unreadMessagesCount} message{unreadMessagesCount > 1 ? 's' : ''} non lu{unreadMessagesCount > 1 ? 's' : ''}</p>
                <p className="text-xs text-neutral-500 mt-1">Consultez votre messagerie pour y répondre.</p>
              </div>
            ) : (
              <p className="text-center text-neutral-500 text-sm">
                Aucun nouveau message pour le moment.
              </p>
            )}
          </div>
        </div>

        {/* Recent Exchanges */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Échanges en cours</h2>
            <Link to="/user/history">
              <Button variant="ghost" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentExchanges.length > 0 ? (
              recentExchanges.map((exchange) => {
                const isDemandeur = exchange.id_demandeur === currentUser?.id_user;
                const otherUser = isDemandeur ? exchange.destinataire : exchange.demandeur;
                return (
                  <div key={exchange.id_echange} className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={getStorageUrl(otherUser?.photo_profil) || undefined} alt={otherUser?.nom_complet} />
                      <AvatarFallback>{otherUser?.nom_complet?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{otherUser?.nom_complet}</p>
                      <p className="text-sm text-neutral-600">
                        {exchange.objet1?.titre} ↔ {exchange.objet2?.titre}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant={
                            exchange.statut === "valide"
                              ? "default"
                              : exchange.statut === "refuse"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {exchange.statut === "en_attente" && "En attente"}
                          {exchange.statut === "valide" && "Accepté"}
                          {exchange.statut === "refuse" && "Refusé"}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          {new Date(exchange.date_demande).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-4 text-neutral-500 text-sm">Aucun échange en cours.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Items */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Objets recommandés pour vous</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-center py-8 text-neutral-500">Chargement...</p>
          ) : recommendedItems.length > 0 ? (
            recommendedItems.slice(0, 4).map((item) => (
              <Link key={item.id_objet} to={`/user/item/${item.id_objet}`}>
                <div className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden">
                    <ImageSlider 
                      images={[
                        ...(item.image ? [getStorageUrl(item.image)!] : []),
                        ...(item.images?.map((img: any) => getStorageUrl(img.image_url)!) || [])
                      ]} 
                      alt={item.titre} 
                    />
                    {/* Availability Badge */}
                    <div className="absolute left-2 top-2 z-10">
                      <Badge 
                        className={`${
                          item.disponibilite === 'echange' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          item.disponibilite === 'reserve' ? 'bg-neutral-500 hover:bg-neutral-600' : 
                          'bg-green-500 hover:bg-green-600'
                        } text-white text-[9px] px-1.5 py-0 uppercase font-bold`}
                      >
                        {item.disponibilite === 'echange' ? 'Échange' : 
                         item.disponibilite === 'reserve' ? 'Réservé' : 
                         item.disponibilite === 'disponible' ? 'Dispo' : item.disponibilite}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium line-clamp-1">{item.titre}</p>
                    <p className="text-sm text-neutral-600">{item.user?.ville || "Ville"}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={getStorageUrl(item.user?.photo_profil) || undefined} alt={item.user?.nom_complet} />
                        <AvatarFallback>{item.user?.nom_complet?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-neutral-500 line-clamp-1">{item.user?.nom_complet || "Utilisateur"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center py-8 text-neutral-500">Aucun objet recommandé pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
