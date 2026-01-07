import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

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
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <nav className="border-b py-6 px-10 flex justify-between items-center bg-white">
          <div className="text-2xl font-serif tracking-widest uppercase">Mixartum</div>
          <div className="space-x-8 uppercase text-xs tracking-widest">
            <a href="/" className="hover:opacity-50">New Arrivals</a>
            <a href="/" className="hover:opacity-50">Collections</a>
            <a href="/" className="hover:opacity-50">About</a>
          </div>
          <div className="text-xs uppercase tracking-widest cursor-pointer">Cart (0)</div>
        </nav>
        {children}
        <footer className="border-t py-10 text-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
          © 2024 Mixartum Luxury Boutique
        </footer>
      </body>
    </html>
  )
}
