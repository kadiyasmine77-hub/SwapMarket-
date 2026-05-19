import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Eye, EyeOff, X } from "lucide-react";
import logoImage from "../../../assets/logo.png";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";

import { useLanguage } from "../../LanguageContext";

export function ResetPasswordPage() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!password) newErrors.password = t('validation.required', { attribute: t('auth.password') });

    const isValidPassword = 
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*#?&_\-\+\=\(\)\[\]\{\}\.\,\;]/.test(password);

    if (password && !isValidPassword) {
      newErrors.password = t('auth.error_password_invalid');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.error_password_match');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify({
          email,
          token,
          mot_de_passe: password,
          mot_de_passe_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Mot de passe réinitialisé avec succès.");
        navigate("/login");
      } else if (response.status === 422) {
        if (data.errors) {
          const backendErrors: any = {};
          Object.keys(data.errors).forEach(key => {
            let frontendKey = key;
            if (key === 'mot_de_passe') frontendKey = 'password';
            if (key === 'mot_de_passe_confirmation') frontendKey = 'confirmPassword';
            backendErrors[frontendKey] = data.errors[key][0];
          });
          setErrors(backendErrors);
        }
      } else {
        toast.error(data.message || "Erreur lors de la réinitialisation.");
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
        <div className="bg-red-500 rounded p-0.5">
          <X className="h-3 w-3 text-white stroke-[3px]" />
        </div>
        <span className="text-xs font-medium text-red-600">{message}</span>
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
              Nouveau<br />mot de passe
            </h1>
            <p className="text-lg text-blue-100">
              Choisissez un mot de passe sécurisé pour retrouver l'accès à votre compte.
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
            <h2 className="mb-2 text-3xl font-bold">Nouveau mot de passe</h2>
            <p className="text-neutral-600">
              Saisissez votre nouveau mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "border-red-500 ring-red-500/20 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <ErrorMessage message={errors.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={errors.confirmPassword ? "border-red-500 ring-red-500/20 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <ErrorMessage message={errors.confirmPassword} />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !token}>
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
