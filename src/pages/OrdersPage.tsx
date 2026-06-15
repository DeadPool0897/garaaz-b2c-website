import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Order, OrderItem } from '../types';
import PageShell from '../components/PageShell';
import {
  ORDER_TABS, filterDemoOrders, statusBarColors,
} from '../data/demoOrders';
import { Package, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-sky-50 text-sky-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

interface OrderWithItems extends Order {
  order_items?: OrderItem[];
  eta?: string;
  itemCount?: number;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realOrders, setRealOrders] = useState<OrderWithItems[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>('All');
  const [showDemo, setShowDemo] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchOrders();
  }, [user]);

  async function fetchOrders() {
    const { data } = await supabase.from('orders')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setRealOrders(data || []);
    setLoading(false);
  }

  async function toggleOrderItems(orderId: string) {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);

    const order = realOrders.find(o => o.id === orderId);
    if (order?.order_items) return;

    const { data } = await supabase
      .from('order_items')
      .select('*, part:parts(*, brand:brands(*))')
      .eq('order_id', orderId);

    if (data) {
      setRealOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, order_items: data } : o
      ));
    }
  }

  const demoFiltered = filterDemoOrders(tab);
  const realFiltered = tab === 'All'
    ? realOrders
    : tab === 'Active'
      ? realOrders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status))
      : tab === 'Delivered'
        ? realOrders.filter(o => o.status === 'delivered')
        : realOrders.filter(o => o.status === 'cancelled');

  const displayOrders: OrderWithItems[] = showDemo
    ? [...realFiltered, ...demoFiltered.filter(d => !realFiltered.some(r => r.id === d.id))]
    : realFiltered;

  function renderOrderCard(order: OrderWithItems, isDemo = false) {
    const isExpanded = expandedOrder === order.id;
    const barColor = statusBarColors[order.status as keyof typeof statusBarColors] || 'bg-slate-400';
    const itemCount = order.itemCount ?? order.order_items?.length ?? 0;
    const eta = order.eta ?? (order.status === 'delivered' ? 'Delivered' : order.status === 'cancelled' ? 'Cancelled' : 'Processing');

    return (
      <article key={order.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex">
        <div className={`w-1.5 shrink-0 ${barColor}`} />
        <div className="flex-1">
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-semibold text-slate-700">
                  #{order.id.slice(0, isDemo ? 12 : 8).toUpperCase()}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[order.status] || 'bg-slate-50 text-slate-600'}`}>
                  {order.status}
                </span>
                {isDemo && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-violet-50 text-violet-600 rounded">Demo</span>
                )}
              </div>
              <span className="text-sm text-slate-400">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(3, itemCount) }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                ))}
                {itemCount > 3 && (
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                    +{itemCount - 3} more
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">{eta}</span>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
              <div>
                <div className="text-xs text-slate-500">Total</div>
                <span className="text-base font-bold text-slate-900">
                  &#8377;{order.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isDemo) {
                    setExpandedOrder(isExpanded ? null : order.id);
                  } else {
                    toggleOrderItems(order.id);
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                {isExpanded ? 'Hide Items' : 'View Items'}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="border-t border-slate-100 px-5 pb-5 pt-3 bg-slate-50/50">
              {(order.order_items?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {order.order_items!.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100">
                      <Link to={`/part/${item.part?.slug}`} className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center text-slate-300">
                        {item.part?.image_url ? (
                          <img src={item.part.image_url} alt={item.part?.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/part/${item.part?.slug}`}>
                          <h4 className="text-sm font-semibold text-slate-900 truncate hover:text-sky-700">
                            {item.part?.name || 'Part'}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-900 shrink-0">
                        &#8377;{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 pt-3 border-t border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-slate-900">&#8377;{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    );
  }

  if (!user) {
    const demoOnly = filterDemoOrders(tab);
    return (
      <PageShell maxWidth="lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders</h1>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            Sign in for your orders
          </button>
        </div>

        <div className="mb-4 p-3 bg-sky-50 border border-sky-100 rounded-xl text-sm text-sky-800">
          Preview mode — showing demo orders covering all statuses. Sign in to see your real orders.
        </div>

        <div className="flex gap-1 border-b border-slate-200 mb-6">
          {ORDER_TABS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4 min-h-[55vh]">
          {demoOnly.map(order => renderOrderCard(order, true))}
        </div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell maxWidth="lg">
        <div className="space-y-4 min-h-[60vh]">
          {[1, 2, 3].map(i => <div key={i} className="animate-pulse h-32 bg-slate-100 rounded-xl" />)}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders</h1>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showDemo}
            onChange={e => setShowDemo(e.target.checked)}
            className="accent-sky-600 rounded"
          />
          Show demo orders
        </label>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {ORDER_TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-100 min-h-[55vh] text-center">
          <Package size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">No {tab.toLowerCase()} orders</h2>
          <p className="text-sm text-slate-500 mb-4">Your {tab.toLowerCase()} orders will appear here.</p>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search Parts
          </button>
        </div>
      ) : (
        <div className="space-y-4 min-h-[55vh]">
          {displayOrders.map(order =>
            renderOrderCard(order, order.id.startsWith('demo-'))
          )}
        </div>
      )}
    </PageShell>
  );
}
