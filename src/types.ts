
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  details: string[];
  // Added isNew property to support visual badges on product cards
  isNew?: boolean;
}

export interface SiteConfig {
  HeroSection: {
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
  };
  Products: Product[];
}

export interface CartItem extends Product {
  quantity: number;
}