import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Part } from '../types';
import {
  ShieldCheck, Truck, ShoppingCart, Minus, Plus, ChevronRight, Check
} from 'lucide-react';

export default function PartDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from('parts')
      .select('*, category:categories(*), brand:brands(*)')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setPart(data);
        setLoading(false);
      });
  }, [slug]);

  async function addToCart() {
    if (!user || !part) return;
    setAdding(true);
    const { error } = await supabase.from('cart_items').upsert({
      user_id: user.id,
      part_id: part.id,
      quantity: qty,
    }, { onConflict: 'user_id,part_id' });
    if (!error) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
    setAdding(false);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-100 rounded w-24 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-100 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-6 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center pb-20">
        <h2 className="text-lg font-semibold text-slate-900">Part not found</h2>
        <button onClick={() => navigate('/search')} className="mt-4 text-sm text-sky-600 hover:text-sky-700">
          Back to search
        </button>
      </div>
    );
  }

  const discount = part.mrp && part.mrp > part.price
    ? Math.round(((part.mrp - part.price) / part.mrp) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <button onClick={() => navigate('/search')} className="hover:text-sky-600 transition-colors">Search</button>
        <ChevronRight size={12} />
        {part.category && (
          <>
            <button onClick={() => navigate(`/search?category=${part.category!.slug}`)} className="hover:text-sky-600 transition-colors">
              {part.category!.name}
            </button>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-slate-900 font-medium">{part.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
          {part.image_url ? (
            <img
              src={part.image_url}
              alt={part.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                <ShoppingCart size={40} />
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {part.is_genuine && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full mb-3">
              <ShieldCheck size={12} /> Genuine Part
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{part.name}</h1>

          {part.brand && (
            <p className="mt-1 text-sm text-slate-500">by {part.brand.name}</p>
          )}

          {part.oem_number && (
            <p className="mt-2 text-sm text-slate-400 font-mono">OEM: {part.oem_number}</p>
          )}

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-slate-900">
              &#8377;{part.price.toLocaleString('en-IN')}
            </span>
            {part.mrp && part.mrp > part.price && (
              <>
                <span className="text-base text-slate-400 line-through">
                  &#8377;{part.mrp.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-3">
            <span className={`text-sm font-medium ${part.in_stock ? 'text-emerald-600' : 'text-red-500'}`}>
              {part.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {part.description && (
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{part.description}</p>
          )}

          {/* Quantity + Add to Cart */}
          {user && part.in_stock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-slate-900 min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={adding}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                {added ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </button>
            </div>
          )}

          {!user && part.in_stock && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-sm text-slate-600 mb-3">Sign in to add items to your cart</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: 'Genuine & Verified' },
              { icon: Truck, label: 'Same-Day Dispatch' },
            ].map(badge => (
              <div key={badge.label} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <badge.icon size={16} className="text-sky-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
