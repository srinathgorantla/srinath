import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { AdvisoryCard } from '../components/ui/AdvisoryCard';
import { FarmModal } from '../components/ui/FarmModal';
import { api } from '../services/api';
import { Farm, AdvisoryRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  Sparkles,
  Award,
  Layers,
  Plus,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [farmsData, advisoriesData] = await Promise.all([
        api.getFarms(),
        api.getAdvisories(),
      ]);
      setFarms(farmsData);
      setAdvisories(advisoriesData);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Error loading dashboard records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveFarm = async (farmData: Omit<Farm, 'id'>) => {
    await api.createFarm(farmData);
    await fetchData();
  };

  const handleDeleteAdvisory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this advisory report?')) return;
    try {
      await api.deleteAdvisory(id);
      setAdvisories((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete advisory');
    }
  };

  // Metric Computations
  const totalAcreage = farms.reduce((acc, f) => acc + (f.size || 0), 0);
  const avgViability = advisories.length
    ? Math.round(
        advisories.reduce((acc, a) => acc + (a.ai_response_json?.viabilityScore || 0), 0) /
          advisories.length
      )
    : 85;

  return (
    <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-brand-500/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Hello, <span className="gradient-text">{user?.name || 'Agronomist'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Precision Agricultural Advisory Overview & Active Land Diagnostics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFarmModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-200 glass-card hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-brand-400" />
              Add Farm Profile
            </button>

            <Link
              to="/advisory/new"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Advisory
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchData} className="underline font-semibold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Key Operational Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{farms.length}</div>
              <div className="text-xs text-gray-400 font-medium">Registered Farms</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{totalAcreage} <span className="text-xs font-normal text-gray-400">Acres</span></div>
              <div className="text-xs text-gray-400 font-medium">Total Land Under Management</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{advisories.length}</div>
              <div className="text-xs text-gray-400 font-medium">Advisory Reports</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">{avgViability}%</div>
              <div className="text-xs text-gray-400 font-medium">Avg Crop Viability</div>
            </div>
          </div>

        </div>

        {/* Section: Registered Farms Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Tractor className="w-5 h-5 text-brand-400" />
              Active Farm Profiles
            </h2>
            <Link to="/farms" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              Manage All Farms <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-28 glass-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : farms.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center border-dashed border-white/10">
              <Tractor className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Farm Profiles Found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Create a farm profile with soil specifications and climate region to start generating AI advisory reports.
              </p>
              <button
                onClick={() => setIsFarmModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Your First Farm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <div key={farm.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">{farm.name}</h4>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {farm.size} Acres
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="truncate">{farm.region}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Soil: <strong className="text-gray-200">{farm.soil_type}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                      Added: {new Date(farm.created_at || '').toLocaleDateString()}
                    </span>
                    <Link
                      to={`/advisory/new?farm_id=${farm.id}`}
                      className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      Request Advisory <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section: Recent AI Advisory Reports */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Recent Advisory Reports
            </h2>
            <Link to="/advisory/new" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              New Report Wizard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-44 glass-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : advisories.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center border-dashed border-white/10">
              <Sparkles className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Advisory Reports Generated Yet</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Input your crop goals and budget to let Google Gemini AI generate structured soil, pest, and irrigation strategies.
              </p>
              <Link
                to="/advisory/new"
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Run Gemini Advisory Engine
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {advisories.map((advisory) => (
                <AdvisoryCard
                  key={advisory.id}
                  advisory={advisory}
                  onDelete={handleDeleteAdvisory}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Add Farm Profile Dialog Modal */}
      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onSave={handleSaveFarm}
      />
    </div>
  );
};
