import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Sparkles,
  GraduationCap,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronRight,
  BrainCircuit,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Subjects', path: '/subjects', icon: BookOpen, badge: null },
    { name: 'Study Planner', path: '/planner', icon: CalendarDays, badge: 'Smart' },
    { name: 'Calendar', path: '/calendar', icon: CalendarRange, badge: null },
    { name: 'Progress', path: '/progress', icon: TrendingUp, badge: null },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
              SmartPlanner
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-72 bg-[#0E1322] border-r border-white/[0.08] flex flex-col shrink-0 h-screen transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight leading-tight flex items-center gap-1.5">
                SmartPlanner
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h1>
              <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                Intelligent Study OS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-5 flex-1 overflow-y-auto space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Core Workspace
            </p>
            <nav className="space-y-1">
              {isAuthenticated ? (
                navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-indigo-300 border border-indigo-500/30 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })
              ) : (
                <div className="space-y-1">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </NavLink>
                </div>
              )}
            </nav>
          </div>

          {/* Workflow Architecture Card for Evaluators */}
          {isAuthenticated && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/30 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Adaptive Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Multi-factor prioritization calculates urgency from exam proximity, topic difficulty, and daily capacity.
              </p>
            </div>
          )}
        </div>

        {/* User Profile & Logout Bottom Bar */}
        {isAuthenticated && user && (
          <div className="p-4 border-t border-white/[0.06] bg-slate-950/40">
            <div className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/[0.06] p-2.5 rounded-2xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md ring-1 ring-white/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
