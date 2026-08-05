import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { ViabilityGauge } from '../components/ui/ViabilityGauge';
import { api } from '../services/api';
import { AdvisoryRecord } from '../types';
import {
  Sparkles,
  Tractor,
  Layers,
  Bug,
  Droplets,
  DollarSign,
  Calendar,
  ArrowLeft,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const ReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchAdvisory = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getAdvisoryById(id);
        setAdvisory(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load advisory report');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisory();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Sparkles className="w-10 h-10 text-brand-400 animate-spin mx-auto" />
            <p className="text-sm text-gray-300 font-mono">Loading Advisory Report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="glass-panel p-8 rounded-2xl text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">Report Not Found</h2>
            <p className="text-xs text-gray-400 mt-1">{error || 'Unable to locate this advisory record'}</p>
            <Link
              to="/dashboard"
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { target_crop, budget, ai_response_json, created_at, farms } = advisory;
  const {
    viabilityScore,
    executiveSummary,
    soilRecommendations,
    pestControl,
    irrigationPlan,
    financialBreakdown,
    timeline,
  } = ai_response_json;

  return (
    <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:bg-white print:text-black">
        
        {/* Navigation Bar & Export Tools */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 glass-card hover:bg-white/10 border border-white/10 flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              Print / Save PDF
            </button>

            <Link
              to="/advisory/new"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate New Advisory
            </Link>
          </div>
        </div>

        {/* Report Header Hero */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-500/30 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 text-brand-300 border border-brand-500/30">
                  Certified Gemini Agronomy Report
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {new Date(created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {target_crop}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Tractor className="w-4 h-4 text-brand-400" />
                  <span>Farm: <strong className="text-white">{farms?.name || 'Registered Farm'}</strong></span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-400" />
                  <span>Size: <strong className="text-white">{farms?.size || 'N/A'} Acres</strong></span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span>Soil: <strong className="text-white">{farms?.soil_type || 'Loam'}</strong> ({farms?.region})</span>
                </div>
              </div>
            </div>

            {/* Viability Gauge Wheel */}
            <div className="shrink-0 flex justify-center">
              <ViabilityGauge score={viabilityScore} size="lg" />
            </div>

          </div>

        </div>

        {/* Executive Summary Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            Executive Agronomic Summary
          </h2>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
            {executiveSummary}
          </p>
        </div>

        {/* Financial & ROI Metrics Card */}
        {financialBreakdown && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border-brand-500/20">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Allocated Operating Budget</span>
                <DollarSign className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                ${budget.toLocaleString()}
              </div>
              <div className="text-xs text-brand-400 mt-1">
                Est. Cost: ${financialBreakdown.estimatedCost.toLocaleString()}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Projected Yield Impact</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-emerald-400 mt-2">
                {financialBreakdown.projectedYieldIncrease}
              </div>
              <div className="text-xs text-gray-400 mt-1">Vs. regional baseline</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border-amber-500/20">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Estimated Payback Horizon</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-400 mt-2">
                {financialBreakdown.roiMonths} Months
              </div>
              <div className="text-xs text-gray-400 mt-1">Full capital recovery</div>
            </div>

          </div>
        )}

        {/* Detailed Agronomic Protocols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Soil Enrichment Protocols */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Soil Enrichment & Conditioning</h3>
                <p className="text-xs text-gray-400">pH regulation, compost, and microbial balance</p>
              </div>
            </div>

            <ul className="space-y-3 pt-2">
              {soilRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrated Pest Management (IPM) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Integrated Pest Management (IPM)</h3>
                <p className="text-xs text-gray-400">Biological traps, organic sprays, and borders</p>
              </div>
            </div>

            <ul className="space-y-3 pt-2">
              {pestControl.map((pest, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pest}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Irrigation Plan Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Precision Irrigation Schedule</h3>
              <p className="text-xs text-gray-400">Sub-surface drip timing & evapotranspiration management</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/5">
            {irrigationPlan}
          </p>
        </div>

        {/* Action Calendar / Phase Timeline */}
        {timeline && timeline.length > 0 && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-400" />
              Season Action Timeline & Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timeline.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-widest block mb-1">
                      Phase {i + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.phase}</h4>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
