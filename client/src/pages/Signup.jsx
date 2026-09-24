import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, GraduationCap, ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Unable to create account. Please try again or use another email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#121829] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side: SaaS Product Showcase */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1A2238] via-[#121829] to-[#1F193C] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-white tracking-tight leading-tight flex items-center gap-1.5">
                  SmartPlanner
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h1>
                <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                  Academic Intelligence OS
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Create your study workspace
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal pt-1">
                Build a personalized, adaptive study plan for every exam and track your syllabus readiness.
              </p>
            </div>
          </div>

          <div className="relative z-10 my-8 space-y-2.5 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>What You Get:</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated, secure personal workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated daily task capacity enforcement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adaptive rescheduling for missed study tasks</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 relative z-10">
            © 2026 Smart Study Planner. All rights reserved.
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center relative bg-[#121829]">
          <div className="max-w-md mx-auto w-full space-y-5">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Get Started Free 🚀
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Set up your academic profile in under a minute
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="font-semibold">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Himabindu Gade"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2 transition duration-200 group mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Study Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3.5 border-t border-white/[0.06] text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
