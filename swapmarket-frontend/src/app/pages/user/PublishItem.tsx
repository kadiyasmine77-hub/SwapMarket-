import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";

export function PublishItem() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      toast.error("Maximum 5 photos autorisées");
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    if (errors.images || errors.image) setErrors({ ...errors, images: "", image: "" });
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('titre', formData.title);
      data.append('description', formData.description);
      data.append('id_categorie', formData.category);
      data.append('etat', formData.condition);
      
      if (selectedFiles.length > 0) {
        data.append('image', selectedFiles[0]); // Image principale
        for (let i = 1; i < selectedFiles.length; i++) {
          data.append('gallery[]', selectedFiles[i]);
        }
      }

      const response = await fetch(`${API_BASE_URL}/objets`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Votre objet a été publié avec succès !");
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
        toast.error("Veuillez corriger les erreurs dans le formulaire.");
      } else {
        toast.error(result.message || "Une erreur est survenue lors de la publication.");
      }
    } catch (error) {
      console.error("Error publishing item:", error);
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Publier un objet</h1>
        <p className="text-neutral-600">
          Remplissez les informations ci-dessous pour proposer votre objet à l'échange
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6">
        {/* Images */}
        <div className="space-y-2">
          <Label>Photos de l'objet</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {previews.map((img, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border">
                <img src={img} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-olive hover:bg-olive/5">
                <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                <span className="text-sm text-neutral-600">Ajouter une photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
          <p className="text-xs text-neutral-500">Maximum 5 photos. Première photo = photo principale</p>
          <ErrorMessage message={errors.images} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre de l'annonce *</Label>
          <Input
            id="title"
            placeholder="Ex: Appareil photo Canon EOS 2000D"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-amber-500 ring-amber-500/20" : ""}
          />
          <ErrorMessage message={errors.title} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Décrivez votre objet en détail : état, accessoires inclus, raison de l'échange..."
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={errors.description ? "border-amber-500 ring-amber-500/20" : ""}
          />
          <ErrorMessage message={errors.description} />
        </div>

        {/* Category & Condition */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className={errors.category ? "border-amber-500 ring-amber-500/20" : ""}>
                <SelectValue placeholder="Choisir une catégorie" />
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
            <Select onValueChange={(value) => handleChange("condition", value)}>
              <SelectTrigger className={errors.condition ? "border-amber-500 ring-amber-500/20" : ""}>
                <SelectValue placeholder="Choisir un état" />
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

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Localisation *</Label>
          <Input
            id="location"
            placeholder="Ville ou code postal"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={errors.location ? "border-amber-500 ring-amber-500/20" : ""}
          />
          <ErrorMessage message={errors.location} />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/user")}
            size="lg"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
