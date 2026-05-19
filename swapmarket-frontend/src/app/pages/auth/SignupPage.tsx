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

export function SignupPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    phone: "",
    birthDate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = t('validation.required', { attribute: t('auth.full_name') });
    if (!formData.email) newErrors.email = t('validation.required', { attribute: t('auth.email') });
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.error_email_invalid');
    }

    if (!formData.city) newErrors.city = t('validation.required', { attribute: t('auth.city') });
    if (!formData.password) newErrors.password = t('validation.required', { attribute: t('auth.password') });

    if (formData.city && /[0-9]/.test(formData.city)) {
      newErrors.city = t('auth.error_city_numbers');
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = t('auth.error_phone_invalid');
    }

    const isValidPassword = 
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /[0-9]/.test(formData.password) &&
      /[@$!%*#?&_\-\+\=\(\)\[\]\{\}\.\,\;]/.test(formData.password);

    if (formData.password && !isValidPassword) {
      newErrors.password = t('auth.error_password_invalid');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.error_password_match');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        nom_complet: formData.name,
        email: formData.email,
        ville: formData.city,
        telephone: formData.phone,
        date_naissance: formData.birthDate,
        mot_de_passe: formData.password,
        mot_de_passe_confirmation: formData.confirmPassword,
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(t('auth.success_signup'));
        navigate("/user");
      } else if (response.status === 422) {
        const backendErrors: Record<string, string> = {};
        if (data.errors) {
          Object.keys(data.errors).forEach(key => {
            let frontendKey = key;
            if (key === 'nom_complet') frontendKey = 'name';
            if (key === 'telephone') frontendKey = 'phone';
            if (key === 'ville') frontendKey = 'city';
            if (key === 'date_naissance') frontendKey = 'birthDate';
            if (key === 'mot_de_passe') frontendKey = 'password';
            
            backendErrors[frontendKey] = data.errors[key][0];
          });
        }
        setErrors(backendErrors);
        toast.error(t('publish_edit.error_validation'));
      } else {
        const errorMessage = data.message || t('auth.error_server');
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(t('auth.error_server'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
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
      <div className="hidden w-1/2 bg-primary lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <div className="flex items-center">
            <img src={logoImage} alt="SwapMarket" className="h-12 w-auto brightness-0 invert" />
          </div>

          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold">
              {t('auth.hero_signup_title')}
            </h1>
            <p className="text-lg text-white/80">
              {t('auth.hero_signup_subtitle')}
            </p>
          </div>

          <div className="text-sm text-white/80">
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
            <h2 className="mb-2 text-3xl font-bold">{t('auth.signup_title')}</h2>
            <p className="text-neutral-600">
              {t('auth.signup_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.full_name')}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t('auth.placeholder_name')}
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500 ring-red-500/20" : ""}
              />
              <ErrorMessage message={errors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.placeholder_email')}
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500 ring-red-500/20" : ""}
              />
              <ErrorMessage message={errors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('auth.city')}</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder={t('auth.placeholder_city')}
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? "border-red-500 ring-red-500/20" : ""}
              />
              <ErrorMessage message={errors.city} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t('auth.placeholder_phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500 ring-red-500/20" : ""}
                />
                <ErrorMessage message={errors.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t('auth.birth_date')}</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={errors.birthDate ? "border-red-500 ring-red-500/20" : ""}
                />
                <ErrorMessage message={errors.birthDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.placeholder_password')}
                  value={formData.password}
                  onChange={handleChange}
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
              <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('auth.placeholder_password')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('auth.signup_button')}
            </Button>

            <div className="text-center text-sm text-neutral-600">
              {t('auth.has_account')}{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t('auth.login_button')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
