import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { CartProvider } from './CartContext'
import Navbar from './Navbar'
import PageTransition from './PageTransition' // Импортируем анимацию

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white antialiased">
        <CartProvider>
          <Navbar />
          
          {/* Теперь все страницы будут меняться плавно */}
          <PageTransition>
            {children}
          </PageTransition>

          <footer className="border-t py-20 mt-20 text-center bg-white">
            <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-400">
              © 2026 Mixartum Luxury Boutique
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
