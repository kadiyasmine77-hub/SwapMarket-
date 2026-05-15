import { useState } from "react";
import { X } from "lucide-react";
import logoImage from "../../../assets/logo.png";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";

import { useLanguage } from "../../LanguageContext";

export function ForgotPasswordPage() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setErrors({});
    if (!email) {
      setErrors({ email: t('validation.required', { attribute: t('auth.email') }) });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Email envoyé avec succès.");
        setEmail(""); // Reset input
      } else if (response.status === 422) {
        if (data.errors) {
          const backendErrors: any = {};
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
        }
      } else {
        toast.error(data.message || "Erreur lors de l'envoi de l'email.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
      console.error(error);
    } finally {
      setLoading(false);
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
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden w-1/2 bg-blue-600 lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <div className="flex items-center">
            <img src={logoImage} alt="SwapMarket" className="h-12 w-auto brightness-0 invert" />
          </div>

          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold">
              Réinitialisation<br />de mot de passe
            </h1>
            <p className="text-lg text-blue-100">
              Pas de panique, nous allons vous aider à récupérer votre compte rapidement.
            </p>
          </div>

          <div className="text-sm text-blue-100">
            © 2026 SwapMarket. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src={logoImage} alt="SwapMarket" className="h-12 w-auto" />
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Mot de passe oublié</h2>
            <p className="text-neutral-600">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "border-amber-500 ring-amber-500/20" : ""}
              />
              <ErrorMessage message={errors.email} />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>

            <div className="text-center text-sm text-neutral-600">
              Je me souviens de mon mot de passe.{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
