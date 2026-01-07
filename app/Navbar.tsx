'use client';
import Link from 'next/link';
import { useCart } from './CartContext';
import { ShoppingBag, Search, User } from 'lucide-react';

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
        {/* Левая часть - Поиск */}
        <div className="hidden lg:flex items-center space-x-6 text-[10px] uppercase tracking-[0.2em]">
          <Search size={16} strokeWidth={1.5} />
          <span className="cursor-pointer hover:opacity-50 transition">Search</span>
        </div>

        {/* Центр - Логотип */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-serif tracking-[0.3em] uppercase italic">
          Mixartum
        </Link>

        {/* Правая часть - Аккаунт и Корзина */}
        <div className="flex items-center space-x-8 text-[10px] uppercase tracking-[0.2em]">
          <div className="hidden sm:flex items-center space-x-2 cursor-pointer hover:opacity-50 transition">
            <User size={16} strokeWidth={1.5} />
            <span>Account</span>
          </div>
          <Link href="/cart" className="flex items-center space-x-2 group">
            <div className="relative">
              <ShoppingBag size={18} strokeWidth={1.2} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-[7px] text-white w-3 h-3 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="hidden md:inline group-hover:opacity-50 transition">Bag</span>
          </Link>
        </div>
      </div>
      
      {/* Вторичное меню (категории) */}
      <div className="hidden lg:flex justify-center space-x-12 py-3 border-t border-zinc-50 text-[9px] uppercase tracking-[0.3em] font-medium text-zinc-500">
        <Link href="/" className="hover:text-black transition">New In</Link>
        <Link href="/" className="hover:text-black transition">Ready-to-wear</Link>
        <Link href="/" className="hover:text-black transition">Bags</Link>
        <Link href="/" className="hover:text-black transition">Shoes</Link>
        <Link href="/" className="hover:text-black transition">Editorial</Link>
      </div>
    </nav>
  );
}
