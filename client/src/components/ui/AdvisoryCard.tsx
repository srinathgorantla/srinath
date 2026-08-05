import React from 'react';
import { Link } from 'react-router-dom';
import { AdvisoryRecord } from '../../types';
import { Sparkles, Calendar, DollarSign, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';

interface AdvisoryCardProps {
  advisory: AdvisoryRecord;
  onDelete?: (id: string) => void;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory, onDelete }) => {
  const { id, target_crop, budget, ai_response_json, created_at, farms } = advisory;
  const score = ai_response_json?.viabilityScore || 85;

  const scoreColor =
    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    score >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group hover:border-brand-500/40 relative">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                {target_crop}
              </h4>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-gray-300 font-medium">{farms?.name || 'Registered Farm'}</span>
                {farms?.size && <span>• {farms.size} Acres</span>}
              </p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
            {score}% Viability
          </div>
        </div>

        {/* Executive summary preview */}
        <p className="mt-3.5 text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {ai_response_json?.executiveSummary}
        </p>

        {/* Key Metrics row */}
        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <DollarSign className="w-3.5 h-3.5 text-brand-400" />
            <span>Budget: <strong className="text-white">${budget.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
        {onDelete ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete Advisory"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : <div />}

        <Link
          to={`/advisory/${id}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 group/link"
        >
          View Full Report
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
