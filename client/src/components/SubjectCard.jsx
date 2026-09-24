import React from 'react';
import { BookOpen, Calendar, Clock, ChevronRight, Layers, Award, Sparkles } from 'lucide-react';
import { getDaysRemaining } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const days = getDaysRemaining(subject.examDate);
  const isUrgent = days <= 7 && days >= 0;
  const isPast = days < 0;

  return (
    <div
      onClick={() => navigate(`/subjects/${subject._id}`)}
      className="group relative bg-[#121829] hover:bg-[#161F36] border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
    >
      {/* Top Accent Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: subject.color || '#6366f1' }}
      />

      {/* Decorative Glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
        style={{ backgroundColor: subject.color || '#6366f1' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-white/20 shrink-0"
              style={{ backgroundColor: subject.color || '#6366f1' }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-100 text-lg group-hover:text-indigo-300 transition-colors truncate">
                {subject.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Exam: {new Date(subject.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Days Left Pill */}
        <div className="flex items-center justify-between mt-2 pt-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
              isPast
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : isUrgent
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
            }`}
          >
            {isPast ? (
              <span>Exam Passed</span>
            ) : isUrgent ? (
              <span>⚠️ {days} {days === 1 ? 'day' : 'days'} left (Urgent)</span>
            ) : (
              <span>{days} {days === 1 ? 'day' : 'days'} remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer link CTA */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5 font-medium group-hover:text-slate-200 transition-colors">
          <Layers className="w-4 h-4 text-indigo-400" />
          Manage Syllabus & Topics
        </span>
        <div className="w-7 h-7 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
