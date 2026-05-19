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
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchItems = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      per_page: "12"
    });
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory !== "all") params.append("categorie", selectedCategory);
    if (selectedStatus !== "all") params.append("etat", selectedStatus);
    if (selectedAvailability !== "all") params.append("disponibilite", selectedAvailability);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/objets?${params}`, { headers })
      .then(res => res.json())
      .then(data => {
        setItems(data.data || []);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Fetch categories once
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Effect to fetch items when filters or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(1);
    }, 400); // Small debounce for search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedStatus, selectedAvailability]);

  const handlePageChange = (newPage: number) => {
    fetchItems(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (e: React.MouseEvent, objetId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser || !token) {
      toast.info(t('items.must_be_logged_fav'));
      return;
    }

    if (currentUser.role === 'admin') {
      toast.info(t('items.admin_restricted'));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favoris/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ id_objet: objetId })
      });

      const data = await response.json();
      if (response.ok) {
        setItems(prev => prev.map(item => 
          item.id_objet === objetId ? { ...item, is_favorited: data.status === 'added' } : item
        ));
        toast.success(data.message);
      } else {
        toast.error(data.message || t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(t('admin.update_error'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('search.title')}</h1>
        <p className="text-neutral-600">
          {t('search.subtitle', { count: total })}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 rounded-xl border bg-white p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder={t('search.search_placeholder')}
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
                      {t(`categories_list.${cat.nom}`, cat.nom)}
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
            {t(`categories_list.${cat.nom}`, cat.nom)}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div>
        <p className="mb-4 text-sm text-neutral-600">
          {total > 1 
            ? t('search.results_found_plural', { count: total })
            : t('search.results_found', { count: total })}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center py-12 text-neutral-500">{t('common.loading')}</p>
          ) : items.length > 0 ? (
            items.map((item) => (
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

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {t('explore.previous')}
            </Button>
            
            <div className="flex items-center gap-1 mx-4">
              <span className="text-sm font-medium">{currentPage}</span>
              <span className="text-sm text-neutral-400">/</span>
              <span className="text-sm text-neutral-400">{lastPage}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {t('explore.next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
