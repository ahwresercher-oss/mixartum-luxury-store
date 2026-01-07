import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { CartProvider } from './CartContext'
import Navbar from './Navbar'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'Mixartum Luxury Store',
  description: 'Premium fashion boutique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white antialiased">
        {/* Оборачиваем всё приложение в провайдер корзины */}
        <CartProvider>
          <Navbar />
          
          {children}

          <footer className="border-t py-16 mt-20 text-center bg-zinc-50">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
              © 2024 Mixartum Luxury Boutique
            </div>
            <div className="mt-4 text-[9px] uppercase tracking-widest text-zinc-300">
              Privacy Policy • Terms of Service • Contact Us
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
