import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { UserVehicle, VehicleMake, VehicleModel } from '../types';
import PageShell from '../components/PageShell';
import { Car, Plus, Trash2, Lock, X } from 'lucide-react';

export default function GaragePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchVehicles();
    supabase.from('vehicle_makes').select('*').order('name').then(({ data }) => setMakes(data || []));
  }, [user]);

  useEffect(() => {
    if (selectedMake) {
      supabase.from('vehicle_models').select('*').eq('make_id', selectedMake).order('name')
        .then(({ data }) => setModels(data || []));
    } else { setModels([]); setSelectedModel(''); }
  }, [selectedMake]);

  async function fetchVehicles() {
    const { data } = await supabase
      .from('user_vehicles')
      .select('*, model:vehicle_models(*, make:vehicle_makes(*))')
      .eq('user_id', user!.id);
    setVehicles(data || []);
    setLoading(false);
  }

  async function addVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedModel) return;
    setAdding(true);
    await supabase.from('user_vehicles').insert({
      user_id: user.id,
      model_id: selectedModel,
      registration_number: regNumber || null,
      nickname: nickname || null,
    });
    setShowAdd(false);
    setSelectedMake('');
    setSelectedModel('');
    setRegNumber('');
    setNickname('');
    fetchVehicles();
    setAdding(false);
  }

  async function removeVehicle(id: string) {
    await supabase.from('user_vehicles').delete().eq('id', id);
    setVehicles(prev => prev.filter(v => v.id !== id));
  }

  if (!user) {
    return (
      <PageShell maxWidth="md">
        <div className="flex flex-col items-center justify-center py-24 min-h-[60vh] text-center">
          <Lock size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Sign in to manage your garage</h2>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
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
          {[1, 2].map(i => <div key={i} className="animate-pulse h-24 bg-slate-100 rounded-xl" />)}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Garage</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Add Vehicle</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={addVehicle} className="space-y-4">
              <select
                value={selectedMake}
                onChange={e => { setSelectedMake(e.target.value); setSelectedModel(''); }}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-400"
              >
                <option value="">Select Make</option>
                {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                required
                disabled={!selectedMake}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-400 disabled:opacity-50"
              >
                <option value="">Select Model</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input
                type="text"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                placeholder="Registration Number (e.g. HR26AB1234)"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-sky-400 bg-white"
              />
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Nickname (e.g. My Daily)"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-sky-400 bg-white"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-100 min-h-[55vh] text-center">
          <Car size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">No vehicles in your garage</h2>
          <p className="text-sm text-slate-500">Add your vehicle to find compatible parts faster</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {v.nickname || `${(v.model as any)?.make?.name || ''} ${(v.model as any)?.name || ''}`}
                  </h3>
                  {(v.model as any)?.make && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(v.model as any).make.name} {(v.model as any).name}
                    </p>
                  )}
                  {v.registration_number && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">{v.registration_number}</p>
                  )}
                </div>
                <button
                  onClick={() => removeVehicle(v.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
