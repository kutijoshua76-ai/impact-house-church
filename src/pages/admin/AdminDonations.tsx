import { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  User, 
  TrendingUp,
  Loader2,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  Trash2
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

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => 
    d.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.amount?.toString().includes(searchTerm)
  );

  const totalAmount = filteredDonations.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDonations(prev => prev.filter(donation => donation.id !== id));
      toast({
        title: "Record Deleted",
        description: "The donation record has been successfully deleted.",
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
    const headers = ['Donor Name', 'Amount (NGN)', 'Type', 'Date'];
    const rows = filteredDonations.map(d => [
      d.donor_name,
      Number(d.amount).toLocaleString(),
      d.type.toUpperCase(),
      format(new Date(d.created_at), 'yyyy-MM-dd')
    ]);
    exportToPDF('Donations & Giving Report', headers, rows, 'donations_report');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Donations & Seeds</h1>
          <p className="text-foreground/40 text-sm">Monitor kingdom investments and giving reports</p>
        </div>
        
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleExportPDF}
            title="Download PDF" 
            className="glassmorphic rounded-2xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10 overflow-x-auto">
            {['all', 'tithe', 'project'].map((tab) => (
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

          <div className="relative group w-full xl:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search donor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all w-full xl:w-48"
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphic-card p-6 border-primary/10 bg-primary/[0.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Total Value</p>
              <h3 className="text-2xl font-serif font-bold text-foreground">₦{totalAmount.toLocaleString()}</h3>
            </div>
          </div>
          <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[70%]" />
          </div>
        </div>

        <div className="glassmorphic-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <HeartHandshake size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Total Reports</p>
              <h3 className="text-2xl font-serif font-bold text-foreground">{filteredDonations.length}</h3>
            </div>
          </div>
        </div>

        <div className="glassmorphic-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Average Seed</p>
              <h3 className="text-2xl font-serif font-bold text-foreground">
                ₦{filteredDonations.length > 0 ? (totalAmount / filteredDonations.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Counting the blessing...</p>
        </div>
      ) : (
        <div className="glassmorphic overflow-hidden rounded-[2rem] border border-foreground/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
              <tr className="bg-foreground/[0.02] border-b border-foreground/5">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Donor Name</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Amount</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Type</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length > 0 ? filteredDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-foreground/5 hover:bg-foreground/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/30 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-bold text-foreground/80">{donation.donor_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-serif font-bold text-primary">₦{Number(donation.amount).toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      donation.type === 'tithe' ? "bg-amber-400/10 text-amber-400" : "bg-purple-500/10 text-purple-400"
                    )}>
                      {donation.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-foreground/30 text-xs">
                      <Calendar size={12} />
                      {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button title="Delete record" className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glassmorphic border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-foreground/60">
                            This will permanently delete the donation record for <strong className="text-foreground">{donation.donor_name}</strong> (₦{Number(donation.amount).toLocaleString()}). This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(donation.id)} 
                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center italic text-foreground/20 text-sm">No donation records found.</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
