import React, { useState, useEffect } from 'react';
import { Farm } from '../../types';
import { X, Tractor, Layers, MapPin, Thermometer, Check } from 'lucide-react';

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmData: Omit<Farm, 'id'> | Partial<Farm>) => Promise<void>;
  editingFarm?: Farm | null;
}

const SOIL_TYPES = [
  'Loam (Rich Organic Soil)',
  'Clay (High Retention)',
  'Sandy (Quick Drainage)',
  'Silt (Nutrient Rich)',
  'Peat (High Organic Matter)',
  'Chalk (Alkaline Base)',
];

const REGIONS = [
  'Midwest Agriculture Belt',
  'Central Valley & West Coast',
  'Southern Coastal Belt',
  'Sub-Saharan Arid Region',
  'Mediterranean Coastal Basin',
  'Tropical Southeast Monsoon Zone',
  'South American Pampas',
];

export const FarmModal: React.FC<FarmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFarm,
}) => {
  const [name, setName] = useState('');
  const [size, setSize] = useState<number>(25);
  const [soilType, setSoilType] = useState(SOIL_TYPES[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [climateNotes, setClimateNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingFarm) {
      setName(editingFarm.name);
      setSize(editingFarm.size);
      setSoilType(editingFarm.soil_type);
      setRegion(editingFarm.region);
      setClimateNotes(editingFarm.climate_notes || '');
    } else {
      setName('');
      setSize(25);
      setSoilType(SOIL_TYPES[0]);
      setRegion(REGIONS[0]);
      setClimateNotes('');
    }
    setError('');
  }, [editingFarm, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Farm name is required');
      return;
    }
    if (size <= 0) {
      setError('Size must be greater than 0 acres');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave({
        name: name.trim(),
        size: Number(size),
        soil_type: soilType,
        region: region,
        climate_notes: climateNotes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save farm profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-brand-500/30 p-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingFarm ? 'Edit Farm Profile' : 'Register New Farm Profile'}
              </h3>
              <p className="text-xs text-gray-400">Set soil, acreage, and regional climate context</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Farm Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Green Valley Plot A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Total Land Size (Acres)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Soil Classification
              </label>
              <div className="relative">
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0A160F] appearance-none"
                >
                  {SOIL_TYPES.map((soil) => (
                    <option key={soil} value={soil} className="bg-[#0A160F] text-white">
                      {soil}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> Geographical Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0A160F] appearance-none"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r} className="bg-[#0A160F] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-brand-400" /> Climate & Seasonal Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Mild winter frost, annual rainfall 30 inches, drip irrigation available..."
              value={climateNotes}
              onChange={(e) => setClimateNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span className="animate-pulse">Saving Profile...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {editingFarm ? 'Update Farm' : 'Save Farm Profile'}
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
