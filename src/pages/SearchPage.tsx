import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Part, Category, VehicleMake, VehicleModel } from '../types';
import {
  Search, ChevronRight, Edit2, Bookmark, ShoppingCart, ChevronDown, SlidersHorizontal, X,
} from 'lucide-react';

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
}

function FilterRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [oem, setOem] = useState(true);
  const [aftermarket, setAftermarket] = useState(true);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const query = params.get('q') || '';
  const categorySlug = params.get('category') || '';
  const makeSlug = params.get('make') || '';
  const modelSlug = params.get('model') || '';
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
    supabase.from('vehicle_makes').select('*').order('name').then(({ data }) => setMakes(data || []));
  }, []);

  useEffect(() => {
    if (makeSlug) {
      const make = makes.find(m => m.slug === makeSlug);
      if (make) setSelectedMake(make.id);
    }
  }, [makeSlug, makes]);

  useEffect(() => {
    if (selectedMake) {
      supabase.from('vehicle_models').select('*').eq('make_id', selectedMake).order('name')
        .then(({ data }) => {
          setModels(data || []);
          if (modelSlug) {
            const model = (data || []).find(m => m.slug === modelSlug);
            if (model) setSelectedModel(model.id);
          }
        });
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedMake, modelSlug]);

  useEffect(() => {
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) setSelectedCategory(cat.id);
    }
  }, [categorySlug, categories]);

  useEffect(() => {
    fetchParts();
  }, [query, categorySlug, makeSlug, modelSlug, categories, inStockOnly, oem, aftermarket, sortBy]);

  async function fetchParts() {
    setLoading(true);
    let partQuery = supabase.from('parts').select('*, category:categories(*), brand:brands(*)');

    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) partQuery = partQuery.eq('category_id', cat.id);
    }
    if (selectedCategory && !categorySlug) {
      partQuery = partQuery.eq('category_id', selectedCategory);
    }
    if (query) {
      partQuery = partQuery.or(`name.ilike.%${query}%,oem_number.ilike.%${query}%`);
    }
    if (inStockOnly) {
      partQuery = partQuery.eq('in_stock', true);
    }
    if (oem && !aftermarket) {
      partQuery = partQuery.eq('is_genuine', true);
    } else if (aftermarket && !oem) {
      partQuery = partQuery.eq('is_genuine', false);
    }

    if (sortBy === 'price-asc') partQuery = partQuery.order('price', { ascending: true });
    else if (sortBy === 'price-desc') partQuery = partQuery.order('price', { ascending: false });
    else if (sortBy === 'name') partQuery = partQuery.order('name');
    else partQuery = partQuery.order('name');

    const { data } = await partQuery.limit(50);

    if (modelSlug && data) {
      const model = models.find(m => m.slug === modelSlug);
      if (model) {
        const { data: compatIds } = await supabase
          .from('part_vehicles')
          .select('part_id')
          .eq('model_id', model.id);
        const compatSet = new Set((compatIds || []).map(c => c.part_id));
        setParts(data.filter(p => compatSet.has(p.id)));
      } else {
        setParts(data || []);
      }
    } else {
      setParts(data || []);
    }
    setLoading(false);
  }

  function updateSearch() {
    const p = new URLSearchParams();
    if (searchInput.trim()) p.set('q', searchInput.trim());
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      if (cat) p.set('category', cat.slug);
    }
    if (selectedMake) {
      const make = makes.find(m => m.id === selectedMake);
      if (make) p.set('make', make.slug);
    }
    if (selectedModel) {
      const model = models.find(m => m.id === selectedModel);
      if (model) p.set('model', model.slug);
    }
    setParams(p);
  }

  function clearFilters() {
    setSearchInput('');
    setSelectedCategory('');
    setSelectedMake('');
    setSelectedModel('');
    setOem(true);
    setAftermarket(true);
    setInStockOnly(false);
    setParams({});
  }

  const selectedMakeName = makes.find(m => m.id === selectedMake)?.name;
  const selectedModelName = models.find(m => m.id === selectedModel)?.name;
  const selectedCatName = categories.find(c => c.id === selectedCategory)?.name;
  const pageTitle = query
    ? `Results for "${query}"`
    : selectedCatName
      ? `${selectedCatName}${selectedModelName ? ` for ${selectedModelName}` : ''}`
      : 'Search Parts';

  const sidebar = (
    <aside className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Filters</h3>
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-sky-600 hover:underline">
            Clear All
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <FilterGroup title="Search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Part name or OEM..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateSearch()}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </FilterGroup>

          {(selectedMakeName || selectedModelName) && (
            <FilterGroup title="Vehicle">
              {selectedMakeName && <FilterRow label="Make" value={selectedMakeName} />}
              {selectedModelName && <FilterRow label="Model" value={selectedModelName} />}
            </FilterGroup>
          )}

          <FilterGroup title="Category">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-400"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title="Vehicle Make">
            <select
              value={selectedMake}
              onChange={e => { setSelectedMake(e.target.value); setSelectedModel(''); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-400"
            >
              <option value="">All Makes</option>
              {makes.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-400 disabled:opacity-50"
            >
              <option value="">All Models</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title="Brand Type">
            <label className="flex items-center gap-2 py-1 text-sm cursor-pointer">
              <input type="checkbox" checked={oem} onChange={e => setOem(e.target.checked)} className="accent-sky-600" />
              OEM Genuine
            </label>
            <label className="flex items-center gap-2 py-1 text-sm cursor-pointer">
              <input type="checkbox" checked={aftermarket} onChange={e => setAftermarket(e.target.checked)} className="accent-sky-600" />
              OES / Aftermarket
            </label>
          </FilterGroup>

          <FilterGroup title="Availability">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-sky-600" />
              In Stock Only
            </label>
          </FilterGroup>

          <button
            type="button"
            onClick={updateSearch}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Vehicle context bar */}
      {(selectedMakeName || selectedModelName) && (
        <div className="bg-slate-900 text-white">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span>🚗</span>
              <span className="font-semibold">
                {selectedMakeName} {selectedModelName}
              </span>
            </div>
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white">
              <Edit2 className="w-3.5 h-3.5" /> Change Vehicle
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 px-4 py-6 pb-20 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">{sidebar}</div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden col-span-full">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showMobileFilters ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {showMobileFilters && <X className="w-4 h-4 ml-auto" />}
          </button>
          {showMobileFilters && <div className="mt-4">{sidebar}</div>}
        </div>

        <section className="min-h-[60vh]">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Search</span>
            {selectedCatName && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">{selectedCatName}</span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {loading ? 'Searching...' : <>Showing <strong>{parts.length}</strong> results</>}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-400 w-44"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="mt-5 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-100 min-h-[50vh]">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No parts found</h3>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters</p>
              <button type="button" onClick={clearFilters} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parts.map(part => (
                  <article
                    key={part.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Link to={`/part/${part.slug}`} className="block relative aspect-square bg-slate-100">
                      {part.image_url ? (
                        <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-slate-300">
                          <Search className="w-12 h-12" />
                        </div>
                      )}
                      <span className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        part.is_genuine ? 'bg-slate-900 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {part.is_genuine ? 'OEM Genuine' : 'Aftermarket'}
                      </span>
                    </Link>
                    <div className="p-4">
                      {part.brand && <div className="text-xs text-slate-500">{part.brand.name}</div>}
                      <Link to={`/part/${part.slug}`} className="mt-1 block text-[15px] font-semibold leading-snug text-slate-900 hover:text-sky-600 line-clamp-2">
                        {part.name}
                      </Link>
                      {part.oem_number && (
                        <div className="mt-1 font-mono text-xs text-slate-400">#{part.oem_number}</div>
                      )}
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-xl font-bold text-slate-900">&#8377;{part.price.toLocaleString('en-IN')}</div>
                          {part.mrp && part.mrp > part.price && (
                            <div className="text-xs text-slate-400 line-through">&#8377;{part.mrp.toLocaleString('en-IN')}</div>
                          )}
                          <div className="text-[11px] text-slate-500">Incl. GST</div>
                        </div>
                        <span className={`text-xs font-semibold ${part.in_stock ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {part.in_stock ? 'In Stock' : 'Low stock'}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/part/${part.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" /> View Part
                        </Link>
                        <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" title="Save">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {parts.length >= 6 && (
                <div className="mt-8 flex items-center justify-center gap-1">
                  {[1, 2, 3, '…', 8].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`w-9 h-9 rounded text-sm font-medium ${
                        p === 1 ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
