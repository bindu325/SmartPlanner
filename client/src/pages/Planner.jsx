import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar as CalendarIcon,
  Layers,
  BrainCircuit,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { getPlans, getSubjects, updateTaskStatus, rescheduleTask, generatePlan } from '../services/api';
import TaskCard from '../components/TaskCard';
import PlanGeneratorModal from '../components/PlanGeneratorModal';
import { formatDate, formatDisplayDate } from '../utils/helpers';

const Planner = () => {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reschedulingMessage, setReschedulingMessage] = useState(null);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const [plansRes, subjectsRes] = await Promise.all([
        getPlans({
          subjectId: selectedSubject || undefined,
          status: selectedStatus || undefined,
        }),
        getSubjects(),
      ]);

      setPlans(plansRes.data.data);
      setSubjects(subjectsRes.data.data);
    } catch (err) {
      console.error('Failed to load study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedSubject, selectedStatus]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      fetchPlans();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleReschedule = async (taskId) => {
    try {
      const res = await rescheduleTask({ taskId });
      setReschedulingMessage(
        `Schedule Updated! Missed task has been reallocated to ${res.data.data.rescheduledTask.date} without exceeding your daily study limit.`
      );
      setTimeout(() => setReschedulingMessage(null), 7000);
      fetchPlans();
    } catch (err) {
      alert('Failed to reschedule task');
    }
  };

  const handleGeneratePlan = async (config) => {
    try {
      setGenerating(true);
      await generatePlan(config);
      setIsGenModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  // Group plans by date
  const groupedPlans = plans.reduce((acc, task) => {
    const d = task.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(task);
    return acc;
  }, {});

  const datesSorted = Object.keys(groupedPlans).sort();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Reschedule Alert Notification */}
      {reschedulingMessage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/40 text-indigo-200 text-sm flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold">{reschedulingMessage}</span>
          </div>
          <button
            onClick={() => setReschedulingMessage(null)}
            className="text-xs text-indigo-300 hover:text-white font-bold px-2 py-1 bg-white/[0.06] rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121829] border border-white/[0.08] p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            Deterministic Scheduling Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your schedule adapts dynamically as you complete or reschedule sessions
          </p>
        </div>

        <button
          onClick={() => setIsGenModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition shrink-0 relative z-10"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Regenerate Schedule</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3 flex-wrap bg-[#121829] border border-white/[0.08] p-3.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 pl-2">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filter Plans:</span>
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending Tasks</option>
          <option value="COMPLETED">Completed Tasks</option>
          <option value="MISSED">Missed Tasks</option>
        </select>

        {(selectedSubject || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedSubject('');
              setSelectedStatus('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold ml-auto pr-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Plans Timeline by Date */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-[#121829] border border-white/[0.06] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : datesSorted.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-3xl bg-[#121829]/50">
          <CalendarDays className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No scheduled study sessions</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5 mb-5 leading-relaxed">
            Generate an automated study plan to distribute your syllabus topics across upcoming days.
          </p>
          <button
            onClick={() => setIsGenModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            Generate Study Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {datesSorted.map((dateStr) => {
            const dayTasks = groupedPlans[dateStr];
            const isToday = dateStr === formatDate(new Date());
            const totalDayMinutes = dayTasks.reduce((s, t) => s + (t.plannedMinutes || 0), 0);

            return (
              <div key={dateStr} className="space-y-3.5">
                {/* Date Group Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        isToday
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-white/[0.04] text-slate-200 border border-white/[0.08]'
                      }`}
                    >
                      {isToday ? 'Today' : formatDisplayDate(dateStr)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ({dateStr})
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {dayTasks.length} sessions • {(totalDayMinutes / 60).toFixed(1)} hrs total
                  </span>
                </div>

                {/* Day Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onReschedule={handleReschedule}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generator Modal */}
      <PlanGeneratorModal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        onGenerate={handleGeneratePlan}
        isGenerating={generating}
      />
    </div>
  );
};

export default Planner;
