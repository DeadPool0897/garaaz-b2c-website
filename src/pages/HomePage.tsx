import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import PartSearch from '../components/PartSearch';
import {
  Search, ShieldCheck, Truck, Clock, Phone, Camera, Wrench,
  Cog, Disc, CarFront, Zap, Car, Filter, Settings2, Thermometer, MoveDiagonal, Wind,
  ArrowRight, BadgePercent, Undo, Headphones, UserCheck, ThumbsUp,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Cog, Disc, CarFront, Zap, Car, Filter, Settings2, Thermometer, MoveDiagonal, Wind,
  Wrench,
};

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: '100% Genuine' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: BadgePercent, label: 'Best Price Guaranteed' },
  { icon: Undo, label: 'Easy Returns' },
  { icon: Headphones, label: 'Expert Support' },
  { icon: UserCheck, label: 'Verified Sellers' },
  { icon: ThumbsUp, label: 'Trusted by Workshops' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
  }, []);

  const steps = [
    { icon: Search, title: 'Search Your Part', desc: 'Find parts by OEM number, name, or select your vehicle' },
    { icon: ShieldCheck, title: 'Verify Genuineness', desc: 'Every part is traceable to verified OEM sources' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Same-day dispatch from our distributor network' },
    { icon: Clock, title: 'Track Your Order', desc: 'Real-time updates from dispatch to your doorstep' },
  ];

  const orderMethods = [
    { icon: Search, title: 'Search & Buy', desc: 'Browse our catalogue of 100k+ parts with smart filters by vehicle.', color: 'border-l-sky-600' },
    { icon: Camera, title: 'Click & Buy', desc: 'Upload a photo of the part — our experts source it within 30 minutes.', color: 'border-l-emerald-500' },
    { icon: Phone, title: 'Speak & Buy', desc: 'Send a voice note describing what you need. Hands busy? No problem.', color: 'border-l-amber-500' },
  ];

  return (
    <div>
      {/* Hero with tabbed part search */}
      <section className="relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,.06) 0, transparent 40%),
              radial-gradient(circle at 80% 60%, rgba(56,189,248,.08) 0, transparent 45%)
            `,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-16 sm:pb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
              Sahi Part, Sahi Time.
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              Search genuine spare parts for 15+ brands, delivered to your doorstep.
            </p>
          </div>
          <PartSearch />
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-b border-slate-200 bg-white py-4">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
            {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-emerald-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p className="mt-2 text-slate-500">Browse our wide range of genuine automotive parts</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map(cat => {
            const Icon = iconMap[cat.icon] || Wrench;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/search?category=${cat.slug}`)}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700 transition-colors text-center">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* How to Order */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How You Can Order</h2>
            <p className="mt-2 text-slate-500">Three fast ways to get the part you need — pick what&apos;s easiest.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {orderMethods.map(method => (
              <div
                key={method.title}
                className={`relative p-6 rounded-2xl border border-slate-100 bg-white border-l-4 ${method.color} hover:shadow-md transition-all duration-200`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  <method.icon size={20} className="text-slate-700" />
                </div>
                <h3 className="text-base font-semibold mb-1">{method.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{method.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
                  <step.icon size={28} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to find the right part?
          </h2>
          <p className="mt-3 text-slate-400">
            Join thousands of vehicle owners who trust Garaaz for genuine spare parts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Search Parts
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
