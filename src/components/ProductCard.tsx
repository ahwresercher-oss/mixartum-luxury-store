
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { X, Sparkles } from 'lucide-react';
import VirtualTryOn from './VirtualTryOn';

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onClick, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const openQuickView = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = (e?: React.SyntheticEvent | Event) => {
    e?.stopPropagation();
    setIsQuickViewOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openTryOn = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setIsTryOnOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTryOn = () => {
    setIsTryOnOpen(false);
    document.body.style.overflow = 'unset';
  };

  const staggerDelay = (index % 4) * 150;

  return (
    <>
      <article 
        ref={cardRef}
        className={`group flex flex-col h-full transition-all duration-[1200ms] cubic-bezier(0.22, 1, 0.36, 1) transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
        style={{ transitionDelay: `${staggerDelay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-zinc-50 cursor-pointer shadow-sm group-hover:shadow-xl transition-shadow duration-700"
          onClick={() => onClick(product.id)}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-zinc-100 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          )}
          
          <img
            src={product.images[0]}
            alt={product.name}
            onLoad={() => setIsLoading(false)}
            className={`absolute inset-0 object-cover w-full h-full transition-all duration-[2000ms] ease-out group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
          />

          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 object-cover w-full h-full transition-all duration-[2000ms] ease-out group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="absolute bottom-6 left-0 right-0 px-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex flex-col gap-2">
            <button 
              onClick={openQuickView}
              className="w-full bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold py-4 shadow-2xl hover:bg-black hover:text-white transition-all duration-500"
            >
              Quick View
            </button>
            <button 
              onClick={openTryOn}
              className="w-full bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.3em] font-bold py-4 shadow-2xl hover:bg-black transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="animate-pulse" /> Virtual Try-On
            </button>
          </div>

          {product.isNew && (
            <span className="absolute top-4 left-4 bg-black text-white text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold">New</span>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 mb-3 font-bold">{product.category}</span>
          <h3 
            className="text-[14px] font-light tracking-wide mb-2 group-hover:text-zinc-400 transition-colors cursor-pointer"
            onClick={() => onClick(product.id)}
          >
            {product.name}
          </h3>
          <p className="text-sm font-light text-zinc-900">${product.price.toLocaleString()}</p>
        </div>
      </article>

      {/* Reusable Virtual Try-On Module */}
      <VirtualTryOn 
        product={product}
        isOpen={isTryOnOpen}
        onClose={closeTryOn}
        onAddToCart={onAddToCart}
      />

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => closeQuickView()} />
          <div className="relative bg-white w-full max-w-5xl h-full max-h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-700">
            <button 
              onClick={() => closeQuickView()}
              className="absolute top-6 right-6 z-50 p-2 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>

            <div className="w-full md:w-3/5 h-[40%] md:h-full bg-zinc-50 overflow-hidden">
              <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="w-full md:w-2/5 p-8 md:p-14 flex flex-col justify-center overflow-y-auto">
              <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-6 font-semibold">{product.category}</span>
              <h2 className="font-serif text-4xl mb-8 tracking-tight">{product.name}</h2>
              <p className="text-2xl font-light mb-10 text-zinc-900">${product.price.toLocaleString()}</p>
              
              <div className="h-px w-full bg-zinc-100 mb-10" />
              
              <p className="text-[13px] text-zinc-500 leading-relaxed font-light mb-10">
                {product.description}
              </p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { onAddToCart(product); closeQuickView(); }}
                  className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-colors shadow-lg"
                >
                  Add to Bag
                </button>
                <button 
                  onClick={openTryOn}
                  className="w-full bg-zinc-50 border border-zinc-200 py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> AI Try-On
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
