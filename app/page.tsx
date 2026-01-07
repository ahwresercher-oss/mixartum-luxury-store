export default function HomePage() {
  const products = [
    { id: 1, name: "Silk Evening Gown", price: "$2,450", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800" },
    { id: 2, name: "Cashmere Overcoat", price: "$3,200", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800" },
    { id: 3, name: "Leather Handbag", price: "$1,850", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800" },
    { id: 4, name: "Gold Velvet Blazer", price: "$2,100", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800" }
  ];

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-[70vh] bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" className="absolute w-full h-full object-cover opacity-80" />
        <div className="relative text-center text-white">
          <h1 className="text-6xl font-serif mb-4 drop-shadow-lg">Winter Collection</h1>
          <p className="uppercase tracking-[0.3em] text-sm">Timeless Elegance</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto py-20 px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <h3 className="font-serif text-lg">{product.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
