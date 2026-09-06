import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Loader2, 
  Download, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  User,
  Users,
  MapPin,
  X
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
} from "@/components/ui/dialog";

export default function AdminFirstTimers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [firstTimers, setFirstTimers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
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

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('first_timers')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Optimistically update list
      setFirstTimers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );

      // Also update currently viewed modal if open
      if (selectedMember?.id === id) {
        setSelectedMember((prev: any) => (prev ? { ...prev, status: newStatus } : null));
      }

      const statusLabels = {
        approved: "First Timer Welcomed & Approved",
        rejected: "Record Rejected / Archived",
        pending: "Moved to Pending Review",
      };

      toast({
        title: statusLabels[newStatus],
        description: `Status has been successfully updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: error.message || "Failed to update record status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMembers = firstTimers.filter((member) => {
    const matchSearch =
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.campus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm);
    const currentStatus = member.status || 'pending';
    const matchStatus = statusFilter === 'all' || currentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('first_timers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFirstTimers((prev) => prev.filter((member) => member.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
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
    const headers = ['Name', 'Email', 'Phone', 'Campus', 'Status', 'Address', 'Invited By', 'Date'];
    const rows = filteredMembers.map((m) => [
      m.full_name,
      m.email,
      m.phone || 'N/A',
      m.campus || 'N/A',
      (m.status || 'pending').toUpperCase(),
      `${m.street_address || ''}, ${m.state || ''}`,
      m.invited_by || 'N/A',
      format(new Date(m.created_at), 'yyyy-MM-dd')
    ]);
    exportToPDF('First Timers Report', headers, rows, 'first_timers_report');
  };

  // Status counts
  const pendingCount = firstTimers.filter((m) => !m.status || m.status === 'pending').length;
  const approvedCount = firstTimers.filter((m) => m.status === 'approved').length;
  const rejectedCount = firstTimers.filter((m) => m.status === 'rejected').length;

  // Top Campus
  const campusCounts = firstTimers.reduce<Record<string, number>>((acc, m) => {
    if (m.campus) {
      acc[m.campus] = (acc[m.campus] || 0) + 1;
    }
    return acc;
  }, {});
  const topCampuses = Object.entries(campusCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
  const topCampus = topCampuses[0];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Member Details Modal */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="glassmorphic border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedMember && (
            <>
              {/* Header banner */}
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-8 pb-5 sm:pb-6 border-b border-white/10">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl shrink-0 border border-primary/20">
                    {selectedMember.full_name?.charAt(0) || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl sm:text-2xl font-bold mb-1 text-left">
                        {selectedMember.full_name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {selectedMember.campus && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                          <MapPin size={10} />
                          {selectedMember.campus}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                          selectedMember.status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                          selectedMember.status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                          (!selectedMember.status || selectedMember.status === 'pending') && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        )}
                      >
                        {selectedMember.status === 'approved' && <CheckCircle2 size={11} />}
                        {selectedMember.status === 'rejected' && <XCircle size={11} />}
                        {(!selectedMember.status || selectedMember.status === 'pending') && <Clock size={11} />}
                        {(selectedMember.status || 'pending').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick contact row */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {selectedMember.email && (
                    <a href={`mailto:${selectedMember.email}`} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-colors">
                      <Mail size={13} /> {selectedMember.email}
                    </a>
                  )}
                  {selectedMember.phone && (
                    <a href={`tel:${selectedMember.phone}`} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-colors">
                      <Phone size={13} /> {selectedMember.phone}
                    </a>
                  )}
                  {selectedMember.created_at && (
                    <span className="flex items-center gap-2 text-xs text-foreground/40">
                      <Calendar size={13} /> Registered {format(new Date(selectedMember.created_at), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 border border-foreground/5 text-xs">
                  <div>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Gender</p>
                    <p className="font-medium text-foreground capitalize">{selectedMember.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Birthday</p>
                    <p className="font-medium text-foreground">
                      {selectedMember.birthday ? format(new Date(selectedMember.birthday), 'MMM dd, yyyy') : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Preferred Call Time</p>
                    <p className="font-medium text-foreground capitalize">{selectedMember.preferred_call_time || 'Anytime'}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Invited By</p>
                    <p className="font-medium text-foreground">{selectedMember.invited_by || 'Not specified'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Address</p>
                    <p className="font-medium text-foreground">
                      {[selectedMember.street_address, selectedMember.state, selectedMember.country].filter(Boolean).join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>

                {selectedMember.prayer_request && (
                  <div>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-2">Prayer Request</p>
                    <p className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMember.prayer_request}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Approval Footer */}
              <div className="p-5 sm:p-6 bg-foreground/[0.02] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-foreground/50 flex items-center gap-2">
                  Status:
                  <span
                    className={cn(
                      "font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-lg border",
                      selectedMember.status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                      selectedMember.status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                      (!selectedMember.status || selectedMember.status === 'pending') && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    )}
                  >
                    {selectedMember.status || 'pending'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedMember.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={updatingId === selectedMember.id}
                      onClick={() => handleUpdateStatus(selectedMember.id, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      {updatingId === selectedMember.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                      Approve Member
                    </button>
                  )}

                  {selectedMember.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={updatingId === selectedMember.id}
                      onClick={() => handleUpdateStatus(selectedMember.id, 'rejected')}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {updatingId === selectedMember.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={15} />}
                      Reject
                    </button>
                  )}

                  {selectedMember.status && selectedMember.status !== 'pending' && (
                    <button
                      type="button"
                      disabled={updatingId === selectedMember.id}
                      onClick={() => handleUpdateStatus(selectedMember.id, 'pending')}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground border border-foreground/10 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      Mark as Pending
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">First <span className="text-rose-gradient">Timers</span></h1>
          <p className="text-foreground/40 text-sm">Manage, follow up, and approve new family registrations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, campus, or phone..." 
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 sm:shrink-0">
            <button 
              onClick={handleExportPDF}
              title="Download PDF" 
              className="glassmorphic rounded-2xl px-4 py-3 flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button onClick={fetchFirstTimers} title="Refresh" className="glassmorphic rounded-2xl px-4 py-3 flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-foreground/10 transition-colors">
              <span className="text-sm font-medium text-foreground">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-2xl p-5 border border-primary/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mb-1">Total First Timers</p>
          <p className="text-3xl font-serif font-bold text-primary">{firstTimers.length}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/[0.02]">
          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/70 mb-1">Approved Members</p>
          <p className="text-3xl font-serif font-bold text-emerald-400">{approvedCount}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-5 border border-amber-500/20 bg-amber-500/[0.02]">
          <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400/70 mb-1">Pending Review</p>
          <p className="text-3xl font-serif font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-5 border border-foreground/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mb-1 truncate">
            {topCampus ? `Top Campus (${topCampus[0].split(' ')[0]})` : 'Top Campus'}
          </p>
          <p className="text-3xl font-serif font-bold">{topCampus ? (topCampus[1] as number) : 0}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All', count: firstTimers.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'approved', label: 'Approved', count: approvedCount },
              { id: 'rejected', label: 'Rejected', count: rejectedCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-4 sm:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap",
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground/40 hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold",
                  statusFilter === tab.id
                    ? "bg-black/20 text-white"
                    : "bg-foreground/10 text-foreground/60"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-foreground/40">
          Showing <strong className="text-foreground">{filteredMembers.length}</strong> of {firstTimers.length} records
        </p>
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
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Member Details</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Campus & Invited By</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Status</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Registration Date</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filteredMembers.length > 0 ? filteredMembers.map((member) => {
                  const status = member.status || 'pending';
                  const isItemUpdating = updatingId === member.id;

                  return (
                    <tr 
                      key={member.id} 
                      className="hover:bg-foreground/[0.03] transition-colors group text-foreground cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {member.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-0.5">{member.full_name}</p>
                            <p className="text-[10px] text-white/40 flex items-center gap-2">
                              <Mail size={10} /> {member.email}
                            </p>
                            {member.phone && (
                              <p className="text-[10px] text-white/40 flex items-center gap-2 mt-0.5">
                                <Phone size={10} /> {member.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium mb-0.5">{member.campus || 'Not specified'}</p>
                        <p className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">By: {member.invited_by || 'Unknown'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                            status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                            status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                            status === 'pending' && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          )}
                        >
                          {status === 'approved' && <CheckCircle2 size={11} />}
                          {status === 'rejected' && <XCircle size={11} />}
                          {status === 'pending' && <Clock size={11} />}
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-foreground/50 text-xs">
                          <Calendar size={13} />
                          {format(new Date(member.created_at), 'MMM dd, yyyy')}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">

                          {/* Quick Approve Action */}
                          {status !== 'approved' && (
                            <button
                              title="Approve member"
                              disabled={isItemUpdating}
                              onClick={() => handleUpdateStatus(member.id, 'approved')}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {isItemUpdating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                            </button>
                          )}

                          {/* Quick Reject Action */}
                          {status !== 'rejected' && (
                            <button
                              title="Reject record"
                              disabled={isItemUpdating}
                              onClick={() => handleUpdateStatus(member.id, 'rejected')}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {isItemUpdating ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                            </button>
                          )}

                          {/* Revert to Pending if not pending */}
                          {status !== 'pending' && (
                            <button
                              title="Revert to Pending"
                              disabled={isItemUpdating}
                              onClick={() => handleUpdateStatus(member.id, 'pending')}
                              className="p-2 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-foreground/15 hover:text-foreground transition-all disabled:opacity-50"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}

                          {/* View Details */}
                          <button 
                            title="View Details" 
                            onClick={() => setSelectedMember(member)}
                            className="p-2 hover:bg-primary/10 rounded-xl text-primary/50 hover:text-primary transition-colors"
                          >
                            <Eye size={16} />
                          </button>

                          {member.phone && (
                            <a href={`tel:${member.phone}`} title="Call member" className="p-2 hover:bg-foreground/10 rounded-xl text-foreground/30 hover:text-foreground transition-colors">
                              <Phone size={16} />
                            </a>
                          )}

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button title="Delete member" className="p-2 hover:bg-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
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
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-foreground/20 italic font-serif text-lg">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No first timers found matching your selected filters.'
                        : 'No first timers found.'}
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
