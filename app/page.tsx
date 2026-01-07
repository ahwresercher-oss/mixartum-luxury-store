'use client';
import config from './config.json';
import { useCart } from './CartContext';
import { Plus, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <main className="bg-white pt-32">
      {/* Main Campaign Hero */}
      <section className="px-6 md:px-12 mb-32">
        <div className="relative h-[85vh] w-full bg-zinc-100 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover animate-luxury"
            alt="Campaign"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-20 left-12 md:left-24 text-white max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.5em] mb-6 block">Fall Winter 2025</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-10 leading-tight">The Art of Refinement</h1>
            <button className="bg-white text-black px-12 py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700">
              Discover the Collection
            </button>
          </div>
        </div>
      </section>

      {/* Editor's Note (Escada Style) */}
      <section className="max-w-4xl mx-auto text-center px-6 mb-32">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 mb-8 font-bold">The Journal</h2>
        <p className="text-2xl md:text-4xl font-serif italic leading-relaxed text-zinc-800">
          "Luxury is not about being noticed, it's about being remembered. Our collection focuses on the silent power of craftsmanship."
        </p>
      </section>

      {/* Curated Selection Grid */}
      <section className="px-6 md:px-12 mb-32">
        <div className="flex justify-between items-baseline mb-12 border-b border-zinc-100 pb-6">
          <h3 className="text-xl font-serif italic uppercase tracking-wider text-zinc-900">Essential Pieces</h3>
          <Link href="/" className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 flex items-center hover:text-black transition">
            View All <ArrowRight size={12} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
          {config.products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[3/4] bg-zinc-50 overflow-hidden mb-8 relative">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  alt={product.name}
                />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-6 right-6 w-12 h-12 bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-black hover:text-white"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-2 text-center">
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-900">
                  {product.name}
                </h4>
                <p className="text-sm font-serif italic text-zinc-500">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Block (Net-a-Porter Style) */}
      <section className="bg-zinc-50 py-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
        <div className="order-2 lg:order-1 aspect-[4/5] bg-white overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800" 
            className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
            alt="Editorial"
          />
        </div>
        <div className="order-1 lg:order-2 space-y-12">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-bold">The Editorial</span>
          <h2 className="text-5xl font-serif italic leading-tight">Effortless Sophistication</h2>
          <p className="text-zinc-500 leading-relaxed text-sm uppercase tracking-widest max-w-md">
            Откройте для себя образы, вдохновленные эстетикой тихой роскоши. Идеальный крой, премиальный шелк и кашемир.
          </p>
          <button className="border-b border-black pb-2 text-[10px] uppercase tracking-[0.3em] hover:opacity-50 transition">
            Shop the Story
          </button>
        </div>
      </section>
    </main>
  );
}
