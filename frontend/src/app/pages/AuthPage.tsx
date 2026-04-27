import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';

// Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const { language, loginUser } = useStore();
  const t = useTranslation(language);

  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requireOtp, setRequireOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      setError(language === 'uz' ? 'Barcha maydonlarni to\'ldiring' : language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return false;
    }
    
    if (!formData.email.endsWith('@gmail.com')) {
      setError(language === 'uz' ? 'Faqat @gmail.com emaillari ruxsat etiladi' : 'Only @gmail.com emails are allowed');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError(language === 'uz' ? 'Ismingizni kiriting' : language === 'ru' ? 'Введите имя' : 'Enter your name');
        return false;
      }
      if (formData.password.length < 6) {
        setError(language === 'uz' ? 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' : language === 'ru' ? 'Пароль должен быть не менее 6 символов' : 'Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'uz' ? 'Parollar mos kelmaydi' : language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(`http://localhost:5002${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || (language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'));
      } else {
        if (data.requireOtp) {
          setRequireOtp(true);
          setRegisteredEmail(data.email);
          setSuccess(language === 'uz' ? 'Tasdiqlash kodi elektron pochtangizga yuborildi' : 'Verification code sent to your email');
        } else {
          loginUser(data.user, data.token);
          if (!isLogin) {
            setSuccess(language === 'uz' ? 'Ro\'yxatdan o\'tish muvaffaqiyatli!' : language === 'ru' ? 'Регистрация успешна!' : 'Registration successful!');
            setTimeout(() => navigate('/'), 1500);
          } else {
            navigate('/');
          }
        }
      }
    } catch {
      setError(language === 'uz' ? 'Server bilan bog\'lanib bo\'lmadi' : language === 'ru' ? 'Не удалось подключиться к серверu' : 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to backend Google OAuth
    window.location.href = 'http://localhost:5002/api/auth/google';
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError(language === 'uz' ? 'Kodni to\'ri kiriting (6 ta belgi)' : 'Please enter valid 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5002/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
      } else {
        loginUser(data.user, data.token);
        setSuccess(language === 'uz' ? 'Tasdiqlandi!' : 'Verified!');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch {
      setError(language === 'uz' ? 'Server xatosi' : 'Server error');
    } finally {
      setLoading(false);
    }
  };


  const labels = {
    uz: {
      loginTitle: 'Xush kelibsiz',
      loginSub: 'Hisobingizga kiring',
      registerTitle: 'Ro\'yxatdan o\'tish',
      registerSub: 'Yangi hisob yarating',
      name: 'To\'liq ism',
      email: 'Email manzil (@gmail.com)',
      password: 'Parol',
      confirmPass: 'Parolni tasdiqlang',
      loginBtn: 'Kirish',
      registerBtn: 'Ro\'yxatdan o\'tish',
      orContinue: 'yoki davom eting',
      googleBtn: 'Google orqali kirish',
      noAccount: 'Hisobingiz yo\'qmi?',
      hasAccount: 'Hisobingiz bormi?',
      register: 'Ro\'yxatdan o\'ting',
      login: 'Kiring',
      namePlaceholder: 'Ism Familiya',
      emailPlaceholder: 'example@gmail.com',
      passPlaceholder: '••••••••',
    },
    ru: {
      loginTitle: 'Добро пожаловать',
      loginSub: 'Войдите в свой аккаунт',
      registerTitle: 'Регистрация',
      registerSub: 'Создайте новый аккаунт',
      name: 'Полное имя',
      email: 'Электронная почта (@gmail.com)',
      password: 'Пароль',
      confirmPass: 'Подтвердите пароль',
      loginBtn: 'Войти',
      registerBtn: 'Зарегистрироваться',
      orContinue: 'или продолжить через',
      googleBtn: 'Войти через Google',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      register: 'Зарегистрируйтесь',
      login: 'Войдите',
      namePlaceholder: 'Имя Фамилия',
      emailPlaceholder: 'example@gmail.com',
      passPlaceholder: '••••••••',
    },
    en: {
      loginTitle: 'Welcome Back',
      loginSub: 'Sign in to your account',
      registerTitle: 'Create Account',
      registerSub: 'Register for a new account',
      name: 'Full Name',
      email: 'Email Address (@gmail.com)',
      password: 'Password',
      confirmPass: 'Confirm Password',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      orContinue: 'or continue with',
      googleBtn: 'Continue with Google',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      register: 'Register',
      login: 'Sign in',
      namePlaceholder: 'John Doe',
      emailPlaceholder: 'example@gmail.com',
      passPlaceholder: '••••••••',
    },
  };

  const l = labels[language] || labels.uz;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl">
            <span className="font-['Montserrat'] text-4xl font-bold">S</span>
          </div>
          <h1 className="font-['Montserrat'] text-4xl font-bold mb-4">
            Sofia Shop
          </h1>
          <p className="text-lg text-white/80 mb-12 max-w-xs">
            Go'zallik va texnologiya — bir joyda
          </p>
          {/* Feature list */}
          {['Eksklyuziv chegirmalar', 'Tez yetkazib berish', '30 kunlik qaytarish'].map((feat) => (
            <div key={feat} className="flex items-center gap-3 mb-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-['Montserrat'] text-lg font-bold text-white">S</span>
              </div>
              <span className="font-['Montserrat'] text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Sofia</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Sofia Shop</span>
            </div>
            <h2 className="font-['Montserrat'] text-3xl font-bold text-foreground">
              {requireOtp ? (language === 'uz' ? 'Tasdiqlash' : 'Verification') : (isLogin ? l.loginTitle : l.registerTitle)}
            </h2>
            <p className="text-muted-foreground mt-1">
              {requireOtp 
                ? (language === 'uz' ? `${registeredEmail} manziliga kod yuborildi` : `Code sent to ${registeredEmail}`) 
                : (isLogin ? l.loginSub : l.registerSub)}
            </p>
          </div>

          {!requireOtp && (
            <>
              {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-border bg-card hover:bg-accent/10 hover:border-primary/30 transition-all font-medium text-foreground mb-6 shadow-sm disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{l.googleBtn}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2">{l.orContinue}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          </>
          )}

          {/* Form */}
          {requireOtp ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {language === 'uz' ? '6 xonali kod' : '6-digit code'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={6}
                    name="otp"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-input text-center tracking-widest text-xl font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'uz' ? 'Tasdiqlash' : 'Verify'}</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{l.name}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={l.namePlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-input border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                    />
                  </div>
                </div>
              )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{l.email}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={l.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-input border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{l.password}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={l.passPlaceholder}
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-input border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{l.confirmPass}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={l.passPlaceholder}
                      className="w-full pl-10 pr-12 py-3 rounded-2xl bg-input border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

            {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? l.loginBtn : l.registerBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          )}

          {/* Switch */}
          {!requireOtp && (
          <p className="text-center mt-6 text-muted-foreground text-sm">
            {isLogin ? l.noAccount : l.hasAccount}{' '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? l.register : l.login}
            </Link>
          </p>
          )}
        </div>
      </div>
    </div>
  );
};
