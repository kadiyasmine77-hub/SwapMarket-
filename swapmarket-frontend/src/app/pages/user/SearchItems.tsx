import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ImageSlider } from "../../components/ImageSlider";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function SearchItems() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));

    // Fetch all items
    fetch(`${API_BASE_URL}/objets`)
      .then(res => res.json())
      .then(data => {
        // data might be paginated
        setItems(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      (item.titre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.id_categorie?.toString() === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.etat === selectedStatus;
    const matchesAvailability = selectedAvailability === "all" || item.disponibilite === selectedAvailability;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAvailability;
  });

  const handleToggleFavorite = async (e: React.MouseEvent, objetId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (currentUser?.role === 'admin') {
      toast.info("Vous êtes connecté en tant qu'administrateur. Cette action est réservée aux comptes utilisateurs.");
      return;
    }

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
        const data = await response.json();
        setItems(prev => prev.map(item => 
          item.id_objet === objetId ? { ...item, is_favorited: data.status === 'added' } : item
        ));
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('search.title')}</h1>
        <p className="text-neutral-600">
          {t('search.subtitle', { count: items.length })}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 rounded-xl border bg-white p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder={t('admin.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="hidden sm:inline">{t('search.filters')}</span>
          </Button>
        </div>

        {showFilters && (
          <div className="grid gap-4 border-t pt-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('search.category')}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all_categories')}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id_categorie} value={cat.id_categorie.toString()}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('search.condition')}</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all_conditions')}</SelectItem>
                  <SelectItem value="neuf">{t('common.new')}</SelectItem>
                  <SelectItem value="bon">{t('common.good')}</SelectItem>
                  <SelectItem value="moyen">{t('common.fair')}</SelectItem>
                  <SelectItem value="mauvais">{t('common.fair')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('search.availability')}</label>
              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all_availabilities')}</SelectItem>
                  <SelectItem value="disponible">{t('common.available')}</SelectItem>
                  <SelectItem value="echange">{t('common.exchanged')}</SelectItem>
                  <SelectItem value="reserve">{t('common.reserved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Categories Quick Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          {t('search.all_availabilities')}
        </Button>
        {categories.slice(0, 6).map((cat) => (
          <Button
            key={cat.id_categorie}
            variant={selectedCategory === cat.id_categorie.toString() ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id_categorie.toString())}
          >
            {cat.nom}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div>
        <p className="mb-4 text-sm text-neutral-600">
          {filteredItems.length > 1 
            ? t('search.results_found_plural', { count: filteredItems.length })
            : t('search.results_found', { count: filteredItems.length })}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center py-12 text-neutral-500">{t('common.loading')}</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id_objet} className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageSlider 
                    images={[
                      ...(item.image ? [getStorageUrl(item.image)!] : []),
                      ...(item.images?.map((img: any) => getStorageUrl(img.image_url)!) || [])
                    ]} 
                    alt={item.titre} 
                  />
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, item.id_objet)}
                    className="absolute right-3 top-3 z-30 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <Heart className={`h-5 w-5 ${item.is_favorited ? "fill-red-500 text-red-500" : "text-neutral-400"}`} />
                  </button>
                  {/* Availability Badge */}
                  <div className="absolute left-3 top-3 z-10">
                    <Badge 
                      className={`${
                        item.disponibilite === 'echange' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                        item.disponibilite === 'reserve' ? 'bg-neutral-500 hover:bg-neutral-600' : 
                        'bg-green-500 hover:bg-green-600'
                      } text-white text-[10px] uppercase font-bold`}
                    >
                      {item.disponibilite === 'echange' ? t('common.exchanged') : 
                       item.disponibilite === 'reserve' ? t('common.reserved') : 
                       item.disponibilite === 'disponible' ? t('common.available') : item.disponibilite}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <Link to={`/user/item/${item.id_objet}`}>
                    <h3 className="mb-2 font-semibold line-clamp-1 hover:text-blue-600">{item.titre}</h3>
                  </Link>
                  <p className="mb-3 text-sm text-neutral-600 line-clamp-2">{item.description}</p>

                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary">{item.categorie?.nom || t('search.category')}</Badge>
                    <Badge variant="outline">{item.etat}</Badge>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getStorageUrl(item.user?.photo_profil) || undefined} alt={item.user?.nom_complet} />
                        <AvatarFallback>{item.user?.nom_complet?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-neutral-600">{item.user?.nom_complet || t('common.user')}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{item.user?.ville || t('profile.city')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-12 text-neutral-500">{t('search.no_results')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
