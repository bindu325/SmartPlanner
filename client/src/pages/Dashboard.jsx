import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Plus,
  BrainCircuit,
  Award,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';
import { getProgress, getPlanByDate, getSubjects, updateTaskStatus, rescheduleTask, generatePlan } from '../services/api';
import { formatDate, formatDisplayDate, getDaysRemaining } from '../utils/helpers';
import TaskCard from '../components/TaskCard';
import PlanGeneratorModal from '../components/PlanGeneratorModal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reschedulingMessage, setReschedulingMessage] = useState(null);

  const todayStr = formatDate(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [progressRes, todayRes, subjectsRes] = await Promise.all([
        getProgress(),
        getPlanByDate(todayStr),
        getSubjects(),
      ]);

      setStats(progressRes.data.data);
      setTodayTasks(todayRes.data.data);
      setSubjects(subjectsRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleReschedule = async (taskId) => {
    try {
      const res = await rescheduleTask({ taskId });
      setReschedulingMessage(
        `Schedule Updated! Missed task has been reallocated to ${res.data.data.rescheduledTask.date} without exceeding your daily capacity.`
      );
      setTimeout(() => setReschedulingMessage(null), 7000);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to reschedule:', err);
    }
  };

  const handleGeneratePlan = async (config) => {
    try {
      setGenerating(true);
      await generatePlan(config);
      setIsGenModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate study plan');
    } finally {
      setGenerating(false);
    }
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 bg-[#121829] border border-white/[0.06] rounded-3xl" />
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-[#121829] border border-white/[0.06] rounded-2xl" />
          ))}
        </div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-72 bg-[#121829] border border-white/[0.06] rounded-3xl" />
          <div className="h-72 bg-[#121829] border border-white/[0.06] rounded-3xl" />
        </div>
      </div>
    );
  }

  // Upcoming Exams calculations
  const upcomingExams = [...subjects]
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .filter((s) => getDaysRemaining(s.examDate) >= 0);

  const nearestExam = upcomingExams[0];

  // Today study calculations from real data
  const todayPlannedMinutes = todayTasks.reduce((s, t) => s + (t.plannedMinutes || 0), 0);
  const todayCompletedMinutes = todayTasks
    .filter((t) => t.status === 'COMPLETED')
    .reduce((s, t) => s + (t.completedMinutes || t.plannedMinutes || 0), 0);
  const todayProgressPercent =
    todayPlannedMinutes === 0 ? 0 : Math.round((todayCompletedMinutes / todayPlannedMinutes) * 100);

  const pendingCount = todayTasks.filter((t) => t.status === 'PENDING').length;
  const completedCount = todayTasks.filter((t) => t.status === 'COMPLETED').length;
  const missedCount = todayTasks.filter((t) => t.status === 'MISSED').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Reschedule Toast / Alert Banner */}
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

      {/* Top Banner / SaaS Greeting */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#13192B] via-[#0E1528] to-[#1E1938] border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Intelligent Academic Planning Engine
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name ? user.name.split(' ')[0] : 'Scholar'} 👋
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {todayTasks.length > 0
                ? `You have ${pendingCount} study tasks planned for today (${(todayPlannedMinutes / 60).toFixed(1)}h total). Let's make continuous progress!`
                : 'No study sessions scheduled for today. Generate your adaptive schedule or review past milestones.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsGenModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate / Update Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Today's Study */}
        <div className="bg-[#121829] border border-white/[0.08] hover:border-indigo-500/30 p-5 sm:p-6 rounded-3xl transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Today's Study</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {(todayPlannedMinutes / 60).toFixed(1)}h
          </div>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <span>{todayTasks.length} sessions queued</span>
          </p>
        </div>

        {/* Metric 2: Completed Hours */}
        <div className="bg-[#121829] border border-white/[0.08] hover:border-emerald-500/30 p-5 sm:p-6 rounded-3xl transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {(todayCompletedMinutes / 60).toFixed(1)}h
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {todayProgressPercent}% of today's target
          </p>
        </div>

        {/* Metric 3: Remaining Tasks */}
        <div className="bg-[#121829] border border-white/[0.08] hover:border-amber-500/30 p-5 sm:p-6 rounded-3xl transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Tasks Remaining</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {pendingCount}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {stats?.remainingTopics || 0} syllabus topics left
          </p>
        </div>

        {/* Metric 4: Total Syllabus Mastery */}
        <div className="bg-[#121829] border border-white/[0.08] hover:border-violet-500/30 p-5 sm:p-6 rounded-3xl transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Syllabus Mastered</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-violet-400 tracking-tight">
            {stats?.overallPercentage || 0}%
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {stats?.completedTopics || 0} of {stats?.totalTopics || 0} topics done
          </p>
        </div>
      </div>

      {/* Dynamic Study Insights Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#121829] to-slate-900 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Study Insights & Exam Urgency
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.05]">
            <p className="font-semibold text-white mb-1">📅 Exam Proximity</p>
            {nearestExam ? (
              <p className="text-slate-400">
                Your <span className="text-indigo-300 font-bold">{nearestExam.name}</span> exam is in{' '}
                <span className="text-rose-400 font-bold">{getDaysRemaining(nearestExam.examDate)} days</span>.
              </p>
            ) : (
              <p className="text-slate-400">No exams registered yet. Add subjects to calculate urgency.</p>
            )}
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.05]">
            <p className="font-semibold text-white mb-1">🎯 Topic Distribution</p>
            <p className="text-slate-400">
              Total {stats?.totalTopics || 0} topics prioritized with difficulty weighting (Hard topics weighted 3x).
            </p>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.05]">
            <p className="font-semibold text-white mb-1">⚡ Workload Balance</p>
            <p className="text-slate-400">
              {stats?.missedTasks > 0
                ? `${stats.missedTasks} missed session(s) can be automatically reallocated.`
                : 'All study slots on schedule with no pending missed tasks.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Timeline (2 Cols) & Urgent Exam + Subjects (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Today's Study Schedule
                </h2>
                <p className="text-xs text-slate-400">{formatDisplayDate(new Date())}</p>
              </div>
            </div>

            <Link
              to="/planner"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition hover:underline"
            >
              Full Timeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="p-10 rounded-3xl border border-dashed border-white/[0.1] bg-[#121829]/60 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="font-bold text-slate-200 text-base">No tasks planned for today</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed">
                Generate an automated study schedule based on your subjects, exam dates, and daily study capacity.
              </p>
              <button
                onClick={() => setIsGenModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/25 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate Study Schedule
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onReschedule={handleReschedule}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Upcoming Exams & Subjects Workspace */}
        <div className="space-y-6">
          {/* Nearest Exam Card */}
          {nearestExam && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-[#121829] to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                <Flame className="w-4 h-4 animate-bounce" />
                Urgent Upcoming Exam
              </div>

              <h3 className="text-xl font-extrabold text-white mb-1">{nearestExam.name}</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(nearestExam.examDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <div>
                  <div className="text-3xl font-black text-rose-400 tracking-tight">
                    {getDaysRemaining(nearestExam.examDate)}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Days Remaining
                  </div>
                </div>

                <Link
                  to={`/subjects/${nearestExam._id}`}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-indigo-600 text-xs font-bold text-white border border-white/[0.08] transition flex items-center gap-1.5"
                >
                  View Topics <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Subjects Quick Access */}
          <div className="bg-[#121829] border border-white/[0.08] p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
                Subjects ({subjects.length})
              </h3>
              <Link
                to="/subjects"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
              >
                Manage
              </Link>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 mb-3.5">No registered subjects.</p>
                <Link
                  to="/subjects"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition"
                >
                  <Plus className="w-4 h-4" /> Add First Subject
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {subjects.slice(0, 5).map((sub) => {
                  const days = getDaysRemaining(sub.examDate);
                  return (
                    <Link
                      key={sub._id}
                      to={`/subjects/${sub._id}`}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                          {sub.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        {days >= 0 ? `${days}d left` : 'Passed'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Generator Modal */}
      <PlanGeneratorModal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        onGenerate={handleGeneratePlan}
        isGenerating={generating}
      />
    </div>
  );
};

export default Dashboard;
