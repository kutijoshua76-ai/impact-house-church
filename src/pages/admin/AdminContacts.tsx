import { useState, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Trash2,
  Loader2,
  Calendar,
  MessageSquare,
  Search,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { exportToPDF } from '@/lib/pdf-export';

export default function AdminContacts() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Message Deleted",
        description: "The contact message has been successfully removed.",
      });

      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
    }
  };

  const filteredMessages = messages.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    const headers = ['Name', 'Email', 'Message', 'Date'];
    const rows = filteredMessages.map(m => [
      m.full_name,
      m.email,
      m.message,
      format(new Date(m.created_at), 'yyyy-MM-dd')
    ]);
    exportToPDF('Contact Messages Report', headers, rows, 'contact_messages_report');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Contact Messages</h1>
          <p className="text-foreground/40 text-sm">Review inquiries from the public website</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportPDF}
            title="Download PDF" 
            className="glassmorphic rounded-2xl px-4 py-3 flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-primary/10"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Fetching messages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
            <div key={msg.id} className="glassmorphic-card group hover:border-primary/20 transition-all p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 space-y-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{msg.full_name}</p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Sender</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/60 truncate max-w-[180px]">{msg.email}</p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/60">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Received</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 border-l border-foreground/5 md:pl-8">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Message Content</span>
                  </div>
                  <div className="bg-foreground/[0.02] p-6 rounded-2xl border border-foreground/5 min-h-[100px]">
                    <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap italic">
                      "{msg.message}"
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end items-center gap-3">
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    title="Delete message"
                    className="p-3 rounded-xl bg-foreground/5 text-foreground/20 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                  <a 
                    href={`mailto:${msg.email}`}
                    title="Reply via email"
                    className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center glassmorphic rounded-[2rem]">
              <p className="text-foreground/20 italic font-serif text-xl tracking-wide">No messages found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
