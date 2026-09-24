import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getPlans, updateTaskStatus, rescheduleTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import { formatDate } from '../utils/helpers';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthPlans = async () => {
    try {
      setLoading(true);
      const res = await getPlans();
      setPlans(res.data.data);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthPlans();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      fetchMonthPlans();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleReschedule = async (taskId) => {
    try {
      await rescheduleTask({ taskId });
      fetchMonthPlans();
    } catch (err) {
      alert('Failed to reschedule task');
    }
  };

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sun
  const totalDays = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map plans by date
  const tasksByDate = plans.reduce((acc, p) => {
    if (!acc[p.date]) acc[p.date] = [];
    acc[p.date].push(p);
    return acc;
  }, {});

  const selectedDateTasks = tasksByDate[selectedDate] || [];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#121829] border border-white/[0.08] p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarRange className="w-3.5 h-3.5" /> Interactive Calendar
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Study Calendar & Workload Distribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Navigate through upcoming months and inspect daily study allocations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid (7 cols on large) */}
        <div className="lg:col-span-7 bg-[#121829] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              {monthName} {year}
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  setSelectedDate(formatDate(today));
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-slate-300 transition"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: startingDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 md:h-24 rounded-2xl bg-white/[0.01] opacity-20" />
            ))}

            {/* Days of month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNumber = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNumber
              ).padStart(2, '0')}`;

              const dayTasks = tasksByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const isToday = formatDate(new Date()) === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 md:h-24 p-2.5 rounded-2xl border text-left transition flex flex-col justify-between relative overflow-hidden active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : isSelected
                          ? 'text-indigo-400 font-black'
                          : 'text-slate-300'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Mini Indicators */}
                  <div className="flex items-center gap-1 flex-wrap mt-auto">
                    {dayTasks.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.subjectId?.color || '#6366f1' }}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks Pane (5 cols on large) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121829] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {selectedDate === formatDate(new Date()) ? "Today's Schedule" : `Date: ${selectedDate}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDateTasks.length} study tasks scheduled
                </p>
              </div>

              {selectedDateTasks.length > 0 && (
                <div className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {(
                    selectedDateTasks.reduce((s, t) => s + (t.plannedMinutes || 0), 0) / 60
                  ).toFixed(1)}{' '}
                  hrs
                </div>
              )}
            </div>

            {selectedDateTasks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
                <CalendarRange className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-300">
                  No tasks on this date
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click another date or generate a study plan to distribute study sessions.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {selectedDateTasks.map((task) => (
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
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
