
import React from 'react';
import { ShoppingBag, User, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: string, section?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onNavigate }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 transition-all duration-700 hover:bg-white" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <button className="lg:hidden p-2 -ml-2 mr-4 hover:text-zinc-400 transition-colors">
              <Menu size={20} strokeWidth={1} />
            </button>
            <div className="hidden lg:flex space-x-12 text-[10px] tracking-[0.4em] uppercase font-bold">
              <button 
                onClick={() => onNavigate('home', 'collection')} 
                className="hover:text-zinc-400 transition-all focus:outline-none"
              >
                Collection
              </button>
              <button 
                onClick={() => onNavigate('home', 'journal')} 
                className="hover:text-zinc-400 transition-all focus:outline-none"
              >
                Journal
              </button>
            </div>
          </div>

          <button 
            className="flex-shrink-0 cursor-pointer focus:outline-none absolute left-1/2 -translate-x-1/2" 
            onClick={() => onNavigate('home')}
            aria-label="LUXE Home"
          >
            <h1 className="font-serif text-3xl tracking-[0.3em] font-light">LUXE</h1>
          </button>

          <div className="flex items-center space-x-10">
            <button 
              className="hidden sm:block hover:text-zinc-400 transition-colors focus:outline-none" 
              onClick={() => onNavigate('account')}
              aria-label="Account"
            >
              <User size={18} strokeWidth={1} />
            </button>
            <button 
              className="relative flex items-center hover:text-zinc-400 transition-colors focus:outline-none" 
              onClick={onOpenCart}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in-0 duration-500">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
