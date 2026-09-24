import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Layers,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import {
  getSubjectById,
  updateSubject,
  deleteSubject,
  createTopic,
  updateTopic,
  deleteTopic
} from '../services/api';
import { getDaysRemaining, difficultyColors } from '../utils/helpers';
import TopicModal from '../components/TopicModal';
import SubjectModal from '../components/SubjectModal';

const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getSubjectById(id);
      setSubject(res.data.data);
    } catch (err) {
      console.error('Failed to load subject details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDeleteSubject = async () => {
    if (window.confirm('Are you sure you want to delete this subject and all its topics and study plans?')) {
      try {
        await deleteSubject(id);
        navigate('/subjects');
      } catch (err) {
        alert('Failed to delete subject');
      }
    }
  };

  const handleUpdateSubject = async (formData) => {
    try {
      await updateSubject(id, formData);
      fetchDetails();
    } catch (err) {
      alert('Failed to update subject');
    }
  };

  const handleCreateOrUpdateTopic = async (topicData) => {
    try {
      if (editingTopic) {
        await updateTopic(editingTopic._id, topicData);
      } else {
        await createTopic(id, topicData);
      }
      setEditingTopic(null);
      fetchDetails();
    } catch (err) {
      alert('Failed to save topic');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Delete this topic and all related study tasks?')) {
      try {
        await deleteTopic(topicId);
        fetchDetails();
      } catch (err) {
        alert('Failed to delete topic');
      }
    }
  };

  const handleToggleTopicStatus = async (topic) => {
    const nextStatus = topic.completionStatus === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await updateTopic(topic._id, { completionStatus: nextStatus });
      fetchDetails();
    } catch (err) {
      alert('Failed to update topic status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-[#121829] rounded-xl" />
        <div className="h-44 bg-[#121829] border border-white/[0.06] rounded-3xl" />
        <div className="h-64 bg-[#121829] border border-white/[0.06] rounded-3xl" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-[#121829] rounded-3xl border border-white/[0.08]">
        Subject not found.
      </div>
    );
  }

  const days = getDaysRemaining(subject.examDate);
  const totalMinutes = (subject.topics || []).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedTopics = (subject.topics || []).filter((t) => t.completionStatus === 'COMPLETED').length;
  const totalTopics = (subject.topics || []).length;
  const progressPercent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/subjects')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Subjects
      </button>

      {/* Subject Header Banner */}
      <div className="bg-[#121829] border border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: subject.color || '#6366f1' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: subject.color }}
              />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {subject.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap pt-1">
              <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1 rounded-xl border border-white/[0.06]">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Exam: {new Date(subject.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>

              <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1 rounded-xl border border-white/[0.06]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {(totalMinutes / 60).toFixed(1)} hrs total syllabus
              </span>

              <span
                className={`px-3 py-1 rounded-xl font-bold border ${
                  days <= 7
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                    : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {days >= 0 ? `${days} Days Remaining` : 'Exam Passed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditSubModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs border border-white/[0.08] flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Subject
            </button>
            <button
              onClick={handleDeleteSubject}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/20 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* Progress Bar in Header */}
        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Syllabus Completion</span>
            <span className="font-bold text-white">{progressPercent}% ({completedTopics}/{totalTopics} topics)</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: subject.color || '#6366f1',
              }}
            />
          </div>
        </div>
      </div>

      {/* Syllabus Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Syllabus Topics & Chapters
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Break down subject curriculum into manageable difficulty-weighted topics
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTopic(null);
              setIsTopicModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Topic
          </button>
        </div>

        {/* Topics List Table/Cards */}
        {(subject.topics || []).length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-3xl bg-[#121829]/50">
            <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No topics added yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Add your syllabus chapters to allow the scheduler to generate structured Learn, Practice, and Revision sessions.
            </p>
            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Add First Topic
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subject.topics.map((topic) => {
              const isCompleted = topic.completionStatus === 'COMPLETED';

              return (
                <div
                  key={topic._id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-900/40 border-white/[0.05] opacity-80'
                      : 'bg-[#121829] border-white/[0.08] hover:border-indigo-500/40 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTopicStatus(topic)}
                        className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
                        title="Toggle topic completion"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              difficultyColors[topic.difficulty]
                            }`}
                          >
                            {topic.difficulty}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {topic.estimatedMinutes} mins
                          </span>
                        </div>

                        <h4
                          className={`text-sm font-bold truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {topic.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTopic(topic);
                          setIsTopicModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition"
                        title="Edit Topic"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Delete Topic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topic Modal */}
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={handleCreateOrUpdateTopic}
        initialData={editingTopic}
      />

      {/* Edit Subject Modal */}
      <SubjectModal
        isOpen={isEditSubModalOpen}
        onClose={() => setIsEditSubModalOpen(false)}
        onSubmit={handleUpdateSubject}
        initialData={subject}
      />
    </div>
  );
};

export default SubjectDetails;
