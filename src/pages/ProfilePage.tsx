import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PageShell from '../components/PageShell';
import { User, Mail, Phone, Save, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  if (!user) {
    return (
      <PageShell maxWidth="sm">
        <div className="flex flex-col items-center justify-center py-24 min-h-[60vh] text-center">
          <Lock size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Sign in to view your profile</h2>
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

  return (
    <PageShell maxWidth="sm">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">My Profile</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-sky-400 transition-colors bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-sky-400 transition-colors bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-colors ${
            saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 hover:bg-sky-700 text-white'
          } disabled:opacity-50`}
        >
          {saved ? 'Saved!' : <>{saving ? 'Saving...' : 'Save Changes'} <Save size={16} /></>}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={signOut}
          className="w-full py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          Sign Out
        </button>
      </div>
    </PageShell>
  );
}
