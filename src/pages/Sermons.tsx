import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Home, Library, Radio, ArrowLeft, PlayCircle, MoreHorizontal } from 'lucide-react';
import rccgLogo from '@/assets/rccg-logo.png';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';

// Dummy data for scaffolding the design
const CATEGORIES = [
  'Good News', 'Salvation', 'Jesus Love', 'Forgiveness', 'New Life',
  'Hope', 'Grace', 'The Cross', 'Healing', 'Faith', 'Redemption', 'Mercy'
];

const DUMMY_SERMONS = [
  {
    id: 1,
    title: 'Special Miracle Service',
    speaker: 'Fervour',
    date: 'Jul 12th',
    duration: '26Mins 15Secs',
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Mid-Year Thanksgiving',
    speaker: 'Fervour',
    date: 'Jul 5th',
    duration: '42Mins 1Sec',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Hermeneutics: Understanding Bible...',
    speaker: 'Bible Experience',
    date: 'Jun 28th',
    duration: '1Hr 5Mins',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Purpose of the Scriptures',
    speaker: 'Bible Experience',
    date: 'Jun 21st',
    duration: '1Hr 11Mins',
    thumbnail: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'The Origin of the Scriptures',
    speaker: 'Bible Experience',
    date: 'Jun 14th',
    duration: '1Hr 13Mins',
    thumbnail: 'https://images.unsplash.com/photo-1519817914152-2a640f1a5c6d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Look Into The Book Of Ephesians',
    speaker: 'Bible Experience',
    date: 'Jun 10th',
    duration: '1Hr 29Mins',
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'The Pursuit of Purpose',
    speaker: 'Apostle Emmanuel',
    date: 'May 29th',
    duration: '1Hr',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Unstoppable Move of God',
    speaker: 'Apostle Emmanuel',
    date: 'May 22nd',
    duration: '1Hr 1Min',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600&auto=format&fit=crop'
  }
];

export default function Sermons() {
  const [activeCategory, setActiveCategory] = useState('Good News');
  
  // To toggle the coming soon state when you are ready to build further
  const isComingSoon = true;

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden relative font-sans">
      <SEO 
        title="Sermons & Messages" 
        canonicalUrl="/sermons"
        description="Listen to sermons and messages from RCCG Impact House. Grow your faith with teachings from our pastors."
      />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#181818] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <img src={rccgLogo} alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold tracking-wide">SERMONS</h1>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            <NavLink to="/sermons" end className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              isActive ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            )}>
              <Home size={20} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/sermons/series" className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              isActive ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            )}>
              <Library size={20} />
              <span>Series</span>
            </NavLink>
            <NavLink to="/sermons/live" className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              isActive ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            )}>
              <Radio size={20} />
              <span>Live</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        
        {/* Top Header */}
        <header className="px-4 md:px-8 py-6 flex items-center justify-between gap-6">
          {/* Mobile Back Button (Visible only on small screens) */}
          <Link to="/" className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white">
             <ArrowLeft size={20} />
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text"
              placeholder="Search sermons..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center hover:bg-white/10 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* Categories (Horizontal Scroll) */}
        <div className="px-4 md:px-8 pb-4 flex items-center gap-3 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeCategory === category 
                  ? "bg-white text-black border-white" 
                  : "bg-transparent text-white/70 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sermons Grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-12">
          <div className="mb-6 mt-4">
            <h2 className="text-3xl font-bold mb-1">Good Evening</h2>
            <p className="text-white/60 font-medium">Latest Sermons</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {DUMMY_SERMONS.map((sermon) => (
              <div key={sermon.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-white/5">
                  <img 
                    src={sermon.thumbnail} 
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Duration Overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-white/90">
                    {sermon.duration}
                  </div>
                  {/* Play Button Overlay (Hover) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-bold text-white leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{sermon.title}</h3>
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="truncate pr-2">{sermon.speaker}</span>
                    <span className="shrink-0">{sermon.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* COMING SOON OVERLAY */}
      {isComingSoon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="text-center p-8 max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Radio size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">COMING SOON</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              We are currently preparing an amazing library of sermons and teachings. Check back later to experience the word of God.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
            >
              <ArrowLeft size={18} />
              Return to Website
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
