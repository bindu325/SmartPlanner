export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDaysRemaining = (examDate) => {
  if (!examDate) return 0;
  const exam = new Date(examDate);
  const today = new Date();
  exam.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const difficultyColors = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const taskTypeColors = {
  LEARN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PRACTICE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  REVISION: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const statusColors = {
  PENDING: 'bg-slate-700/50 text-slate-300 border-slate-600',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  MISSED: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
};
