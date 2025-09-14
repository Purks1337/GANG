"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = items.length > 0 && name && phone && email;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name, phone, email, address, comment },
          items,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Не удалось оформить заявку");
      }
      if (json.paymentUrl) {
        // External payment redirect (WooCommerce checkout payment URL)
        window.location.href = json.paymentUrl as string;
        return;
      }
      router.replace(`/order/success?orderId=${encodeURIComponent(json.orderId)}`);
    } catch (err) {
      setError((err as Error).message);
      router.replace(`/order/fail?reason=${encodeURIComponent((err as Error).message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold mb-6">Оформление</h1>

        {items.length === 0 ? (
          <p className="opacity-70">Корзина пуста.</p>
        ) : (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Имя</label>
                <input
                  className="w-full rounded-xl px-4 py-3 bg-foreground/5 border border-foreground/10 outline-none"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Телефон</label>
                <input
                  className="w-full rounded-xl px-4 py-3 bg-foreground/5 border border-foreground/10 outline-none"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                className="w-full rounded-xl px-4 py-3 bg-foreground/5 border border-foreground/10 outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Адрес / ПВЗ</label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-foreground/5 border border-foreground/10 outline-none"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Город, улица, дом / ПВЗ"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Комментарий</label>
              <textarea
                className="w-full rounded-xl px-4 py-3 bg-foreground/5 border border-foreground/10 outline-none min-h-[100px]"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
              <div className="flex justify-between items-center">
                <span>Итого</span>
                <span className="text-2xl font-extrabold text-brand-green">
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="rounded-full bg-brand-green text-black font-black uppercase px-8 py-4 disabled:opacity-50"
            >
              {loading ? "Отправка…" : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
