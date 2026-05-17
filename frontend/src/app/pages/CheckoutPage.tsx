import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { apiFetch } from '../utils/api';
import { AddressMapPicker } from '../components/AddressMapPicker';

const PAYMENT_METHODS = [
  { id: 'payme', name: 'Payme', logo: '💳' },
  { id: 'click', name: 'Click', logo: '🏦' },
  { id: 'uzcard', name: 'UzCard', logo: '💵' },
  { id: 'humo', name: 'Humo', logo: '💴' },
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, language, user } = useStore();
  const t = useTranslation(language);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    region: '',
  });

  React.useEffect(() => {
    if (user) {
      setDeliveryInfo({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        region: '',
      });
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('payme');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const handlePlaceOrder = async () => {
    try {
      if (cart.length === 0) return;
      
      const payload = {
        items: cart,
        deliveryInfo,
        paymentMethod,
        total: cartTotal,
      };

      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      alert(`Xato yuz berdi: ${err.message}`);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-['Montserrat'] text-3xl font-bold mb-3">
            {language === 'uz'
              ? 'Buyurtma Qabul Qilindi!'
              : language === 'ru'
              ? 'Заказ Принят!'
              : 'Order Placed!'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === 'uz'
              ? 'Tez orada siz bilan bog\'lanamiz'
              : language === 'ru'
              ? 'Мы скоро с вами свяжемся'
              : 'We will contact you soon'}
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {language === 'uz' ? 'Bosh Sahifaga' : language === 'ru' ? 'На Главную' : 'Go Home'}
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-['Montserrat'] text-3xl font-bold mb-8">{t('checkout')}</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: t('delivery') },
              { num: 2, label: t('payment') },
              { num: 3, label: t('confirm') },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-sm mt-2 font-medium">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      step > s.num ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-lg"
              >
                <h2 className="font-['Montserrat'] text-xl font-bold mb-6">
                  {t('delivery')} {language === 'uz' ? 'Ma\'lumotlari' : language === 'ru' ? 'Информация' : 'Information'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'uz' ? 'Ism va Familiya' : language === 'ru' ? 'Имя и Фамилия' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.name}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder={language === 'uz' ? 'Ismingizni kiriting' : language === 'ru' ? 'Введите имя' : 'Enter your name'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'uz' ? 'Telefon Raqam' : language === 'ru' ? 'Номер Телефона' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="+998 XX XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'uz' ? 'Shahar' : language === 'ru' ? 'Город' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder={language === 'uz' ? 'Shaharingizni kiriting' : language === 'ru' ? 'Введите город' : 'Enter city'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'uz' ? 'Manzil' : language === 'ru' ? 'Адрес' : 'Address'}
                    </label>
                    <textarea
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder={language === 'uz' ? 'To\'liq manzilni kiriting' : language === 'ru' ? 'Введите полный адрес' : 'Enter full address'}
                    />
                  </div>

                  <AddressMapPicker 
                    onLocationSelect={(lat, lng, address, city) => {
                      setDeliveryInfo(prev => ({ 
                        ...prev, 
                        address: address || `${lat}, ${lng}`,
                        city: city || prev.city
                      }));
                    }}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!deliveryInfo.name.trim() || !deliveryInfo.phone.trim() || !deliveryInfo.address.trim() || !deliveryInfo.city.trim()}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('continueToPayment')}
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-lg"
              >
                <h2 className="font-['Montserrat'] text-xl font-bold mb-6">
                  {t('paymentMethods')}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{method.logo}</div>
                      <div className="font-semibold">{method.name}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-border rounded-xl font-medium hover:bg-accent/10 transition-colors"
                  >
                    {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {language === 'uz' ? 'Davom Etish' : language === 'ru' ? 'Продолжить' : 'Continue'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-lg"
              >
                <h2 className="font-['Montserrat'] text-xl font-bold mb-6">
                  {t('confirm')} {language === 'uz' ? 'Buyurtma' : language === 'ru' ? 'Заказ' : 'Order'}
                </h2>

                <div className="space-y-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'uz' ? 'Yetkazib Berish' : language === 'ru' ? 'Доставка' : 'Delivery'}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <p>{deliveryInfo.name}</p>
                      <p>{deliveryInfo.phone}</p>
                      <p>{deliveryInfo.city}</p>
                      <p>{deliveryInfo.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'uz' ? 'To\'lov Usuli' : language === 'ru' ? 'Способ Оплаты' : 'Payment Method'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      {language === 'uz' ? 'Mahsulotlar' : language === 'ru' ? 'Товары' : 'Products'}
                    </h3>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="price font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border-2 border-border rounded-xl font-medium hover:bg-accent/10 transition-colors"
                  >
                    {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {t('placeOrder')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg sticky top-24">
              <h2 className="font-['Montserrat'] text-xl font-bold mb-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span className="price font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span className="price font-semibold text-green-600">
                    {language === 'uz' ? 'Bepul' : language === 'ru' ? 'Бесплатно' : 'Free'}
                  </span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">{t('total')}</span>
                    <span className="price text-2xl font-bold text-secondary">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
