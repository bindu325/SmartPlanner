import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, AlertCircle, X, Check } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PlanGeneratorModal = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const [dailyHours, setDailyHours] = useState(4);
  const [startDate, setStartDate] = useState(formatDate(new Date()));

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    onGenerate({
      dailyHoursAvailable: Number(dailyHours),
      startDate: startDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">
              Generate Smart Schedule
            </h3>
            <p className="text-xs text-slate-400">
              Algorithmic prioritization & workload distribution
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Daily study capacity */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                Daily Study Capacity
              </label>
              <span className="text-sm font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {dailyHours} Hours / Day
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>1 hr (Light)</span>
              <span>4-6 hrs (Optimal)</span>
              <span>12 hrs (Intense)</span>
            </div>
          </div>

          {/* Schedule Start Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Schedule Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Key Scheduling Benefits */}
          <div className="space-y-2 text-xs text-slate-300 bg-indigo-950/20 border border-indigo-900/40 p-3.5 rounded-xl">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hard and urgent topics prioritized first</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Splits topics into Learn, Practice, and Revision sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strictly respects your daily {dailyHours}h limit</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Generate Plan Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanGeneratorModal;
