'use client';

import { ShoppingBag } from 'lucide-react';

export default function HomePage() {
  // 1. ЗАМЕНИТЕ ЭТОТ НОМЕР НА СВОЙ (в формате 79001112233 без плюса)
  const MY_PHONE_NUMBER = "79054367510"; 

  const products = [
    { 
      id: 1, 
      name: "Silk Evening Gown", 
      price: "$2,450", 
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800" 
    },
    { 
      id: 2, 
      name: "Cashmere Overcoat", 
      price: "$3,200", 
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800" 
    },
    { 
      id: 3, 
      name: "Leather Handbag", 
      price: "$1,850", 
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800" 
    },
    { 
      id: 4, 
      name: "Gold Velvet Blazer", 
      price: "$2,100", 
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800" 
    }
  ];

  const handleBuyClick = (productName: string, productPrice: string) => {
    // Формируем текст сообщения
    const message = `Здравствуйте! Меня заинтересовал товар: ${productName} по цене ${productPrice}. Есть ли он в наличии?`;
    
    // Создаем ссылку для WhatsApp
    const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Открываем WhatsApp в новом окне
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[80vh] flex items-center justify-center bg-zinc-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" 
          className="absolute w-full h-full object-cover opacity-60"
          alt="Luxury Fashion"
        />
        <div className="relative text-center text-white px-4">
          <span className="text-[10px] uppercase tracking-[0.5em] mb-4 block animate-fade-in">New Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">Timeless Elegance</h1>
          <button className="border border-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-serif italic">The Selection</h2>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2">Curated luxury pieces</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 mb-6">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition duration-1000 ease-in-out" 
                  alt={product.name}
                />
                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button 
                    onClick={() => handleBuyClick(product.name, product.price)}
                    className="w-full bg-white py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-transform"
                  >
                    <ShoppingBag size={14} />
                    <span>Купить в WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium tracking-tight group-hover:underline underline-offset-4 decoration-zinc-300 transition-all">
                  {product.name}
                </h3>
                <p className="text-xs text-zinc-500 font-serif">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Boutique Note */}
      <section className="py-24 border-t border-zinc-100 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h4 className="text-xl font-serif italic mb-4">Personal Styling</h4>
          <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">
            Наши консультанты помогут вам подобрать идеальный образ и ответят на любые вопросы в WhatsApp.
          </p>
        </div>
      </section>
    </main>
  );
}
