import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Star, Package, TrendingUp, Settings, Camera, Eye, EyeOff } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ImageSlider } from "../../components/ImageSlider";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { useLanguage } from "../../LanguageContext";

export function UserProfile() {
  const { t } = useLanguage();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const navigate = useNavigate();

  const { id } = useParams();
  const profileId = id ? Number(id) : (currentUser?.id_user || currentUser?.id);
  const isOwnProfile = !id || (currentUser && profileId === currentUser.id_user);

  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);

  // Use targetUser for everything if available, otherwise fallback to currentUser only for basic info
  const displayUser = targetUser || currentUser;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    birthDate: "",
  });

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      setFormData({
        name: currentUser.nom_complet || "",
        phone: currentUser.telephone || "",
        city: currentUser.ville || "",
        birthDate: currentUser.date_naissance || "",
      });
    }
  }, [isOwnProfile, currentUser]);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    setLoadingReviews(true);
    setLoadingItems(true);

    // Always fetch user profile to get fresh stats
    setLoadingProfile(true);
    const token = localStorage.getItem('token');
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    fetch(`${API_BASE_URL}/users/${profileId}/profile`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTargetUser(data);
        }
        setLoadingProfile(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoadingProfile(false);
      });

    // Fetch reviews
    fetch(`${API_BASE_URL}/users/${profileId}/reviews`, { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
        setLoadingReviews(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setLoadingReviews(false);
      });

    // Fetch items
    fetch(`${API_BASE_URL}/objets?user_id=${profileId}`)
      .then(res => res.json())
      .then(data => {
        setMyItems(data.data || []);
        setLoadingItems(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoadingItems(false);
      });
  }, [profileId, isOwnProfile]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      // Laravel requires _method=PUT for multipart/form-data with PUT
      data.append('_method', 'PUT');
      data.append('nom_complet', formData.name);
      data.append('telephone', formData.phone);
      data.append('ville', formData.city);
      data.append('date_naissance', formData.birthDate);
      
      if (profilePhoto) {
        data.append('photo_profil', profilePhoto);
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST", // Use POST with _method=PUT
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: data
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser.user || updatedUser));
        toast.success(t('profile.success_update'));
        setIsEditing(false);
        // Refresh page or state to show new data
        window.location.reload();
      } else {
        toast.error(t('profile.error_update'));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t('auth.error_server'));
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm(t('publish_edit.confirm_delete'))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/objets/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        }
      });

      if (response.ok) {
        setMyItems(myItems.filter(item => item.id_objet !== itemId));
        toast.success(t('publish_edit.success_delete'));
      } else {
        toast.error(t('publish_edit.error_delete'));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(t('auth.error_server'));
    }
  };



  const handlePasswordUpdate = async () => {
    setPasswordErrors({});
    if (!currentPassword) {
      setPasswordErrors({ current_password: t('profile.error_current_password_required') });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErrors({ new_password: t('profile.error_password_min') });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrors({ new_password_confirmation: t('profile.error_passwords_match') });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profil/password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('profile.success_password_update'));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors({});
      } else {
        if (data.errors) {
          // Validation errors from Laravel
          const formattedErrors: any = {};
          Object.keys(data.errors).forEach(key => {
            formattedErrors[key] = data.errors[key][0];
          });
          setPasswordErrors(formattedErrors);
        } else {
          // Custom error (like wrong current password)
          setPasswordErrors({ form: data.message || t('profile.error_update_password') });
        }
        toast.error(t('publish_edit.error_validation'));
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(t('auth.error_server'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-2 border-olive/20 overflow-hidden">
              <AvatarImage src={photoPreview || getStorageUrl(displayUser?.photo_profil) || undefined} alt={displayUser?.nom_complet} className="object-cover" />
              <AvatarFallback className="text-3xl bg-olive/10 text-olive">
                {displayUser?.nom_complet?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <label 
                htmlFor="photo-upload" 
                className="absolute -bottom-1 -right-1 rounded-full bg-olive p-2.5 text-black hover:bg-olive/90 cursor-pointer shadow-xl transition-all hover:scale-110 z-10 border-2 border-white"
              >
                <Camera className="h-4 w-4" />
                <input 
                  id="photo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePhoto(file);
                      setPhotoPreview(URL.createObjectURL(file));
                      setIsEditing(true); // Switch to editing mode when photo changes
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('profile.name')}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('profile.phone')}</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('profile.birth_date')}</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('profile.city')}</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>{t('common.save')}</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h1 className="mb-1 text-2xl font-bold">{displayUser?.nom_complet || t('common.user')}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">📞 {t('profile.phone')}:</span> {displayUser?.telephone || "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">📅 {t('profile.birth_date')}:</span> {displayUser?.date_naissance || "—"}
                      </div>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-olive text-olive hover:bg-olive/5">
                      {t('common.edit')}
                    </Button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{displayUser?.avg_rating || "0.0"}</span>
                    <span className="text-sm text-neutral-600">{t('profile.trust_score')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-olive" />
                    <span className="font-medium">{displayUser?.echanges_count || "0"}</span>
                    <span className="text-sm text-neutral-600">{t('profile.successful_swaps')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-olive" />
                    <span className="font-medium">{myItems.length}</span>
                    <span className="text-sm text-neutral-600">{t('profile.published_items')}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="items">{t('profile.my_objects')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('profile.received_reviews')}</TabsTrigger>
          <TabsTrigger value="settings">{t('profile.settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{t('profile.my_objects')} ({myItems.length})</h2>
            <Link to="/user/publish">
              <Button>{t('common.publish')}</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingItems ? (
              <p className="col-span-full text-center py-8 text-neutral-500">{t('common.loading')}</p>
            ) : myItems.length > 0 ? (
              myItems.map((item) => (
                <div key={item.id_objet} className="group overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageSlider 
                      images={[
                        ...(item.image ? [getStorageUrl(item.image)!] : []),
                        ...(item.images?.map((img: any) => getStorageUrl(img.image_url)!) || [])
                      ]} 
                      alt={item.titre} 
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold line-clamp-1">{item.titre}</h3>
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
                    <p className="mb-3 text-sm text-neutral-600 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      <Badge variant="outline" className="text-[10px]">
                        {item.categorie?.nom || '—'}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.etat}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/user/item/edit/${item.id_objet}`)}
                            className="flex-1 text-xs border-olive text-olive hover:bg-olive/5"
                          >
                            {t('common.edit')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteItem(item.id_objet)}
                            className="flex-1 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20"
                          >
                            {t('common.delete')}
                          </Button>
                        </>
                      ) : (
                        <Link 
                          to={`/user/item/${item.id_objet}`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs border-olive text-olive hover:bg-olive/5">
                            {t('common.view_all')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-neutral-50 rounded-xl border-2 border-dashed">
                <p className="text-neutral-500 mb-4">{t('dashboard.no_recommended')}</p>
                <Link to="/user/publish">
                  <Button variant="outline" className="border-olive text-olive">{t('common.publish')}</Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <h2 className="text-xl font-bold">{t('profile.received_reviews')} ({reviews.length})</h2>
          <div className="space-y-4">
            {loadingReviews ? (
              <p className="text-center py-8 text-neutral-500">{t('common.loading')}</p>
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={review.id_avis || idx} className="rounded-lg border bg-white p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={getStorageUrl(review.user?.photo_profil) || undefined} alt={review.user?.nom_complet} />
                      <AvatarFallback>{review.user?.nom_complet?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{review.user?.nom_complet}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.note ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-700">{review.commentaire}</p>
                  {review.objet && (
                    <p className="mt-2 text-xs text-olive italic">Objet: {review.objet.titre}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-xl border-2 border-dashed">
                <p className="text-neutral-500">{t('profile.received_reviews')} (0)</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{t('profile.change_password')}</h2>
            
            {passwordErrors.form && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {passwordErrors.form}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('profile.current_password')}</Label>
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={passwordErrors.current_password ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.current_password && <p className="text-sm text-destructive">{passwordErrors.current_password}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t('profile.new_password')}</Label>
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={passwordErrors.new_password ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.new_password && <p className="text-sm text-destructive">{passwordErrors.new_password}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t('profile.confirm_password')}</Label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={passwordErrors.new_password_confirmation ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.new_password_confirmation && <p className="text-sm text-destructive">{passwordErrors.new_password_confirmation}</p>}
              </div>

              <Button onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>
                {isUpdatingPassword ? t('common.loading') : t('profile.update_password')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
