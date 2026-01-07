'use client';
import { useCart } from '../CartContext';
import config from '../config.json';
import { Trash2, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price, 0);

  const handleCheckout = () => {
    const itemsList = cart.map((item: any) => `- ${item.name} ($${item.price})`).join('%0A');
    const message = `Здравствуйте! Я хочу оформить заказ в ${config.storeName}:%0A%0A${itemsList}%0A%0AИтого: $${totalPrice}%0A%0AПожалуйста, подтвердите наличие.`;
    window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-serif italic">Your cart is empty</h2>
        <a href="/" className="text-[10px] uppercase tracking-widest border-b border-black pb-1">Back to shop</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-10">
      <h1 className="text-4xl font-serif italic mb-12">Your Selection</h1>
      
      <div className="space-y-8 mb-12">
        {cart.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center border-b border-zinc-100 pb-6">
            <div className="flex items-center space-x-6">
              <img src={item.image} className="w-16 h-20 object-cover" />
              <div>
                <h3 className="text-sm uppercase tracking-wider">{item.name}</h3>
                <p className="text-zinc-400 font-serif italic">${item.price}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(index)} className="text-zinc-300 hover:text-red-500 transition">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Total Amount</span>
        <span className="text-3xl font-serif">${totalPrice.toLocaleString()}</span>
      </div>

      <button 
        onClick={handleCheckout}
        className="w-full bg-black text-white py-6 flex items-center justify-center space-x-4 hover:bg-zinc-800 transition uppercase text-[10px] tracking-[0.3em]"
      >
        <MessageCircle size={18} />
        <span>Order via WhatsApp</span>
      </button>
    </div>
  );
}
