import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Download,
  Trash2,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Filter,
  Users,
  Eye,
  User,
  Clock,
  MessageSquare,
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { exportToPDF } from '@/lib/pdf-export';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
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

// Department list for filter dropdown
const DEPARTMENTS = [
  "All Departments",
  "Ushering", "Protocol", "Media", "Information Unit",
  "Technical Unit", "Choir", "Maintenance Unit", "Evangelism",
  "Charging Unit", "CSR", "Logistics", "Anchor", "Instrumentalist",
  "House Fellowship Unit", "Sparkles Unit", "Follow Up Unit",
  "Drama Unit", "Prayer Unit", "Sunday School Unit",
  "Greeters Unit", "Medical Unit",
];

// Colour map for department badges
const deptColour: Record<string, string> = {
  "Ushering": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Protocol": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Media": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Information Unit": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Technical Unit": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Choir": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Maintenance Unit": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Evangelism": "bg-green-500/10 text-green-400 border-green-500/20",
  "Charging Unit": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "CSR": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Logistics": "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "Anchor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Instrumentalist": "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "House Fellowship Unit": "bg-lime-500/10 text-lime-400 border-lime-500/20",
  "Sparkles Unit": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Follow Up Unit": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Drama Unit": "bg-red-500/10 text-red-400 border-red-500/20",
  "Prayer Unit": "bg-amber-600/10 text-amber-300 border-amber-600/20",
  "Sunday School Unit": "bg-sky-600/10 text-sky-300 border-sky-600/20",
  "Greeters Unit": "bg-orange-400/10 text-orange-300 border-orange-400/20",
  "Medical Unit": "bg-red-400/10 text-red-300 border-red-400/20",
};

// Detail field helper
function DetailField({ label, value, full = false }: { label: string; value?: string | null; full?: boolean }) {
  return (
    <div className={full ? "col-span-1 sm:col-span-2" : ""}>
      <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-foreground text-xs sm:text-sm font-medium leading-relaxed">
        {value || <span className="text-foreground/25 italic">Not provided</span>}
      </p>
    </div>
  );
}

// Applicant Detail Modal
function ApplicantModal({
  app,
  open,
  onClose,
  onUpdateStatus,
  isUpdating,
}: {
  app: any;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  isUpdating: boolean;
}) {
  if (!app) return null;

  const initials = app.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const badgeClass = deptColour[app.department] || 'bg-foreground/5 text-foreground/40 border-foreground/10';
  const status = app.status || 'pending';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glassmorphic border-white/10 w-[94vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-7 pb-4 sm:pb-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 pr-6">
            {/* Avatar */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 border border-primary/20">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <DialogHeader>
                <DialogTitle className="font-serif text-lg sm:text-2xl font-bold mb-1 text-left text-foreground">
                  {app.full_name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${badgeClass}`}>
                  <Briefcase size={10} />
                  {app.department}
                </span>

                {/* Status Badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                    status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                    status === 'pending' && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  )}
                >
                  {status === 'approved' && <CheckCircle2 size={11} />}
                  {status === 'rejected' && <XCircle size={11} />}
                  {status === 'pending' && <Clock size={11} />}
                  {status.toUpperCase()}
                </span>

                {app.age_range && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-foreground/5 text-foreground/40 border border-foreground/10">
                    Age: {app.age_range}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact row */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs">
            {app.email && (
              <a href={`mailto:${app.email}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-foreground/5 sm:bg-transparent text-foreground/70 hover:text-primary transition-colors">
                <Mail size={12} /> <span className="truncate max-w-[200px]">{app.email}</span>
              </a>
            )}
            {app.phone && (
              <a href={`tel:${app.phone}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-foreground/5 sm:bg-transparent text-foreground/70 hover:text-primary transition-colors font-medium">
                <Phone size={12} /> {app.phone}
              </a>
            )}
            {app.created_at && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-foreground/40">
                <Calendar size={12} /> Applied {format(new Date(app.created_at), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-7 space-y-5 sm:space-y-7">

          {/* Personal Details */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <User size={14} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 border border-foreground/5">
              <DetailField label="Full Name" value={app.full_name} />
              <DetailField label="Gender" value={app.gender ? app.gender.charAt(0).toUpperCase() + app.gender.slice(1).replace(/-/g, ' ') : undefined} />
              <DetailField label="Email Address" value={app.email} />
              <DetailField label="Phone Number" value={app.phone} />
              <DetailField label="Age Range" value={app.age_range} />
            </div>
          </div>

          {/* Service Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Clock size={14} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Service Preferences</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 border border-foreground/5">
              <DetailField label="Department Applied" value={app.department} />
              <DetailField label="Availability" value={app.availability} />
            </div>
          </div>

          {/* Motivation & Experience */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <MessageSquare size={14} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Motivation & Experience</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
                  Why they want to join
                </p>
                <p className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {app.reason || <span className="italic text-foreground/25">Not provided</span>}
                </p>
              </div>
              {app.experience && (
                <div>
                  <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
                    Prior Experience
                  </p>
                  <p className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {app.experience}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Approval Footer */}
        <div className="p-4 sm:p-6 bg-foreground/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-foreground/50 flex items-center justify-between sm:justify-start gap-2">
            <span>Status:</span>
            <span
              className={cn(
                "font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-lg border",
                status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                status === 'pending' && "bg-amber-500/10 text-amber-400 border-amber-500/30"
              )}
            >
              {status}
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {status !== 'approved' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(app.id, 'approved')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                Approve Member
              </button>
            )}

            {status !== 'rejected' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(app.id, 'rejected')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={15} />}
                Reject
              </button>
            )}

            {status !== 'pending' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(app.id, 'pending')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground border border-foreground/10 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <RotateCcw size={14} />
                Mark Pending
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminWorkforce() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingApp, setViewingApp] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workforce_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching workforce applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      setUpdatingId(id);
      const { data, error } = await supabase
        .from('workforce_applications')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Optimistically update applications list
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );

      // Also update currently viewed application modal if open
      if (viewingApp?.id === id) {
        setViewingApp((prev: any) => (prev ? { ...prev, status: newStatus } : null));
      }

      const statusLabels = {
        approved: "Member Approved",
        rejected: "Application Rejected",
        pending: "Moved to Pending",
      };

      toast({
        title: statusLabels[newStatus],
        description: `The application status has been updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: error.message || "Failed to update member status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone?.includes(searchTerm) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All Departments' || a.department === selectedDept;
    const currentStatus = a.status || 'pending';
    const matchStatus = statusFilter === 'all' || currentStatus === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workforce_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (viewingApp?.id === id) setViewingApp(null);
      toast({ title: "Record Deleted", description: "The application has been removed." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: error.message || "Failed to delete." });
    }
  };

  const handleExportPDF = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Status', 'Availability', 'Reason', 'Date'];
    const rows = filtered.map((a) => [
      a.full_name,
      a.email,
      a.phone || 'N/A',
      a.department,
      (a.status || 'pending').toUpperCase(),
      a.availability || 'N/A',
      (a.reason || '').substring(0, 60) + (a.reason?.length > 60 ? '...' : ''),
      format(new Date(a.created_at), 'yyyy-MM-dd'),
    ]);
    exportToPDF('Workforce Applications Report', headers, rows, 'workforce_applications_report');
  };

  // Counts for status
  const pendingCount = applications.filter((a) => !a.status || a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  // Stats: top department
  const deptCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.department] = (acc[a.department] || 0) + 1;
    return acc;
  }, {});
  const topDepts = Object.entries(deptCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  const topDept = topDepts[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-full overflow-hidden">

      {/* Applicant Detail Modal */}
      <ApplicantModal
        app={viewingApp}
        open={!!viewingApp}
        onClose={() => setViewingApp(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updatingId === viewingApp?.id}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Join the <span className="text-rose-gradient">Workforce</span>
          </h1>
          <p className="text-foreground/40 text-xs sm:text-sm mt-0.5">Manage and approve workforce members and department applications</p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60 lg:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={17} />
            <input
              type="text"
              placeholder="Search name, dept..."
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-foreground/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dept Filter */}
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" size={14} />
            <select
              title="Filter by department"
              className="w-full sm:w-auto glassmorphic rounded-2xl pl-9 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm border border-foreground/10 focus:outline-none focus:border-primary/40 text-foreground appearance-none cursor-pointer bg-foreground/5 hover:bg-foreground/10 transition-colors"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} className="bg-midnight">{d}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleExportPDF}
              title="Export PDF"
              className="glassmorphic rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10 active:scale-95"
            >
              <Download size={16} />
              <span className="text-xs sm:text-sm font-medium">Export</span>
            </button>
            <button
              onClick={fetchApplications}
              title="Refresh"
              className="glassmorphic rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-foreground/10 transition-colors active:scale-95"
            >
              <RefreshCw size={15} className={cn(loading && "animate-spin text-primary")} />
              <span className="text-xs sm:text-sm font-medium text-foreground">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="glassmorphic rounded-2xl p-3.5 sm:p-5 border border-primary/10">
          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-foreground/40 mb-1 truncate">Total Applications</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-primary">{applications.length}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-3.5 sm:p-5 border border-emerald-500/20 bg-emerald-500/[0.02]">
          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-emerald-400/70 mb-1 truncate">Approved Members</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{approvedCount}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-3.5 sm:p-5 border border-amber-500/20 bg-amber-500/[0.02]">
          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-amber-400/70 mb-1 truncate">Pending Review</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="glassmorphic rounded-2xl p-3.5 sm:p-5 border border-foreground/10">
          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-foreground/40 mb-1 truncate">
            {topDept ? `Top (${topDept[0].split(' ')[0]})` : 'Top Department'}
          </p>
          <p className="text-2xl sm:text-3xl font-serif font-bold">{topDept ? (topDept[1] as number) : 0}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10 overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'All', count: applications.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'approved', label: 'Approved', count: approvedCount },
              { id: 'rejected', label: 'Rejected', count: rejectedCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-3.5 sm:px-5 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0",
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground/40 hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold",
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

        <p className="text-xs text-foreground/40 self-start sm:self-auto">
          Showing <strong className="text-foreground">{filtered.length}</strong> of {applications.length} applications
        </p>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 gap-4 glassmorphic rounded-[2rem]">
          <Loader2 className="w-9 h-9 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/30">Loading Applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glassmorphic rounded-[2rem] p-10 sm:p-16 text-center space-y-3">
          <Users className="w-12 h-12 text-foreground/15 mx-auto" />
          <p className="text-foreground/40 italic font-serif text-base sm:text-lg">
            {searchTerm || selectedDept !== 'All Departments' || statusFilter !== 'all'
              ? 'No applications match your selected filters.'
              : 'No workforce applications yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (< md) */}
          <div className="space-y-3 md:hidden">
            {filtered.map((app) => {
              const status = app.status || 'pending';
              const isItemUpdating = updatingId === app.id;
              const badgeClass = deptColour[app.department] || 'bg-foreground/5 text-foreground/40 border-foreground/10';

              return (
                <div
                  key={app.id}
                  onClick={() => setViewingApp(app)}
                  className="glassmorphic rounded-2xl p-4 border border-foreground/10 hover:border-primary/30 transition-all space-y-3 cursor-pointer active:scale-[0.99]"
                >
                  {/* Card Header: Avatar, Name, Dept Badge & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
                        {app.full_name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">{app.full_name}</h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                            <Briefcase size={9} /> {app.department}
                          </span>
                          {app.age_range && (
                            <span className="text-[10px] text-foreground/40">
                              Age: {app.age_range}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider border shrink-0",
                        status === 'approved' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                        status === 'rejected' && "bg-rose-500/10 text-rose-400 border-rose-500/30",
                        status === 'pending' && "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      )}
                    >
                      {status === 'approved' && <CheckCircle2 size={10} />}
                      {status === 'rejected' && <XCircle size={10} />}
                      {status === 'pending' && <Clock size={10} />}
                      {status}
                    </span>
                  </div>

                  {/* Contact Links & Date */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-foreground/5 text-xs text-foreground/60">
                    {app.phone && (
                      <a
                        href={`tel:${app.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-colors text-[11px] font-medium"
                      >
                        <Phone size={11} /> {app.phone}
                      </a>
                    )}
                    {app.email && (
                      <a
                        href={`mailto:${app.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-colors text-[11px] font-medium truncate max-w-[170px]"
                      >
                        <Mail size={11} /> {app.email}
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-foreground/40 ml-auto">
                      <Calendar size={10} /> {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Availability badge & Reason preview */}
                  <div className="space-y-1.5 pt-1">
                    {app.availability && (
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground/50">
                        <Clock size={11} className="text-primary/70" />
                        <span>Availability: <strong className="text-foreground/70 font-medium">{app.availability}</strong></span>
                      </div>
                    )}
                    {app.reason && (
                      <p className="text-[11px] text-foreground/60 italic line-clamp-2 bg-foreground/[0.02] p-2.5 rounded-xl border border-foreground/5">
                        "{app.reason}"
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-foreground/5" onClick={(e) => e.stopPropagation()}>
                    {status !== 'approved' && (
                      <button
                        type="button"
                        disabled={isItemUpdating}
                        onClick={() => handleUpdateStatus(app.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isItemUpdating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Approve
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button
                        type="button"
                        disabled={isItemUpdating}
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isItemUpdating ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={13} />}
                        Reject
                      </button>
                    )}
                    {status !== 'pending' && (
                      <button
                        type="button"
                        title="Mark as pending"
                        disabled={isItemUpdating}
                        onClick={() => handleUpdateStatus(app.id, 'pending')}
                        className="p-2 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-foreground/15 hover:text-foreground transition-all disabled:opacity-50"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      title="View Details"
                      onClick={() => setViewingApp(app)}
                      className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <Eye size={14} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          title="Delete application"
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-500/60 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glassmorphic border-white/10 w-[92vw] sm:max-w-md rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
                          <AlertDialogDescription className="text-foreground/60 text-xs sm:text-sm">
                            This will permanently delete the application from <strong className="text-foreground">{app.full_name}</strong> for the {app.department} unit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(app.id)}
                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop / Tablet Table View (hidden on mobile) */}
          <div className="hidden md:block glassmorphic rounded-[2rem] overflow-hidden border border-foreground/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Applicant</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Department</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Status</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Availability</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Reason</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Date</th>
                    <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {filtered.map((app) => {
                    const status = app.status || 'pending';
                    const isItemUpdating = updatingId === app.id;

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-foreground/[0.03] transition-colors group text-foreground cursor-pointer"
                        onClick={() => setViewingApp(app)}
                      >
                        {/* Applicant */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                              {app.full_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-sm mb-0.5">{app.full_name}</p>
                              <p className="text-[10px] text-foreground/40 flex items-center gap-1.5">
                                <Mail size={10} /> {app.email}
                              </p>
                              {app.phone && (
                                <p className="text-[10px] text-foreground/40 flex items-center gap-1.5 mt-0.5">
                                  <Phone size={10} /> {app.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${deptColour[app.department] || 'bg-foreground/5 text-foreground/40 border-foreground/10'}`}>
                            <Briefcase size={10} />
                            {app.department}
                          </span>
                          {app.age_range && (
                            <p className="text-[10px] text-foreground/30 mt-1">Age: {app.age_range}</p>
                          )}
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

                        {/* Availability */}
                        <td className="px-6 py-5">
                          <p className="text-xs text-foreground/70 max-w-[120px]">{app.availability || '—'}</p>
                        </td>

                        {/* Reason */}
                        <td className="px-6 py-5 max-w-[180px]">
                          <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed">
                            {app.reason || <span className="italic text-foreground/20">Not provided</span>}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-foreground/50 text-xs">
                            <Calendar size={13} />
                            {format(new Date(app.created_at), 'MMM dd, yyyy')}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">

                            {/* Quick Approval Action */}
                            {status !== 'approved' && (
                              <button
                                title="Approve member"
                                disabled={isItemUpdating}
                                onClick={() => handleUpdateStatus(app.id, 'approved')}
                                className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {isItemUpdating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                              </button>
                            )}

                            {/* Quick Reject Action */}
                            {status !== 'rejected' && (
                              <button
                                title="Reject application"
                                disabled={isItemUpdating}
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {isItemUpdating ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                              </button>
                            )}

                            {/* Mark as Pending if already approved/rejected */}
                            {status !== 'pending' && (
                              <button
                                title="Revert to Pending"
                                disabled={isItemUpdating}
                                onClick={() => handleUpdateStatus(app.id, 'pending')}
                                className="p-2 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-foreground/15 hover:text-foreground transition-all disabled:opacity-50"
                              >
                                <RotateCcw size={15} />
                              </button>
                            )}

                            {/* View Details */}
                            <button
                              title="View applicant details"
                              onClick={() => setViewingApp(app)}
                              className="p-2 hover:bg-primary/10 rounded-xl text-primary/40 hover:text-primary transition-colors"
                            >
                              <Eye size={16} />
                            </button>

                            {app.phone && (
                              <a
                                href={`tel:${app.phone}`}
                                title="Call applicant"
                                className="p-2 hover:bg-foreground/10 rounded-xl text-foreground/30 hover:text-foreground transition-colors"
                              >
                                <Phone size={16} />
                              </a>
                            )}

                            {/* Delete */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button title="Delete application" className="p-2 hover:bg-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glassmorphic border-white/10 w-[92vw] sm:max-w-md rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this application?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-foreground/60">
                                    This will permanently delete the application from <strong className="text-foreground">{app.full_name}</strong> for the {app.department} unit. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(app.id)}
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
