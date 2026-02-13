import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Shield, Layout } from 'lucide-react';
import Button from '../components/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              TF
            </div>
            <span className="text-xl font-bold text-slate-900">TaskFlow</span>
        </div>
        <div className="flex gap-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
             <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Manage tasks with <span className="text-blue-600">clarity</span>.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          TaskFlow is the distraction-free workspace for professionals and teams to organize, prioritize, and get things done.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">Start for Free</Button>
          </Link>
          <Link to="/signin">
             <Button variant="secondary" size="lg" className="w-full sm:w-auto">Live Demo</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Priority Focus</h3>
              <p className="text-slate-600">Sort tasks by urgency with our intuitive color-coded priority system.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Categories</h3>
              <p className="text-slate-600">Organize your life into Work, Personal, and custom categories.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Simple</h3>
              <p className="text-slate-600">Your data is safe, and our interface is designed to keep you focused.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2026 TaskFlow Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
