import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { CartItem } from '../types';
import PageShell from '../components/PageShell';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Lock } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchCart();
  }, [user]);

  async function fetchCart() {
    const { data } = await supabase
      .from('cart_items')
      .select('*, part:parts(*, category:categories(*), brand:brands(*))')
      .eq('user_id', user!.id);
    setItems(data || []);
    setLoading(false);
  }

  async function updateQty(id: string, qty: number) {
    if (qty < 1) return removeItem(id);
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', id);
    fetchCart();
  }

  async function removeItem(id: string) {
    await supabase.from('cart_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function placeOrder() {
    if (!user || items.length === 0) return;
    setPlacing(true);
    const total = items.reduce((sum, i) => sum + (i.part?.price || 0) * i.quantity, 0);

    const { data: order } = await supabase.from('orders').insert({
      user_id: user.id,
      total_amount: total,
      status: 'pending',
    }).select().single();

    if (order) {
      const orderItems = items.map(i => ({
        order_id: order.id,
        part_id: i.part_id,
        quantity: i.quantity,
        unit_price: i.part?.price || 0,
      }));
      await supabase.from('order_items').insert(orderItems);
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      navigate('/orders');
    }
    setPlacing(false);
  }

  const total = items.reduce((sum, i) => sum + (i.part?.price || 0) * i.quantity, 0);

  if (!user) {
    return (
      <PageShell maxWidth="md">
        <div className="flex flex-col items-center justify-center py-24 min-h-[60vh] text-center">
          <Lock size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Sign in to view your cart</h2>
          <p className="text-sm text-slate-500 mb-4">Add parts to your cart and checkout when ready</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Sign In
          </button>
        </div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell maxWidth="md">
        <div className="space-y-4 min-h-[60vh]">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-28 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (items.length === 0) {
    return (
      <PageShell maxWidth="md">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-100 min-h-[55vh] text-center">
          <ShoppingCart size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Your cart is empty</h2>
          <p className="text-sm text-slate-500 mb-4">Search for parts and add them to your cart</p>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search Parts
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="md">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Your Cart</h1>

      <div className="space-y-3 min-h-[40vh]">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
            <Link to={`/part/${item.part?.slug}`} className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0">
              {item.part?.image_url ? (
                <img src={item.part.image_url} alt={item.part.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ShoppingCart size={24} />
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/part/${item.part?.slug}`}>
                <h3 className="text-sm font-semibold text-slate-900 truncate hover:text-sky-700 transition-colors">
                  {item.part?.name}
                </h3>
              </Link>
              {item.part?.brand && <p className="text-xs text-slate-500">{item.part.brand.name}</p>}
              {item.part?.oem_number && (
                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.part.oem_number}</p>
              )}
            </div>

            <div className="flex items-center border border-slate-200 rounded-lg">
              <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50">
                <Minus size={14} />
              </button>
              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
              <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50">
                <Plus size={14} />
              </button>
            </div>

            <span className="text-sm font-bold text-slate-900 min-w-[80px] text-right">
              &#8377;{((item.part?.price || 0) * item.quantity).toLocaleString('en-IN')}
            </span>

            <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-600">Subtotal ({items.length} items)</span>
          <span className="text-xl font-bold text-slate-900">&#8377;{total.toLocaleString('en-IN')}</span>
        </div>
        <button
          type="button"
          onClick={placeOrder}
          disabled={placing}
          className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {placing ? 'Placing order...' : <>Place Order <ArrowRight size={16} /></>}
        </button>
      </div>
    </PageShell>
  );
}
