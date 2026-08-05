import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/ui/Navbar';
import { FarmModal } from '../components/ui/FarmModal';
import { api } from '../services/api';
import { Farm } from '../types';
import { Tractor, Plus, Edit2, Trash2, MapPin, Layers, Thermometer, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getFarms();
      setFarms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load farm records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleSaveFarm = async (farmData: Omit<Farm, 'id'> | Partial<Farm>) => {
    if (editingFarm && editingFarm.id) {
      await api.updateFarm(editingFarm.id, farmData);
    } else {
      await api.createFarm(farmData as Omit<Farm, 'id'>);
    }
    await fetchFarms();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deleting this farm profile will also remove associated advisory reports. Proceed?')) return;
    try {
      await api.deleteFarm(id);
      setFarms((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete farm');
    }
  };

  return (
    <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-brand-500/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Tractor className="w-7 h-7 text-brand-400" />
              Farm Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Configure soil characteristics, acreage bounds, and regional micro-climates
            </p>
          </div>

          <button
            onClick={() => {
              setEditingFarm(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Farm
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Farms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 glass-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : farms.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border-dashed border-white/10 max-w-lg mx-auto">
            <Tractor className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Farms Registered</h3>
            <p className="text-xs text-gray-400 mt-1">
              Register your land plot dimensions and soil profile to request personalized AI crop advice.
            </p>
            <button
              onClick={() => {
                setEditingFarm(null);
                setIsModalOpen(true);
              }}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Register Farm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div key={farm.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                        {farm.name}
                      </h3>
                      <div className="mt-1 text-xs text-brand-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {farm.region}
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {farm.size} Acres
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand-400" /> Soil Profile:
                      </span>
                      <strong className="text-white">{farm.soil_type}</strong>
                    </div>

                    {farm.climate_notes && (
                      <div className="pt-2">
                        <span className="text-gray-400 flex items-center gap-1.5 mb-1">
                          <Thermometer className="w-3.5 h-3.5 text-brand-400" /> Climate Notes:
                        </span>
                        <p className="text-gray-300 italic bg-black/30 p-2 rounded-lg text-[11px] leading-relaxed">
                          "{farm.climate_notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingFarm(farm);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Farm Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id)}
                      className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Farm Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/advisory/new?farm_id=${farm.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Get Advisory
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <FarmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFarm(null);
        }}
        onSave={handleSaveFarm}
        editingFarm={editingFarm}
      />
    </div>
  );
};
