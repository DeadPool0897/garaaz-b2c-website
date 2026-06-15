import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Car, Wrench, Hash, CreditCard, ChevronDown,
} from 'lucide-react';

const brands = [
  { id: 'maruti', name: 'Maruti Suzuki', models: ['Alto', 'WagonR', 'Swift', 'Dzire', 'Baleno', 'Vitara Brezza', 'Ertiga', 'Ciaz'] },
  { id: 'hyundai', name: 'Hyundai', models: ['i10', 'i20', 'Santro', 'Verna', 'Creta', 'Venue', 'Tucson'] },
  { id: 'honda', name: 'Honda', models: ['Brio', 'Amaze', 'City', 'Jazz', 'WR-V', 'CR-V'] },
  { id: 'toyota', name: 'Toyota', models: ['Innova', 'Fortuner', 'Camry', 'Yaris', 'Glanza'] },
  { id: 'tata', name: 'Tata', models: ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Tigor'] },
  { id: 'mahindra', name: 'Mahindra', models: ['Scorpio', 'XUV500', 'XUV300', 'Thar', 'Bolero', 'KUV100'] },
  { id: 'kia', name: 'Kia', models: ['Seltos', 'Sonet', 'Carnival', 'Carens'] },
  { id: 'volkswagen', name: 'Volkswagen', models: ['Polo', 'Vento', 'T-Roc', 'Tiguan'] },
];

const vehicleYears = Array.from({ length: 20 }, (_, i) => (2026 - i).toString());
const modifications = ['Standard', 'VXI', 'ZXI', 'ZXI+', 'LXI', 'VDI', 'ZDI', 'Sport'];

const quickTags = ['Brake Pads', 'Oil Filter', 'Air Filter', 'Shock Absorber', 'Clutch Kit', 'Spark Plugs'];

type SearchTab = 'vehicle' | 'part' | 'number' | 'lpn';

const heroTabs = [
  { id: 'vehicle' as const, label: 'By Vehicle', icon: Car },
  { id: 'part' as const, label: 'By Part Name', icon: Wrench },
  { id: 'number' as const, label: 'By Part Number', icon: Hash },
  { id: 'lpn' as const, label: 'By Vehicle Number', icon: CreditCard },
];

function SelectField({
  label, value, onChange, options, placeholder, disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none px-3 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white pr-8 text-slate-900"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default function PartSearch({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [heroTab, setHeroTab] = useState<SearchTab>('vehicle');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMod, setVehicleMod] = useState('');
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [vrnNumber, setVrnNumber] = useState('');
  const [vinNumber, setVinNumber] = useState('');

  const selectedBrandModels = brands.find(b => b.name === vehicleBrand)?.models || [];

  function buildParams(q?: string) {
    const params = new URLSearchParams();
    const query = q?.trim();
    if (query) params.set('q', query);
    if (vehicleBrand) params.set('make', vehicleBrand.toLowerCase().replace(/\s+/g, '-'));
    if (vehicleModel) params.set('model', vehicleModel.toLowerCase().replace(/\s+/g, '-'));
    return params;
  }

  function goSearch(q?: string) {
    navigate(`/search?${buildParams(q).toString()}`);
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900 ${compact ? 'shadow-lg' : 'shadow-slate-900/20'}`}>
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
        {heroTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setHeroTab(tab.id)}
              className={`flex-1 min-w-[120px] py-3.5 px-4 text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                heroTab === tab.id
                  ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 min-h-[200px] md:min-h-[180px]">
        {heroTab === 'vehicle' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <SelectField
                label="Vehicle Brand"
                value={vehicleBrand}
                onChange={v => { setVehicleBrand(v); setVehicleModel(''); }}
                options={brands.map(b => b.name)}
                placeholder="Select Brand"
              />
              <SelectField
                label="Model"
                value={vehicleModel}
                onChange={setVehicleModel}
                options={selectedBrandModels}
                placeholder="Select Model"
                disabled={!vehicleBrand}
              />
              <SelectField
                label="Year"
                value={vehicleYear}
                onChange={setVehicleYear}
                options={vehicleYears}
                placeholder="Select Year"
              />
              <SelectField
                label="Modification"
                value={vehicleMod}
                onChange={setVehicleMod}
                options={modifications}
                placeholder="Select Variant"
              />
            </div>
            <button
              type="button"
              onClick={() => goSearch()}
              className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 text-base"
            >
              <Search className="w-5 h-5" />
              Search Parts
            </button>
          </div>
        )}

        {heroTab === 'part' && (
          <div>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={partName}
                  onChange={e => setPartName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goSearch(partName)}
                  placeholder="e.g. brake pad, clutch kit, air filter..."
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => goSearch(partName)}
                className="px-6 py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shrink-0"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTags.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => goSearch(s)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-sky-50 hover:text-sky-600 transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {heroTab === 'number' && (
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                value={partNumber}
                onChange={e => setPartNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && goSearch(partNumber)}
                placeholder="Enter OEM or aftermarket part number..."
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-colors font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => goSearch(partNumber)}
              className="px-6 py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        )}

        {heroTab === 'lpn' && (
          <div>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  License Plate Number
                </label>
                <input
                  value={vrnNumber}
                  onChange={e => setVrnNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 01 AB 1234"
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-sky-500 transition-colors tracking-widest"
                />
              </div>
              <div className="flex items-center justify-center shrink-0 md:pt-5">
                <span className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-full border border-slate-200">OR</span>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  VIN Number
                </label>
                <input
                  value={vinNumber}
                  onChange={e => setVinNumber(e.target.value.toUpperCase())}
                  placeholder="17-character VIN..."
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => goSearch(vrnNumber || vinNumber)}
              className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find My Vehicle Parts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
