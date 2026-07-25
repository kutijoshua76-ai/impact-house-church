import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Share2,
  MoreHorizontal,
  Loader2,
  Quote,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { exportToPDF } from '@/lib/pdf-export';

export default function AdminTestimonies() {
  const [filter, setFilter] = useState('all');
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonies();
  }, [filter]);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('testimonies')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTestimonies(data || []);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('testimonies')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Testimony ${newStatus}`,
        description: `The testimony status has been updated to ${newStatus}.`,
      });

      fetchTestimonies();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    }
  };

  const handleExportPDF = () => {
    const headers = ['Name', 'Title', 'Content', 'Status', 'Date'];
    const rows = testimonies.map(t => [
      t.full_name,
      t.title || 'Personal Story',
      t.content,
      t.status.toUpperCase(),
      format(new Date(t.created_at), 'yyyy-MM-dd')
    ]);
    exportToPDF('Testimonies Report', headers, rows, 'testimonies_report');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Testimonies</h1>
          <p className="text-foreground/40 text-sm">Review and approve testimonies for the public wall</p>
        </div>
        
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleExportPDF}
            title="Download PDF" 
            className="glassmorphic rounded-2xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10 shrink-0"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10 overflow-x-auto">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  filter === tab ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40 hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/20 italic">Sifting through wonders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.length > 0 ? testimonies.map((testimony) => (
            <div key={testimony.id} className="glassmorphic-card flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="text-primary" />
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-primary/20 border border-foreground/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground truncate max-w-[120px]">{testimony.full_name}</p>
                    <p className="text-[10px] text-foreground/30 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(testimony.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <button title="More options" className="p-2 hover:bg-foreground/10 rounded-xl text-foreground/30 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex-1 mb-8 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-[0.2em]">
                    {testimony.title || 'Personal Story'}
                  </span>
                  <span className={cn(
                    "text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md",
                    testimony.status === 'pending' ? "text-amber-400 bg-amber-400/10" :
                    testimony.status === 'approved' ? "text-green-400 bg-green-400/10" :
                    "text-rose-400 bg-rose-400/10"
                  )}>
                    {testimony.status}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed italic line-clamp-4">
                  "{testimony.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-foreground/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  {testimony.status !== 'approved' && (
                    <button 
                      onClick={() => updateStatus(testimony.id, 'approved')}
                      title="Approve testimony" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400/10 text-green-400 text-[10px] font-bold uppercase tracking-widest hover:bg-green-400/20 transition-all"
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                  )}
                  {testimony.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(testimony.id, 'rejected')}
                      title="Reject testimony" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 text-foreground/40 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  )}
                </div>
                <button title="Share testimony" className="p-2 text-foreground/20 hover:text-primary transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center glassmorphic rounded-[2rem]">
              <p className="text-foreground/20 italic font-serif text-xl tracking-wide">No testimonies found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
