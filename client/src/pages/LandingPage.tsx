import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import {
  Sprout,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  BarChart3,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070D09] text-gray-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glowing backdrop Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold tracking-wide mb-8 animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Agronomic Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans max-w-5xl mx-auto leading-[1.15]">
            Maximize Crop Yields with <br />
            <span className="gradient-text">Precision Gemini AI Advisory</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Generate custom soil enrichment strategies, pest prevention protocols, and optimized irrigation schedules tailored to your exact land size, climate region, and operational budget.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/advisory/new"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-400 hover:from-brand-500 hover:to-emerald-300 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-2 group text-base"
            >
              <Sparkles className="w-5 h-5 text-white" />
              Generate Farm Advisory
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-gray-200 glass-card hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-base border border-white/10"
            >
              <BarChart3 className="w-5 h-5 text-brand-400" />
              View Demo Dashboard
            </Link>
          </div>

          {/* Live Platform Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Yield Increase Avg', value: '+32%' },
              { label: 'Soil Types Analyzed', value: '100+' },
              { label: 'Target Crops Supported', value: '50+ Species' },
              { label: 'Agronomic Precision', value: '99.4%' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl glass-card text-center">
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Feature Highlights */}
      <section className="py-20 border-t border-emerald-500/10 bg-[#060B08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Modern Farmers & Agronomists
            </h2>
            <p className="mt-4 text-base text-gray-400">
              Combine satellite climate signals, soil chemistry logic, and financial budgeting into one actionable blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Multi-Plot Farm Profiles</h3>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  Manage multiple acreage plots. Define soil chemistry (Loam, Clay, Silt, Peat), acreage bounds, and micro-climate conditions.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Granular Soil Classification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Climate Region Adaptation
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border-brand-500/40 shadow-xl shadow-brand-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-brand-500 text-[#070D09] text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Core Engine
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Gemini AI Agronomy Engine</h3>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  Powered by Google Gemini models tuned specifically for master agronomic analysis. Synthesizes inputs into validated JSON schema structures.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Strict Zod Schema Validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Zero Markdown Hallucinations
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Actionable Financial ROI</h3>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  Get exact cost allocations per acre, projected yield multiplier calculations, and a step-by-step planting-to-harvest calendar.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Capital Optimization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Phase-by-Phase Timeline
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/5 bg-[#040805] text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Sprout className="w-4 h-4 text-brand-400" />
            <span>AgriWise AI SaaS MVP • Production Grade</span>
          </div>
          <div>
            Built with React (Vite), Express.js, Supabase RLS, and Google Gemini API SDK
          </div>
        </div>
      </footer>
    </div>
  );
};
