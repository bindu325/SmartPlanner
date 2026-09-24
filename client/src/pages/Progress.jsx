import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { getProgress } from '../services/api';
import { getDaysRemaining } from '../utils/helpers';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getProgress();
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load progress statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-[#121829] border border-white/[0.06] rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-[#121829] border border-white/[0.06] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-[#121829] border border-white/[0.08] p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Performance & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Curriculum Progress & Exam Readiness
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time analytics across topic completion, study capacity, and exam milestones
          </p>
        </div>
      </div>

      {/* Main Overall Readiness Banner */}
      <div className="bg-gradient-to-br from-[#13192B] via-[#0F162A] to-[#12222E] border border-white/[0.08] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <Award className="w-4 h-4" /> Comprehensive Mastery Score
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stats?.overallPercentage || 0}% Total Syllabus Mastered
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              You have completed <span className="text-white font-bold">{stats?.completedTopics || 0}</span> out of{' '}
              <span className="text-white font-bold">{stats?.totalTopics || 0}</span> syllabus topics across all registered courses.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-3xl bg-slate-900/90 border border-emerald-500/30 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/10 ring-1 ring-white/10">
              <span className="text-3xl font-black text-emerald-400">{stats?.overallPercentage || 0}%</span>
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Completed</span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full mt-8 overflow-hidden border border-white/[0.08] relative z-10">
          <div
            className="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${stats?.overallPercentage || 0}%` }}
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#121829] border border-white/[0.08] p-5 sm:p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Topics</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">{stats?.totalTopics || 0}</div>
          <p className="text-xs text-slate-400 mt-1">Across all courses</p>
        </div>

        <div className="bg-[#121829] border border-white/[0.08] p-5 sm:p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed Topics</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1.5">{stats?.completedTopics || 0}</div>
          <p className="text-xs text-slate-400 mt-1">Mastered & verified</p>
        </div>

        <div className="bg-[#121829] border border-white/[0.08] p-5 sm:p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Remaining Topics</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">{stats?.remainingTopics || 0}</div>
          <p className="text-xs text-slate-400 mt-1">Pending in syllabus</p>
        </div>

        <div className="bg-[#121829] border border-white/[0.08] p-5 sm:p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Study Hours Done</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1.5">{stats?.completedHours || 0}h</div>
          <p className="text-xs text-slate-400 mt-1">Out of {stats?.plannedHours || 0}h planned</p>
        </div>
      </div>

      {/* Subject-wise Progress Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Subject-Wise Syllabus Completion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(stats?.subjectProgress || []).map((sub) => {
            const days = getDaysRemaining(sub.examDate);

            return (
              <div
                key={sub.subjectId}
                className="bg-[#121829] border border-white/[0.08] p-6 rounded-3xl space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-inner shrink-0"
                      style={{ backgroundColor: sub.color }}
                    />
                    <h4 className="font-extrabold text-white text-base">{sub.name}</h4>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      days <= 7
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {days >= 0 ? `${days}d left` : 'Passed'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Course Readiness</span>
                    <span className="text-white font-bold">
                      {sub.percentage}% ({sub.completedTopics}/{sub.totalTopics} topics)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sub.percentage}%`,
                        backgroundColor: sub.color || '#6366f1',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;
