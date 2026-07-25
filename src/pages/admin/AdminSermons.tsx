import { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Search, 
  Upload, 
  Video, 
  Calendar,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSermons() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // This state toggle controls the coming soon overlay
  const isComingSoon = true;

  return (
    <div className="relative min-h-[80vh]">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Sermons Management</h1>
          <p className="text-foreground/60">Upload and manage church sermons, series, and teachings.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <Plus size={20} />
          Upload Sermon
        </button>
      </div>

      {/* Main Content Area */}
      <div className="glassmorphic-card p-6">
        
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-foreground/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text"
              placeholder="Search sermons by title or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50">
              <option value="all">All Categories</option>
              <option value="good-news">Good News</option>
              <option value="faith">Faith</option>
            </select>
          </div>
        </div>

        {/* Empty State / Table Placeholder */}
        <div className="text-center py-20 px-4">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Video size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Sermons Yet</h3>
          <p className="text-foreground/50 max-w-md mx-auto mb-8">
            Get started by uploading your first sermon. You can add video links, cover images, and organize them into series.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/5 border border-foreground/10 font-bold rounded-xl hover:bg-foreground/10 transition-colors">
            <Upload size={18} />
            Upload First Sermon
          </button>
        </div>

      </div>

      {/* COMING SOON OVERLAY */}
      {isComingSoon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md rounded-3xl">
          <div className="text-center p-8 max-w-md animate-fade-in glassmorphic-card shadow-2xl border-primary/20">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lock size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black mb-3">Feature Coming Soon</h2>
            <p className="text-foreground/70 mb-8">
              The sermon management dashboard is currently under construction. You'll soon be able to upload, organize, and publish sermons directly to the app.
            </p>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
