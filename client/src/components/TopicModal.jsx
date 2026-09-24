import React, { useState } from 'react';
import { X } from 'lucide-react';

const TopicModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initialData?.estimatedMinutes || 60
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !estimatedMinutes) return;
    onSubmit({
      name,
      difficulty,
      estimatedMinutes: Number(estimatedMinutes),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-100 mb-4">
          {initialData ? 'Edit Topic' : 'Add New Topic'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Topic Name / Chapter
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Memory Management, Integration By Parts"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition ${
                    difficulty === lvl
                      ? lvl === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : lvl === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Estimated Study Time (Minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="15"
                step="15"
                required
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
              <span className="text-sm font-semibold text-slate-400">
                {(estimatedMinutes / 60).toFixed(1)} hrs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Recommended: 45 to 180 minutes per topic chunk.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
            >
              {initialData ? 'Update Topic' : 'Add Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicModal;
