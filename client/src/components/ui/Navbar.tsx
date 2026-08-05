import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, LayoutDashboard, Tractor, Sparkles, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-[#070D09]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#09150d] rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5">
                AgriWise <span className="gradient-text">AI</span>
              </span>
              <span className="block text-[10px] font-mono text-emerald-400/60 uppercase tracking-widest -mt-1">
                Precision Agronomy
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              
              <Link
                to="/farms"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/farms')
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Tractor className="w-4 h-4" />
                Farm Profiles
              </Link>

              <Link
                to="/advisory/new"
                className="flex items-center gap-2 px-4 py-2 ml-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Generate Advisory
              </Link>
            </div>
          )}

          {/* User Profile & Demo Badge */}
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                Demo Mode
              </span>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-200">{user.name || user.email}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</span>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-brand-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
