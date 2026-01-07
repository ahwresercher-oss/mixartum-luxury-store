'use client';

import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, LogOut, Package, Clock, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Замените 'mixartum2024' на любой свой пароль в будущем через Vercel
  const ADMIN_PASSWORD = "admin"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль доступа');
    }
  };

  // Пример списка заказов (в будущем они будут приходить сюда из базы или почты)
  const mockOrders = [
    { id: "ORD-7721", date: "2024-03-15", customer: "Александр В.", total: "$2,450", status: "Оплачен", item: "Silk Evening Gown" },
    { id: "ORD-7722", date: "2024-03-14", customer: "Мария С.", total: "$1,850", status: "В обработке", item: "Leather Handbag" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-3xl font-serif uppercase tracking-widest">Admin Access</h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Введите пароль для входа в панель управления</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-zinc-200 py-3 text-center focus:outline-none focus:border-black transition-colors"
            placeholder="••••••••"
          />
          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}
          <button type="submit" className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-100 p-8 flex flex-col justify-between">
        <div className="space-y-12">
          <div className="text-xl font-serif tracking-widest uppercase">Mixartum Admin</div>
          <nav className="space-y-6">
            <div className="flex items-center space-x-4 text-black cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="text-xs uppercase tracking-widest font-bold">Дашборд</span>
            </div>
            <div className="flex items-center space-x-4 text-zinc-400 hover:text-black cursor-pointer transition-colors">
              <ShoppingBag size={18} />
              <span className="text-xs uppercase tracking-widest">Заказы</span>
            </div>
          </nav>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-4 text-zinc-400 hover:text-black transition-colors">
          <LogOut size={18} />
          <span className="text-xs uppercase tracking-widest">Выйти</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif mb-2">Заказы</h2>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">Управление продажами вашего бутика</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white border border-zinc-100 px-6 py-3 rounded-none shadow-sm text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Всего заказов</div>
              <div className="text-xl font-serif">24</div>
            </div>
            <div className="bg-white border border-zinc-100 px-6 py-3 rounded-none shadow-sm text-center">
              <div className="text-[10px] text-zinc-400 uppercase">Выручка</div>
              <div className="text-xl font-serif">$42,900</div>
            </div>
          </div>
        </header>

        {/* Orders Table */}
        <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="p-6 text-[10px] uppercase tracking-widest text-zinc-400">ID Заказа</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-zinc-400">Клиент</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-zinc-400">Товар</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-zinc-400">Сумма</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-zinc-400">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-6 font-bold">{order.id}</td>
                  <td className="p-6">{order.customer}</td>
                  <td className="p-6">{order.item}</td>
                  <td className="p-6 font-serif">{order.total}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 uppercase text-[9px] tracking-tighter ${order.status === 'Оплачен' ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-500'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
