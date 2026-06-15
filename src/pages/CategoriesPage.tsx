import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import PageShell from '../components/PageShell';
import {
  Wrench, Cog, Disc, CarFront, Zap, Car, Filter, Settings2, Thermometer, MoveDiagonal, Wind
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Cog, Disc, CarFront, Zap, Car, Filter, Settings2, Thermometer, MoveDiagonal, Wind, Wrench,
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <PageShell maxWidth="2xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">All Categories</h1>
      <p className="text-slate-500 mb-8">Browse parts by category</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[55vh]">
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || Wrench;
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/search?category=${cat.slug}`)}
              className="group flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-200 overflow-hidden"
            >
              {cat.image_url ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-100 group-hover:scale-105 transition-all shrink-0">
                  <Icon size={28} />
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700 transition-colors text-center">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
