import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { FarmModal } from '../components/ui/FarmModal';
import { api } from '../services/api';
import { Farm } from '../types';
import {
  Sparkles,
  Tractor,
  DollarSign,
  Sprout,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Bot,
  Info,
} from 'lucide-react';

const COMMON_CROPS = [
  'Yellow Corn (Zea mays)',
  'Wheat (Triticum aestivum)',
  'Soybeans (Glycine max)',
  'Cotton (Gossypium hirsutum)',
  'Tomatoes (Solanum lycopersicum)',
  'Potatoes (Solanum tuberosum)',
  'Rice (Oryza sativa)',
  'Coffee (Coffea arabica)',
  'Avocado (Persea americana)',
  'Almonds (Prunus dulcis)',
];

export const AdvisoryNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFarmId = searchParams.get('farm_id');

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [targetCrop, setTargetCrop] = useState(COMMON_CROPS[0]);
  const [customCrop, setCustomCrop] = useState('');
  const [useCustomCrop, setUseCustomCrop] = useState(false);
  const [budget, setBudget] = useState<number>(10000);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);

  // Animated loading messages during Gemini generation
  const [generationStep, setGenerationStep] = useState(0);
  const loadingSteps = [
    'Connecting to Google Gemini API Engine...',
    'Analyzing Soil Chemistry & Micro-Climate Vectors...',
    'Formulating Integrated Pest Management Protocol...',
    'Optimizing Precision Irrigation & Water Budget...',
    'Validating Structured JSON Output with Zod Schema...',
  ];

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getFarms();
      setFarms(data);
      if (data.length > 0) {
        if (preselectedFarmId && data.some((f) => f.id === preselectedFarmId)) {
          setSelectedFarmId(preselectedFarmId);
        } else {
          setSelectedFarmId(data[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load farms');
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleSaveFarm = async (farmData: Omit<Farm, 'id'>) => {
    const newFarm = await api.createFarm(farmData);
    await loadFarms();
    if (newFarm?.id) {
      setSelectedFarmId(newFarm.id);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId) {
      setError('Please select or register a farm profile');
      return;
    }

    const cropName = useCustomCrop ? customCrop.trim() : targetCrop;
    if (!cropName) {
      setError('Please specify a valid target crop');
      return;
    }

    if (budget < 0) {
      setError('Budget cannot be negative');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      setGenerationStep(0);

      const interval = setInterval(() => {
        setGenerationStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1200);

      const result = await api.generateAdvisory({
        farm_id: selectedFarmId,
        target_crop: cropName,
        budget: Number(budget),
      });

      clearInterval(interval);
      navigate(`/advisory/${result.id}`);

    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err.message || 'Failed to generate advisory report');
      setGenerating(false);
    }
  };

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  return (
    <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Step Wizard Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-brand-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/25">
              <div className="w-full h-full bg-[#08130B] rounded-[14px] flex items-center justify-center text-brand-400">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase tracking-widest">
                Gemini 2.5 Flash Powered
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                AI Agronomic Advisory Generator
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Input your farm specs, crop selection, and budget to receive custom advice
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Full Screen / Panel Generating Overlay */}
          {generating ? (
            <div className="py-16 text-center space-y-6 animate-fade-in">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 animate-ping" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 p-1 flex items-center justify-center shadow-xl shadow-brand-500/30">
                  <div className="w-full h-full bg-[#08130B] rounded-full flex items-center justify-center">
                    <Bot className="w-9 h-9 text-brand-400 animate-bounce" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white gradient-text">
                  Synthesizing Precision Advisory...
                </h3>
                <p className="text-sm text-brand-300 font-mono mt-2 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  {loadingSteps[generationStep]}
                </p>
              </div>

              <div className="max-w-md mx-auto bg-black/40 rounded-full h-2 p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${((generationStep + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Validating soil recommendations, integrated pest management, and irrigation schedules via strict Zod parsing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="mt-8 space-y-8">
              
              {/* Step 1: Select Farm Profile */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
                      1
                    </span>
                    Select Farm Profile
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFarmModalOpen(true)}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Farm
                  </button>
                </div>

                {loading ? (
                  <div className="h-12 glass-input rounded-xl animate-pulse" />
                ) : farms.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                    <span>No farm profiles registered yet.</span>
                    <button
                      type="button"
                      onClick={() => setIsFarmModalOpen(true)}
                      className="underline font-bold"
                    >
                      Create Farm Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {farms.map((farm) => (
                      <div
                        key={farm.id}
                        onClick={() => setSelectedFarmId(farm.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedFarmId === farm.id
                            ? 'bg-brand-500/15 border-brand-500/50 shadow-md shadow-brand-500/10'
                            : 'glass-input border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{farm.name}</span>
                          <span className="text-xs font-mono text-brand-400">{farm.size} Acres</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Soil: {farm.soil_type} • Region: {farm.region}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Farm Context Banner */}
              {selectedFarm && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Info className="w-4 h-4 text-brand-400" />
                    Selected Agronomic Context for AI Model:
                  </div>
                  <div>
                    <strong>Land Size:</strong> {selectedFarm.size} Acres | <strong>Soil Type:</strong> {selectedFarm.soil_type} | <strong>Region:</strong> {selectedFarm.region}
                  </div>
                  {selectedFarm.climate_notes && (
                    <div className="text-gray-400 italic">
                      Notes: "{selectedFarm.climate_notes}"
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Target Crop Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  Target Crop for Cultivation
                </label>

                <div className="flex items-center gap-4 mb-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="cropSelectionType"
                      checked={!useCustomCrop}
                      onChange={() => setUseCustomCrop(false)}
                      className="accent-brand-500"
                    />
                    Preset Agronomic Species
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="cropSelectionType"
                      checked={useCustomCrop}
                      onChange={() => setUseCustomCrop(true)}
                      className="accent-brand-500"
                    />
                    Custom / Special Crop
                  </label>
                </div>

                {!useCustomCrop ? (
                  <select
                    value={targetCrop}
                    onChange={(e) => setTargetCrop(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#08130B]"
                  >
                    {COMMON_CROPS.map((crop) => (
                      <option key={crop} value={crop} className="bg-[#08130B] text-white">
                        {crop}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Dragon Fruit, Blueberries, Stevia..."
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                )}
              </div>

              {/* Step 3: Available Budget ($) */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                  Operating Season Budget (USD)
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Gemini AI will align fertilizer, IPM, and drip irrigation recommendations within this budget envelope.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={generating || farms.length === 0}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-400 hover:from-brand-500 hover:to-emerald-300 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                Generate Gemini Advisory Report
                <ArrowRight className="w-5 h-5" />
              </button>

            </form>
          )}

        </div>
      </main>

      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onSave={handleSaveFarm}
      />
    </div>
  );
};
