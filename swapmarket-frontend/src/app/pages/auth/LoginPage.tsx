import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import logoImage from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import { useLanguage } from "../../LanguageContext";

// Had l-page kat-khalli l-user idkhol l-compte dyalo (Se connecter)
export function LoginPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Had l-fonction kat-verify email o modepasse o kat-sift request l-backend bash l-user idkhol
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = t('validation.required', { attribute: t('auth.email') });
    if (!password) newErrors.password = t('validation.required', { attribute: t('auth.password') });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify({ email, mot_de_passe: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          toast.success(t('auth.success_admin'));
          navigate("/admin");
        } else {
          toast.success(t('auth.success_user'));
          navigate("/user");
        }
      } else if (response.status === 422) {
        const backendErrors: Record<string, string> = {};
        if (data.errors) {
          Object.keys(data.errors).forEach(key => {
            let frontendKey = key;
            if (key === 'mot_de_passe') frontendKey = 'password';
            backendErrors[frontendKey] = data.errors[key][0];
          });
        }
        setErrors(backendErrors);
      } else if (response.status === 401) {
        setErrors({ password: data.message || t('auth.error_login') });
      } else {
        toast.error(data.message || t('auth.error_login'));
      }
    } catch (error) {
      toast.error(t('auth.error_server'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Had l-composant kat-affichie l-message d-erreur ila nsa user shi haja ola khlat
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
              {t('auth.hero_title')}
            </h1>
            <p className="text-lg text-blue-100">
              {t('auth.hero_subtitle')}
            </p>
          </div>

          <div className="text-sm text-blue-100">
            © 2026 SwapMarket. {t('common.all_rights_reserved')}
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
            <h2 className="mb-2 text-3xl font-bold">{t('auth.login_title')}</h2>
            <p className="text-neutral-600">
              {t('auth.login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.placeholder_email')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "border-amber-500 ring-amber-500/20" : ""}
              />
              <ErrorMessage message={errors.email} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link to="/forgot-password" title={t('auth.forgot_password')} className="text-sm text-blue-600 hover:underline">
                  {t('auth.forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.placeholder_password')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "border-amber-500 ring-amber-500/20 pr-10" : "pr-10"}
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

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('auth.login_button')}
            </Button>

            <div className="text-center text-sm text-neutral-600">
              {t('auth.no_account')}{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                {t('auth.create_account')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
