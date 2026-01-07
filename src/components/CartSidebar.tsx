
import React, { useEffect, useRef } from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onViewFullCart: () => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onViewFullCart, onCheckout, isProcessing }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sidebarRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div 
          ref={sidebarRef}
          tabIndex={-1}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col outline-none"
        >
          <div className="flex items-center justify-between px-6 py-8 border-b border-zinc-100">
            <h2 id="cart-title" className="font-serif text-2xl">Your Bag</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Close bag"
            >
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <p className="text-sm uppercase tracking-widest">Your bag is empty</p>
                <button onClick={onClose} className="text-xs underline underline-offset-4 focus:outline-none focus:text-black">Continue Shopping</button>
              </div>
            ) : (
              <div className="space-y-8 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-zinc-50 border border-zinc-100">
                      <img src={item.images[0]} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
                        <h3 className="line-clamp-1 pr-4">{item.name}</h3>
                        <p className="ml-4 font-bold text-zinc-900">${item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.category}</p>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-zinc-100 h-8">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 hover:bg-zinc-50 transition-colors"
                          >-</button>
                          <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 hover:bg-zinc-50 transition-colors"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-zinc-300 hover:text-black transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 px-6 py-8 bg-zinc-50/50">
            <div className="flex justify-between items-baseline mb-6">
              <p className="font-serif text-xl">Subtotal</p>
              <p className="font-medium text-lg">${total.toLocaleString()}</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => { onViewFullCart(); onClose(); }}
                className="w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Full Bag <ArrowRight size={14} />
              </button>
              <button 
                onClick={onCheckout}
                disabled={isProcessing || items.length === 0}
                className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Secure Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
