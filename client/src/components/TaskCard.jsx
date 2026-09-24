import React from 'react';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { difficultyColors, taskTypeColors, statusColors } from '../utils/helpers';

const TaskCard = ({ task, onStatusChange, onReschedule }) => {
  const isCompleted = task.status === 'COMPLETED';
  const isMissed = task.status === 'MISSED';
  const isPending = task.status === 'PENDING';

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-900/30 border-white/[0.05] opacity-75'
          : isMissed
          ? 'bg-rose-950/20 border-rose-500/30 shadow-lg shadow-rose-950/20'
          : 'bg-[#121829] border-white/[0.07] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5'
      }`}
    >
      {/* Top Left Accent Glow if Missed or Pending */}
      {isMissed && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3 relative z-10">
        {/* Checkbox & Topic Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            onClick={() => onStatusChange(task._id, isCompleted ? 'PENDING' : 'COMPLETED')}
            className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none shrink-0"
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400 transition-colors" />
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            {/* Meta Tags Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: task.subjectId?.color || '#6366f1' }}
              />
              <span className="text-xs font-bold text-slate-300 truncate">
                {task.subjectId?.name || 'Subject'}
              </span>

              {/* Task Type Badge */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  taskTypeColors[task.taskType] || 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                }`}
              >
                {task.taskType}
              </span>

              {/* Difficulty Badge */}
              {task.topicId?.difficulty && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    difficultyColors[task.topicId.difficulty]
                  }`}
                >
                  {task.topicId.difficulty}
                </span>
              )}
            </div>

            {/* Topic Name */}
            <h4
              className={`text-sm font-bold tracking-tight transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400'
                  : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {task.topicId?.name || 'Topic Study Session'}
            </h4>

            {/* Sub-notes / learning direction */}
            {task.notes && (
              <p className="text-xs text-slate-400 line-clamp-1 italic font-normal">
                {task.notes}
              </p>
            )}
          </div>
        </div>

        {/* Duration & Status */}
        <div className="flex flex-col items-end gap-2 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{task.plannedMinutes} min</span>
          </div>

          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md border ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs relative z-10">
        <span className="text-slate-400 text-[11px] font-medium">
          Scheduled: <span className="text-slate-200 font-semibold">{task.date}</span>
        </span>

        <div className="flex items-center gap-2">
          {isPending && (
            <button
              onClick={() => onStatusChange(task._id, 'MISSED')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold hover:underline flex items-center gap-1 transition"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Mark Missed
            </button>
          )}

          {isMissed && onReschedule && (
            <button
              onClick={() => onReschedule(task._id)}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              Auto-Reschedule Slot
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
