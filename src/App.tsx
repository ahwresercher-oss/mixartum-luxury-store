
import React, { useState, useMemo, useEffect } from 'react';
import config from './data/config.json';
import { Product, SiteConfig, CartItem } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import VirtualTryOn from './components/VirtualTryOn';
import Footer from './components/Footer';
import { 
  ChevronRight, ArrowRight, Quote, SlidersHorizontal, ChevronDown, 
  Heart, Share2, Info, Trash2, Plus, Minus, ShoppingBag, 
  CreditCard, ShieldCheck, Truck, Lock, CheckCircle2, User, Package, MapPin, LogOut,
  HelpCircle, RefreshCw, Ruler, Globe, Scale, FileText, Eye, Shield, Clock, Box, Sparkles
} from 'lucide-react';

type View = 'home' | 'catalog' | 'product' | 'cart' | 'about' | 'checkout' | 'account' | 'customer-service' | 'legal';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [csSection, setCsSection] = useState<string>('shipping');
  const [legalSection, setLegalSection] = useState<string>('privacy');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Reusable state for Virtual Try-On if triggered globally
  const [isGlobalTryOnOpen, setIsGlobalTryOnOpen] = useState(false);

  const selectedProduct = useMemo(() => 
    config.Products.find(p => p.id === selectedProductId), 
    [selectedProductId]
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleStripeCheckout = async () => {
    setIsProcessingCheckout(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          }))
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('checkout');
        setIsProcessingCheckout(false);
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error("Stripe Connection Error:", error);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('checkout');
      setIsProcessingCheckout(false);
      setIsCartOpen(false);
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = (newView: View, id?: string, skipScroll = false) => {
    setView(newView);
    if (newView === 'customer-service' && id) {
      setCsSection(id);
    } else if (newView === 'legal' && id) {
      setLegalSection(id);
    } else if (id && newView === 'product') {
      setSelectedProductId(id);
    }
    
    if (!skipScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onNavigate={(viewId, sectionId) => {
          if (sectionId) {
            if (view === viewId) {
               document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
               navigate(viewId as View, undefined, true);
               setTimeout(() => {
                 document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
               }, 100);
            }
          } else {
            navigate(viewId as View);
          }
        }} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={(id, q) => updateQuantity(id, q)} 
        onViewFullCart={() => navigate('cart')}
        onCheckout={handleStripeCheckout}
        isProcessing={isProcessingCheckout}
      />

      <main className="flex-grow">
        {view === 'home' && <HomeView onProductClick={(id) => navigate('product', id)} onAddToCart={addToCart} />}
        {view === 'catalog' && <CatalogView onProductClick={(id) => navigate('product', id)} onAddToCart={addToCart} />}
        {view === 'about' && <AboutView />}
        {view === 'cart' && <CartView items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onNavigate={navigate} onCheckout={handleStripeCheckout} isProcessing={isProcessingCheckout} />}
        {view === 'checkout' && <CheckoutView items={cart} onOrderComplete={() => { clearCart(); }} onNavigate={navigate} />}
        {view === 'account' && (
          <AccountView 
            isLoggedIn={isLoggedIn} 
            onLogin={() => setIsLoggedIn(true)} 
            onLogout={() => setIsLoggedIn(false)}
            wishlistItems={config.Products.filter(p => wishlist.includes(p.id))}
            onProductClick={(id) => navigate('product', id)}
            onAddToCart={addToCart}
          />
        )}
        {view === 'customer-service' && (
          <CustomerServiceView activeSection={csSection} onSectionChange={setCsSection} />
        )}
        {view === 'legal' && (
          <LegalView activeSection={legalSection} onSectionChange={setLegalSection} />
        )}
        {view === 'product' && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onNavigateHome={() => navigate('home')} 
            onProductClick={(id) => navigate('product', id)}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
            onOpenTryOn={() => setIsGlobalTryOnOpen(true)}
          />
        )}
      </main>

      {/* Global Virtual Try-On handler for Product Detail View */}
      {selectedProduct && (
        <VirtualTryOn 
          product={selectedProduct}
          isOpen={isGlobalTryOnOpen}
          onClose={() => setIsGlobalTryOnOpen(false)}
          onAddToCart={addToCart}
        />
      )}

      <Footer onNavigate={navigate} />
    </div>
  );
};

// --- HomeView Subcomponent ---
const HomeView = ({ onProductClick, onAddToCart }: { onProductClick: (id: string) => void, onAddToCart: (p: Product) => void }) => (
  <div className="animate-in fade-in duration-1000">
    <section id="hero" className="relative h-screen bg-zinc-100 overflow-hidden">
      <img src={config.HeroSection.image} alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_10s_infinite_alternate]" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <span className="text-[10px] uppercase tracking-[0.8em] mb-8 animate-in slide-in-from-bottom-4 duration-1000 font-bold">{config.HeroSection.subtitle}</span>
        <h2 className="font-serif text-6xl md:text-9xl mb-12 tracking-tight animate-in slide-in-from-bottom-8 duration-[1500ms]">{config.HeroSection.title}</h2>
        <button 
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-16 py-6 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all duration-500 shadow-2xl animate-in fade-in duration-[2000ms]"
        >
          {config.HeroSection.buttonText}
        </button>
      </div>
    </section>

    <section id="collection" className="max-w-7xl mx-auto px-6 py-32 md:py-48 scroll-mt-24">
      <div className="flex flex-col items-center mb-24 text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 mb-6 font-semibold">Exquisite Selection</span>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">New Arrivals</h2>
        <div className="h-px w-24 bg-black mt-12" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
        {config.Products.map((p, idx) => (
          <ProductCard key={p.id} index={idx} product={p} onClick={onProductClick} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>

    <section id="journal" className="bg-zinc-50 py-32 md:py-48 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="order-2 lg:order-1 aspect-[4/5] bg-white overflow-hidden shadow-2xl">
          <img src={config.about.secondaryImage} className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110" alt="Editorial" />
        </div>
        <div className="order-1 lg:order-2 space-y-12">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-bold">The Journal</span>
          <h2 className="font-serif text-5xl md:text-6xl tracking-tight leading-tight">A Legacy of <br/> Uncompromising Quality</h2>
          <p className="text-lg text-zinc-600 font-light leading-relaxed">
            Discover the stories behind our artisans, the heritage of our fabrics, and the vision that shapes every LUXE collection. From the heart of Milan to your wardrobe.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-black pb-2 hover:text-zinc-400 hover:border-zinc-400 transition-all"
          >
            Read Our Journal
          </button>
        </div>
      </div>
    </section>
  </div>
);

const CatalogView = ({ onProductClick, onAddToCart }: { onProductClick: (id: string) => void, onAddToCart: (p: Product) => void }) => {
  const [activeCategory, setActiveCategory] = useState('Shop All');
  const categories = ['Shop All', 'Clothing', 'Bags', 'Shoes', 'Accessories'];
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Shop All') return config.Products;
    return config.Products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-1000">
      <div className="mb-24 text-center">
        <h1 className="font-serif text-6xl md:text-7xl mb-8 tracking-tight">The Collection</h1>
        <div className="flex flex-wrap justify-center gap-10 mt-12">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveCategory(c)} 
              className={`text-[10px] uppercase tracking-[0.4em] transition-all duration-500 ${activeCategory === c ? 'text-black font-bold scale-110' : 'text-zinc-400 hover:text-black'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {filteredProducts.map((p, idx) => (
          <ProductCard key={p.id} index={idx} product={p} onClick={onProductClick} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

const CartView = ({ items, onUpdateQuantity, onRemove, onNavigate, onCheckout, isProcessing }: any) => {
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  if (items.length === 0) return (
    <div className="py-64 text-center">
      <h1 className="font-serif text-5xl mb-12">Your bag is empty.</h1>
      <button onClick={() => onNavigate('catalog')} className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-black pb-2">Start Exploring</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-1000">
      <h1 className="font-serif text-6xl mb-24 text-center tracking-tight">Shopping Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
        <div className="lg:col-span-2 space-y-16">
          {items.map((item: any) => (
            <div key={item.id} className="flex gap-12 border-b border-zinc-100 pb-16 group">
              <div className="w-32 h-44 overflow-hidden"><img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-4 font-bold">{item.category}</span>
                <h3 className="font-serif text-3xl mb-4 tracking-tight">{item.name}</h3>
                <p className="text-xl font-light text-zinc-900 mb-8">${item.price.toLocaleString()}</p>
                <div className="flex items-center gap-6 mb-8">
                   <div className="flex items-center border border-zinc-200">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-4 py-2 hover:bg-zinc-50">-</button>
                      <span className="px-4 font-medium text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-4 py-2 hover:bg-zinc-50">+</button>
                   </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="w-fit text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors">Remove from selection</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-50 p-16 h-fit sticky top-32">
          <h2 className="font-serif text-3xl mb-12">Selection Total</h2>
          <p className="text-5xl font-bold tracking-tighter mb-16">${total.toLocaleString()}</p>
          <button 
            onClick={onCheckout} 
            disabled={isProcessing}
            className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Securely Redirecting...</>
            ) : 'Proceed to Checkout'}
          </button>
          <div className="mt-8 flex items-center justify-center gap-4 text-zinc-400">
             <Lock size={12} />
             <span className="text-[9px] uppercase tracking-widest">Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutView = () => {
  const about = config.about;
  return (
    <div className="animate-in fade-in duration-1000">
      <section className="relative h-[80vh] overflow-hidden">
        <img src={about.heroImage} className="absolute inset-0 w-full h-full object-cover" alt="About Hero" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <span className="text-[10px] uppercase tracking-[0.8em] mb-6 font-bold">{about.subtitle}</span>
          <h1 className="font-serif text-6xl md:text-8xl tracking-tight">{about.title}</h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-32 md:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 block font-semibold">Our Philosophy</span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight">Crafting the Future of Luxury</h2>
            <p className="text-xl text-zinc-600 font-light leading-relaxed">
              {about.story}
            </p>
          </div>
          <div className="relative aspect-[4/5] bg-zinc-100 shadow-2xl overflow-hidden">
            <img src={about.secondaryImage} className="w-full h-full object-cover" alt="Editorial" />
          </div>
        </div>
      </section>
    </div>
  );
};

const LegalView = ({ activeSection, onSectionChange }: { activeSection: string, onSectionChange: (s: string) => void }) => {
  const sections = [
    { id: 'privacy', label: 'Privacy Policy', icon: Eye },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'returns-policy', label: 'Returns Policy', icon: RefreshCw },
    { id: 'cookies', label: 'Cookie Policy', icon: Shield },
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-24">
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="font-serif text-4xl mb-4 tracking-tight">Legal</h2>
          <nav className="flex flex-col space-y-8 mt-12">
            {sections.map((s) => (
              <button key={s.id} onClick={() => onSectionChange(s.id)} className={`flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] transition-all ${activeSection === s.id ? 'text-black font-bold translate-x-2' : 'text-zinc-400 hover:text-black'}`}>
                <s.icon size={14} /> {s.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 max-w-3xl border-l border-zinc-100 pl-24">
          <h3 className="font-serif text-5xl mb-12 capitalize">{activeSection.replace('-', ' ')}</h3>
          <p className="text-zinc-600 font-light leading-loose text-[15px]">At LUXE, we believe in radical transparency. Our policies are designed to protect both the integrity of our artisans and the rights of our discerning clientele.</p>
        </div>
      </div>
    </div>
  );
};

const CustomerServiceView = ({ activeSection, onSectionChange }: { activeSection: string, onSectionChange: (s: string) => void }) => (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <h2 className="font-serif text-5xl mb-12">Concierge</h2>
      <p className="text-xl font-light text-zinc-400">Our team is available 24/7 to assist with your inquiries.</p>
    </div>
);

const AccountView = ({ isLoggedIn, onLogin, onLogout, wishlistItems, onProductClick, onAddToCart }: any) => {
  const [activeTab, setActiveTab] = useState('orders');
  const mockOrders = [
    {
      id: "LUXE-92817",
      date: "January 14, 2025",
      status: "Delivered",
      total: 1250,
      items: ["Silk Wrap Midi Dress"],
      tracking: "UPS-918273645",
      image: "https://images.unsplash.com/photo-1539109132381-31a15b2974aa?q=80&w=1974&auto=format&fit=crop"
    },
    {
      id: "LUXE-88210",
      date: "February 02, 2025",
      status: "In Transit",
      total: 2800,
      items: ["Wool & Cashmere Overcoat"],
      tracking: "DHL-002938475",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2036&auto=format&fit=crop"
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-48 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl mb-4">Sign In</h1>
          <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-semibold">Welcome back to LUXE</p>
        </div>
        <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <input required type="email" placeholder="Email Address" className="w-full border-b border-zinc-200 py-5 text-sm font-light focus:outline-none focus:border-black transition-colors" />
          <input required type="password" placeholder="Password" className="w-full border-b border-zinc-200 py-5 text-sm font-light focus:outline-none focus:border-black transition-colors" />
          <button type="submit" className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all shadow-xl">
            Sign In to Your Account
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row gap-24">
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="font-serif text-4xl mb-12">My Account</h2>
          <nav className="flex flex-col space-y-8">
            {['profile', 'orders', 'wishlist', 'addresses'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`text-left text-[10px] uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'text-black font-bold translate-x-2' : 'text-zinc-400 hover:text-black'}`}
              >
                {tab === 'orders' ? 'Order History' : tab}
              </button>
            ))}
            <button onClick={onLogout} className="text-left text-[10px] uppercase tracking-[0.3em] text-red-400 hover:text-red-600 pt-12 border-t border-zinc-100">Sign Out</button>
          </nav>
        </aside>

        <div className="flex-1">
          {activeTab === 'orders' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="mb-12">
                <h3 className="font-serif text-3xl mb-4">Order History</h3>
                <p className="text-zinc-400 text-sm font-light">View and track your previous selections.</p>
              </div>
              <div className="space-y-6">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-zinc-100 p-8 md:p-12 hover:bg-zinc-50/50 transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="flex gap-8">
                        <div className="w-24 h-32 bg-zinc-100 overflow-hidden flex-shrink-0">
                          <img src={order.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-bold">{order.date}</p>
                          <h4 className="font-serif text-2xl mb-2">{order.items[0]}</h4>
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">{order.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                        <p className="text-2xl font-light">${order.total.toLocaleString()}</p>
                        <button className="flex items-center justify-center gap-2 border border-black py-3 px-8 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
                          <Package size={14} /> Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((p: any, idx: number) => (
                  /* Fixed reference to addToCart: used onAddToCart prop instead */
                  <ProductCard key={p.id} index={idx} product={p} onClick={onProductClick} onAddToCart={onAddToCart} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center border border-zinc-100 bg-zinc-50/30">
                  <p className="font-serif text-2xl text-zinc-400 font-light italic">Your wishlist is currently empty.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckoutView = ({ items, onOrderComplete, onNavigate }: any) => {
  const [isOrdered, setIsOrdered] = useState(false);
  if (isOrdered) return (
    <div className="py-64 text-center">
      <h1 className="font-serif text-6xl mb-12 tracking-tight">Success</h1>
      <button onClick={() => onNavigate('home')} className="px-16 py-6 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold">Return Home</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 text-center">
      <h1 className="font-serif text-6xl mb-12">Finalize Selection</h1>
      <button onClick={() => {setIsOrdered(true); onOrderComplete();}} className="bg-black text-white px-12 py-5 text-[10px] uppercase tracking-widest font-bold">Confirm Purchase</button>
    </div>
  );
};

const ProductDetailView = ({ product, onAddToCart, onNavigateHome, onProductClick, isWishlisted, onToggleWishlist, onOpenTryOn }: any) => (
  <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-1000">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
      <div className="space-y-6">
        <div className="aspect-[3/4] overflow-hidden bg-zinc-50">
          <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-110" alt={product.name} />
        </div>
        {product.images[1] && (
          <div className="aspect-[3/4] overflow-hidden bg-zinc-50">
            <img src={product.images[1]} className="w-full h-full object-cover" alt={`${product.name} detail`} />
          </div>
        )}
      </div>
      
      <div className="sticky top-32 space-y-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 block font-bold mb-4">{product.category}</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight leading-none">{product.name}</h1>
          <p className="text-3xl font-light text-zinc-900 tracking-tighter">${product.price.toLocaleString()}</p>
        </div>

        <div className="h-px w-full bg-zinc-100" />

        <p className="text-[15px] text-zinc-600 leading-loose font-light">
          {product.description}
        </p>

        <ul className="space-y-4">
          {product.details.map((detail: string, i: number) => (
            <li key={i} className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
              <div className="w-1 h-1 bg-zinc-300 rounded-full" /> {detail}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 pt-8">
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            Add to Bag <ShoppingBag size={14} />
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onOpenTryOn}
              className="w-full border border-black py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} /> AI Try-On
            </button>
            <button 
              onClick={onToggleWishlist}
              className={`w-full border border-zinc-200 py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-2 ${isWishlisted ? 'text-red-500 border-red-100 bg-red-50/30' : 'hover:border-black'}`}
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} /> {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
        </div>

        <div className="bg-zinc-50 p-8 rounded-sm space-y-6">
          <div className="flex items-start gap-4">
            <Truck size={18} strokeWidth={1} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold">Complimentary Shipping</p>
              <p className="text-[11px] text-zinc-400 font-light mt-1">Delivery within 3-5 business days globally.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck size={18} strokeWidth={1} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold">Authentication Guaranteed</p>
              <p className="text-[11px] text-zinc-400 font-light mt-1">Every piece is verified by our master artisans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Related Items (Simple Mock) */}
    <div className="mt-48 pt-32 border-t border-zinc-100">
      <h2 className="font-serif text-4xl mb-16 tracking-tight">Recommended for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
        {config.Products.filter(p => p.id !== product.id).slice(0, 4).map((p, idx) => (
          <ProductCard key={p.id} index={idx} product={p} onClick={(id) => onProductClick(id)} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  </div>
);

export default App;
