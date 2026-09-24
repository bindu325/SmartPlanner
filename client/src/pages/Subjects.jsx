import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { getSubjects, createSubject } from '../services/api';
import SubjectCard from '../components/SubjectCard';
import SubjectModal from '../components/SubjectModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      setSubjects(res.data.data);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (formData) => {
    try {
      await createSubject(formData);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create subject');
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121829] border border-white/[0.08] p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" /> Academic Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Subjects & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Organize your courses, exam milestones, and syllabus topics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center bg-[#121829] border border-white/[0.08] rounded-2xl px-4 py-3 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter subjects by name..."
          className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {/* Subject Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-[#121829] border border-white/[0.06] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-3xl bg-[#121829]/50">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto mb-3.5">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No subjects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5 mb-5 leading-relaxed">
            {search
              ? 'No courses match your search criteria. Try a different query.'
              : 'Add your first subject and exam date to begin structuring your personalized schedule.'}
          </p>
          {!search && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              Add Subject Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <SubjectCard key={sub._id} subject={sub} />
          ))}
        </div>
      )}

      {/* Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
};

export default Subjects;
