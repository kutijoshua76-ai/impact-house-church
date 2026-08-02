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
  Star,
  X,
} from 'lucide-react';
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
    <div className={full ? "col-span-2" : ""}>
      <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">{label}</p>
      <p className="text-foreground text-sm font-medium leading-relaxed">
        {value || <span className="text-foreground/25 italic">Not provided</span>}
      </p>
    </div>
  );
}

// Applicant Detail Modal
function ApplicantModal({ app, open, onClose }: { app: any; open: boolean; onClose: () => void }) {
  if (!app) return null;

  const initials = app.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const badgeClass = deptColour[app.department] || 'bg-foreground/5 text-foreground/40 border-foreground/10';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glassmorphic border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-8 pb-5 sm:pb-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-8">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl shrink-0 border border-primary/20">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl sm:text-2xl font-bold mb-1 text-left">
                  {app.full_name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${badgeClass}`}>
                  <Briefcase size={10} />
                  {app.department}
                </span>
                {app.age_range && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-foreground/5 text-foreground/40 border border-foreground/10">
                    Age: {app.age_range}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {app.email && (
              <a href={`mailto:${app.email}`} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-colors">
                <Mail size={13} /> {app.email}
              </a>
            )}
            {app.phone && (
              <a href={`tel:${app.phone}`} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-primary transition-colors">
                <Phone size={13} /> {app.phone}
              </a>
            )}
            {app.created_at && (
              <span className="flex items-center gap-2 text-xs text-foreground/40">
                <Calendar size={13} /> Applied {format(new Date(app.created_at), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">

          {/* Personal Details */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <User size={15} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5 bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 border border-foreground/5">
              <DetailField label="Full Name" value={app.full_name} />
              <DetailField label="Gender" value={app.gender ? app.gender.charAt(0).toUpperCase() + app.gender.slice(1).replace(/-/g, ' ') : undefined} />
              <DetailField label="Email Address" value={app.email} />
              <DetailField label="Phone Number" value={app.phone} />
              <DetailField label="Age Range" value={app.age_range} />
            </div>
          </div>

          {/* Service Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Clock size={15} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Service Preferences</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 border border-foreground/5">
              <DetailField label="Department Applied" value={app.department} />
              <DetailField label="Availability" value={app.availability} />
            </div>
          </div>

          {/* Motivation & Experience */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={15} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Motivation & Experience</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Why they want to join
                </p>
                <p className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {app.reason || <span className="italic text-foreground/25">Not provided</span>}
                </p>
              </div>
              {app.experience && (
                <div>
                  <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                    Prior Experience
                  </p>
                  <p className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {app.experience}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminWorkforce() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
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

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone?.includes(searchTerm) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All Departments' || a.department === selectedDept;
    return matchSearch && matchDept;
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
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Availability', 'Reason', 'Date'];
    const rows = filtered.map((a) => [
      a.full_name,
      a.email,
      a.phone || 'N/A',
      a.department,
      a.availability || 'N/A',
      (a.reason || '').substring(0, 60) + (a.reason?.length > 60 ? '...' : ''),
      format(new Date(a.created_at), 'yyyy-MM-dd'),
    ]);
    exportToPDF('Workforce Applications Report', headers, rows, 'workforce_applications_report');
  };

  // Stats: top 3 departments
  const deptCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.department] = (acc[a.department] || 0) + 1;
    return acc;
  }, {});
  const topDepts = Object.entries(deptCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Applicant Detail Modal */}
      <ApplicantModal
        app={viewingApp}
        open={!!viewingApp}
        onClose={() => setViewingApp(null)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Join the <span className="text-rose-gradient">Workforce</span>
          </h1>
          <p className="text-foreground/40 text-sm mt-1">Manage department applications and service registrations</p>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dept Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={15} />
            <select
              title="Filter by department"
              className="glassmorphic rounded-2xl pl-9 pr-4 py-3 text-sm border border-foreground/10 focus:outline-none focus:border-primary/40 text-foreground appearance-none cursor-pointer bg-foreground/5 hover:bg-foreground/10 transition-colors"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} className="bg-midnight">{d}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleExportPDF}
              title="Export PDF"
              className="glassmorphic rounded-2xl px-4 py-3 flex-1 xl:flex-none flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button
              onClick={fetchApplications}
              title="Refresh"
              className="glassmorphic rounded-2xl px-4 py-3 flex-1 xl:flex-none flex items-center justify-center gap-2 hover:bg-foreground/10 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-2xl p-5 border border-primary/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mb-1">Total Applications</p>
          <p className="text-3xl font-serif font-bold text-primary">{applications.length}</p>
        </div>
        {topDepts.map(([dept, count]) => (
          <div key={dept} className="glassmorphic rounded-2xl p-5 border border-foreground/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mb-1 truncate">{dept}</p>
            <p className="text-3xl font-serif font-bold">{count as number}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glassmorphic rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Loading Applications...</p>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Applicant</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Department</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Availability</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Reason</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Date</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filtered.length > 0 ? filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-foreground/[0.03] transition-colors group text-foreground cursor-pointer"
                    onClick={() => setViewingApp(app)}
                  >
                    {/* Applicant */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {app.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-0.5">{app.full_name}</p>
                          <p className="text-[10px] text-foreground/30 flex items-center gap-1.5">
                            <Mail size={10} /> {app.email}
                          </p>
                          {app.phone && (
                            <p className="text-[10px] text-foreground/30 flex items-center gap-1.5 mt-0.5">
                              <Phone size={10} /> {app.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${deptColour[app.department] || 'bg-foreground/5 text-foreground/40 border-foreground/10'}`}>
                        <Briefcase size={10} />
                        {app.department}
                      </span>
                      {app.age_range && (
                        <p className="text-[10px] text-foreground/30 mt-2">Age: {app.age_range}</p>
                      )}
                    </td>

                    {/* Availability */}
                    <td className="px-8 py-6">
                      <p className="text-sm text-foreground/70 max-w-[120px]">{app.availability || '—'}</p>
                    </td>

                    {/* Reason */}
                    <td className="px-8 py-6 max-w-[200px]">
                      <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed">
                        {app.reason || <span className="italic text-foreground/20">Not provided</span>}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-foreground/50 text-sm">
                        <Calendar size={14} />
                        {format(new Date(app.created_at), 'MMM dd, yyyy')}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          title="View applicant details"
                          onClick={() => setViewingApp(app)}
                          className="p-2 hover:bg-primary/10 rounded-lg text-primary/40 hover:text-primary transition-colors"
                        >
                          <Eye size={18} />
                        </button>

                        {app.phone && (
                          <a
                            href={`tel:${app.phone}`}
                            title="Call applicant"
                            className="p-2 hover:bg-foreground/10 rounded-lg text-foreground/30 hover:text-foreground transition-colors"
                          >
                            <Phone size={18} />
                          </a>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button title="Delete application" className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glassmorphic border-white/10">
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
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Users className="w-16 h-16 text-foreground/10" />
                        <p className="text-foreground/20 italic font-serif text-lg">
                          {searchTerm || selectedDept !== 'All Departments'
                            ? 'No applications match your search.'
                            : 'No workforce applications yet.'}
                        </p>
                      </div>
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
