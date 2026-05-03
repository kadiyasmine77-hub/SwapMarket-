import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getStorageUrl } from "../../config";

export function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{id: number | string, url: string, isMain: boolean}[]>([]); 
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]); 
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));

    // Fetch item data
    fetch(`${API_BASE_URL}/objets/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.titre,
          description: data.description,
          category: data.id_categorie.toString(),
          condition: data.etat,
          location: data.user?.ville || "",
        });
        
        // Build existing image objects
        const allImages: any[] = [];
        if (data.image) {
          allImages.push({ id: 'main', url: getStorageUrl(data.image)!, isMain: true });
        }
        if (data.images && data.images.length > 0) {
          data.images.forEach((img: any) => {
            allImages.push({ id: img.id_image, url: getStorageUrl(img.image_url)!, isMain: false });
          });
        }
        setExistingImages(allImages);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching item:", err);
        toast.error("Impossible de charger les données de l'objet.");
        setLoading(false);
      });
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (index: number) => {
    const imgToRemove = existingImages[index];
    if (imgToRemove.id !== 'main') {
      setDeletedImageIds(prev => [...prev, imgToRemove.id as number]);
    }
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Combined previews for display
  const allPreviews = [...existingImages.map(img => img.url), ...newPreviews];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('_method', 'PUT'); // Laravel trick for FormData with PUT
      data.append('titre', formData.title);
      data.append('description', formData.description);
      data.append('id_categorie', formData.category);
      data.append('etat', formData.condition);
      
      // Send ALL new images as gallery
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          data.append('gallery[]', selectedFiles[i]);
        }
      }

      // Send deleted image IDs
      deletedImageIds.forEach(id => {
        data.append('deleted_images[]', id.toString());
      });

      const response = await fetch(`${API_BASE_URL}/objets/${id}`, {
        method: "POST", // Use POST with _method=PUT for FormData
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Objet mis à jour avec succès !");
        navigate("/user/profile");
      } else if (response.status === 422) {
        // Validation errors from Backend (lang folder)
        const backendErrors: Record<string, string> = {};
        if (result.errors) {
          Object.keys(result.errors).forEach(key => {
            // Map backend keys to frontend keys
            let frontendKey = key;
            if (key === 'titre') frontendKey = 'title';
            if (key === 'id_categorie') frontendKey = 'category';
            if (key === 'etat') frontendKey = 'condition';
            if (key === 'image') frontendKey = 'images';
            
            backendErrors[frontendKey] = result.errors[key][0];
          });
        }
        setErrors(backendErrors);
        toast.error("Veuillez corriger les erreurs.");
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Erreur de connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="bg-amber-500 rounded p-0.5">
          <X className="h-3 w-3 text-white stroke-[3px]" />
        </div>
        <span className="text-xs font-medium text-amber-600">{message}</span>
      </div>
    );
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Modifier l'objet</h1>
        <p className="text-neutral-600">Modifiez les informations de votre annonce</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6">
        <div className="space-y-2">
          <Label>Photos de l'objet</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {existingImages.map((img, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square overflow-hidden rounded-lg border">
                <img src={img.url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  {img.isMain ? 'Principale' : 'Galerie'}
                </span>
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {newPreviews.map((img, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square overflow-hidden rounded-lg border border-green-300">
                <img src={img} alt={`Nouvelle ${idx + 1}`} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-green-600/80 px-1.5 py-0.5 text-[10px] text-white">Nouvelle</span>
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {allPreviews.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-olive hover:bg-olive/5">
                <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                <span className="text-sm text-neutral-600">Ajouter une photo</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <ErrorMessage message={errors.images} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Titre de l'annonce *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-amber-500 ring-amber-500/20" : ""}
          />
          <ErrorMessage message={errors.title} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={errors.description ? "border-amber-500 ring-amber-500/20" : ""}
          />
          <ErrorMessage message={errors.description} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className={errors.category ? "border-amber-500 ring-amber-500/20" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id_categorie} value={cat.id_categorie.toString()}>
                    {cat.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage message={errors.category} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">État *</Label>
            <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)}>
              <SelectTrigger className={errors.condition ? "border-amber-500 ring-amber-500/20" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neuf">Neuf</SelectItem>
                <SelectItem value="bon">Bon état</SelectItem>
                <SelectItem value="moyen">État moyen</SelectItem>
                <SelectItem value="mauvais">Mauvais état</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage message={errors.condition} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/user/profile")} size="lg">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
