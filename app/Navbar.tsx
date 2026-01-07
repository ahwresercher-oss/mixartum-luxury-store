'use client';

import Link from 'next/link';
import { useCart } from './CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="border-b py-6 px-10 flex justify-between items-center bg-white sticky top-0 z-50">
      {/* Логотип */}
      <Link href="/" className="text-2xl font-serif tracking-widest uppercase hover:opacity-70 transition">
        Mixartum
      </Link>

      {/* Меню */}
      <div className="hidden md:flex space-x-8 uppercase text-[10px] tracking-[0.2em] font-medium">
        <Link href="/" className="hover:opacity-50 transition">New Arrivals</Link>
        <Link href="/" className="hover:opacity-50 transition">Collections</Link>
        <Link href="/" className="hover:opacity-50 transition">About</Link>
      </div>

      {/* Корзина */}
      <Link href="/cart" className="flex items-center space-x-2 group">
        <div className="relative">
          <ShoppingBag size={18} className="group-hover:opacity-50 transition" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-widest hidden sm:inline-block group-hover:opacity-50 transition">
          Cart ({cart.length})
        </span>
      </Link>
    </nav>
  );
}
