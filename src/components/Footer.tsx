
import React from 'react';

interface FooterProps {
  onNavigate: (view: any, id?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="col-span-1 md:col-span-1">
          <h2 className="font-serif text-2xl tracking-widest mb-6">LUXE</h2>
          <p className="text-xs text-zinc-400 font-light leading-loose uppercase tracking-tighter">
            An curated destination for global premium luxury, delivering to over 170 countries since 2010.
          </p>
        </div>
        
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Customer Service</h3>
          <ul className="text-xs space-y-4 font-light text-zinc-500">
            <li><button onClick={() => onNavigate('customer-service', 'shipping')} className="hover:text-black transition-colors">Shipping & Delivery</button></li>
            <li><button onClick={() => onNavigate('customer-service', 'returns')} className="hover:text-black transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => onNavigate('customer-service', 'faqs')} className="hover:text-black transition-colors">FAQs</button></li>
            <li><button onClick={() => onNavigate('customer-service', 'sizing')} className="hover:text-black transition-colors">Size Guide</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Information</h3>
          <ul className="text-xs space-y-4 font-light text-zinc-500">
            <li><button onClick={() => onNavigate('about')} className="hover:text-black transition-colors">Our Story</button></li>
            <li><button className="hover:text-black transition-colors">Careers</button></li>
            <li><button className="hover:text-black transition-colors">Sustainability</button></li>
            <li><button className="hover:text-black transition-colors">Affiliates</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Legal</h3>
          <ul className="text-xs space-y-4 font-light text-zinc-500">
            <li><button onClick={() => onNavigate('legal', 'terms')} className="hover:text-black transition-colors">Terms & Conditions</button></li>
            <li><button onClick={() => onNavigate('legal', 'privacy')} className="hover:text-black transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('legal', 'cookies')} className="hover:text-black transition-colors">Cookie Policy</button></li>
            <li><button onClick={() => onNavigate('legal', 'returns-policy')} className="hover:text-black transition-colors">Returns Policy</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-100 pt-12">
        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400">© 2025 LUXE INTERNATIONAL. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em] text-zinc-400">
          <button className="hover:text-black transition-colors">Instagram</button>
          <button className="hover:text-black transition-colors">Facebook</button>
          <button className="hover:text-black transition-colors">Pinterest</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
