import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { exportToPDF } from '@/lib/pdf-export';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminFirstTimers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [firstTimers, setFirstTimers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFirstTimers();
  }, []);

  const fetchFirstTimers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('first_timers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFirstTimers(data || []);
    } catch (error) {
      console.error('Error fetching first timers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = firstTimers.filter(member => 
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.campus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('first_timers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFirstTimers(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Record Deleted",
        description: "The first timer record has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message || "Failed to delete the record.",
      });
    }
  };

  const handleExportPDF = () => {
    const headers = ['Name', 'Email', 'Phone', 'Campus', 'Address', 'Invited By', 'Date'];
    const rows = filteredMembers.map(m => [
      m.full_name,
      m.email,
      m.phone || 'N/A',
      m.campus || 'N/A',
      `${m.street_address || ''}, ${m.state || ''}`,
      m.invited_by || 'N/A',
      format(new Date(m.created_at), 'yyyy-MM-dd')
    ]);
    exportToPDF('First Timers Report', headers, rows, 'first_timers_report');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">First <span className="text-rose-gradient">Timers</span></h1>
          <p className="text-foreground/40 text-sm">Manage and follow up with new family members</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or campus..." 
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportPDF}
              title="Download PDF" 
              className="glassmorphic rounded-2xl px-4 py-3 flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button onClick={fetchFirstTimers} title="Refresh" className="glassmorphic rounded-2xl px-4 py-3 flex items-center gap-2 hover:bg-foreground/10 transition-colors">
              <span className="text-sm font-medium text-foreground">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="glassmorphic rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Loading Kingdom Records...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Member Details</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Campus & Invited By</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Registration Date</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-foreground/[0.03] transition-colors group text-foreground">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-0.5">{member.full_name}</p>
                          <p className="text-[10px] text-white/30 flex items-center gap-2">
                            <Mail size={10} /> {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium mb-0.5">{member.campus || 'Not specified'}</p>
                      <p className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">By: {member.invited_by || 'Unknown'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-foreground/50 text-sm">
                        <Calendar size={14} />
                        {format(new Date(member.created_at), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button title="View Details" className="p-2 hover:bg-primary/10 rounded-lg text-primary/50 hover:text-primary transition-colors">
                              <Eye size={18} />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="glassmorphic border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-serif text-2xl">First Timer Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 text-sm text-left">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Full Name</p>
                                  <p className="font-medium text-foreground">{member.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Email</p>
                                  <p className="font-medium text-foreground">{member.email}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Phone</p>
                                  <p className="font-medium text-foreground">{member.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Gender</p>
                                  <p className="font-medium text-foreground capitalize">{member.gender || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Birthday</p>
                                  <p className="font-medium text-foreground">{member.birthday ? format(new Date(member.birthday), 'MMM dd, yyyy') : 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Preferred Call Time</p>
                                  <p className="font-medium text-foreground capitalize">{member.preferred_call_time || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Campus</p>
                                  <p className="font-medium text-foreground">{member.campus || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Invited By</p>
                                  <p className="font-medium text-foreground">{member.invited_by || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Address</p>
                                  <p className="font-medium text-foreground">{[member.street_address, member.state, member.country].filter(Boolean).join(', ') || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mb-1">Prayer Request</p>
                                  <p className="font-medium bg-foreground/5 p-4 rounded-xl border border-foreground/10 whitespace-pre-wrap text-foreground">{member.prayer_request || 'None'}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {member.phone && (
                          <a href={`tel:${member.phone}`} title="Call member" className="p-2 hover:bg-foreground/10 rounded-lg text-foreground/30 hover:text-foreground transition-colors">
                            <Phone size={18} />
                          </a>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button title="Delete member" className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glassmorphic border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-foreground/60">
                                This will permanently delete the record for <strong className="text-foreground">{member.full_name}</strong>. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(member.id)} 
                                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-foreground/20 italic font-serif text-lg">
                      No first timers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
