"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

// Helper function to format price
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU') + ' ₽';
};

export default function Cart() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-16">
            <h1 className="text-4xl font-extrabold mb-8">Корзина пуста</h1>
            <p className="text-lg mb-8 opacity-70">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="inline-flex items-center px-8 py-4 rounded-full bg-brand-green text-black font-black text-xl tracking-tight uppercase hover:bg-brand-green/90 transition-colors duration-200"
            >
              Перейти в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4">Корзина</h1>
          <p className="text-lg opacity-70">
            {totalItems} товар{totalItems === 1 ? '' : totalItems < 5 ? 'а' : 'ов'}
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-6 mb-8">
          {items.map((item) => {
            const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''));
            const itemTotal = numericPrice * item.quantity;
            
            return (
              <div 
                key={`${item.id}-${item.size || 'no-size'}`}
                className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl border border-foreground/10 bg-foreground/5 transition-colors duration-200"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-40 sm:h-32 bg-white rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 128px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold mb-2">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm opacity-70 mb-2">Размер: {item.size.toUpperCase()}</p>
                  )}
                  <p className="text-lg font-bold text-brand-green mb-4">
                    {item.price} × {item.quantity} = {formatPrice(itemTotal)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(`${item.id}-${item.size || 'no-size'}`, item.quantity - 1)}
                        className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors duration-200"
                        aria-label="Уменьшить количество"
                      >
                        <svg width="16" height="2" viewBox="0 0 16 2" fill="currentColor">
                          <rect width="16" height="2" />
                        </svg>
                      </button>
                      
                      <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(`${item.id}-${item.size || 'no-size'}`, item.quantity + 1)}
                        className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors duration-200"
                        aria-label="Увеличить количество"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="7" y="0" width="2" height="16" />
                          <rect x="0" y="7" width="16" height="2" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(`${item.id}-${item.size || 'no-size'}`)}
                      className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="bg-foreground/5 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Итого:</span>
            <span className="text-2xl font-extrabold text-brand-green">
              {formatPrice(totalPrice)}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={clearCart}
              className="flex-1 px-6 py-3 rounded-full border border-foreground/20 font-bold hover:bg-foreground/10 transition-colors duration-200"
            >
              Очистить корзину
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement checkout flow
                alert('Оформление заказа будет реализовано в следующих этапах');
              }}
              className="flex-1 px-6 py-3 rounded-full bg-brand-green text-black font-black text-lg tracking-tight uppercase hover:bg-brand-green/90 transition-colors duration-200"
            >
              Оформить заказ
            </button>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <button
            onClick={() => router.push('/catalog')}
            className="text-brand-green hover:underline font-medium"
          >
            ← Продолжить покупки
          </button>
        </div>
      </div>
    </div>
  );
}
