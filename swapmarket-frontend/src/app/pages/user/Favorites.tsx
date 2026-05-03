import { Link } from "react-router";
import { Heart, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { toast } from "sonner";
import { ImageSlider } from "../../components/ImageSlider";

export function Favorites() {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favoris`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setFavoriteItems(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Erreur lors du chargement des favoris.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, objetId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favoris/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ id_objet: objetId })
      });

      if (response.ok) {
        setFavoriteItems(prev => prev.filter(f => f.id_objet !== objetId));
        toast.success("Retiré des favoris.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Une erreur est survenue.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-olive" />
        <p className="mt-4 text-neutral-500">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Mes favoris</h1>
        <p className="text-neutral-600">
          Vous avez {favoriteItems.length} objet{favoriteItems.length > 1 ? "s" : ""} en favoris
        </p>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16">
          <Heart className="mb-4 h-16 w-16 text-neutral-300" />
          <h2 className="mb-2 text-xl font-bold">Aucun favori</h2>
          <p className="mb-6 text-neutral-600">
            Ajoutez des objets à vos favoris pour les retrouver facilement
          </p>
          <Link to="/user/search">
            <Button className="bg-olive text-black hover:bg-olive/90">Découvrir des objets</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteItems.map((fav) => {
            const item = fav.objet;
            if (!item) return null;
            
            return (
              <div
                key={fav.id_favori}
                className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-lg"
              >
                <Link to={`/user/item/${item.id_objet}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageSlider 
                      images={[
                        ...(item.image ? [getStorageUrl(item.image)!] : []),
                        ...(item.images?.map((img: any) => getStorageUrl(img.image_url)!) || [])
                      ]} 
                      alt={item.titre} 
                    />
                    <button
                      onClick={(e) => handleToggleFavorite(e, item.id_objet)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white z-30"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/user/item/${item.id_objet}`}>
                    <h3 className="mb-2 font-semibold line-clamp-1 hover:text-olive">
                      {item.titre}
                    </h3>
                  </Link>
                  <p className="mb-3 text-sm text-neutral-600 line-clamp-2">{item.description}</p>

                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-olive/10 text-olive border-none">
                      {item.categorie?.nom || "Autre"}
                    </Badge>
                    <Badge variant="outline" className="text-neutral-500 capitalize">
                      {item.etat}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getStorageUrl(item.user?.photo_profil) || undefined} alt={item.user?.nom_complet} />
                        <AvatarFallback>{item.user?.nom_complet?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-neutral-600">{item.user?.nom_complet}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{item.user?.ville || "Casablanca"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
