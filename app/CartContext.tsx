'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // Загружаем корзину из памяти браузера при старте
  useEffect(() => {
    const savedCart = localStorage.getItem('mixartum-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Сохраняем корзину в память при каждом изменении
  useEffect(() => {
    localStorage.setItem('mixartum-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
    alert(`${product.name} добавлен в корзину!`);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
