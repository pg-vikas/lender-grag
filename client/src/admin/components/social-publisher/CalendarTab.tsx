import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  Plus,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  MoreVertical,
  Calendar as CalendarIcon,
  List as ListIcon,
  Send,
  Edit
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";

// Mock data for posts
const mockPosts = [
  { id: 1, title: "New Feature Announcement", platform: "twitter", status: "Published", date: "2026-04-05T10:00:00" },
  { id: 2, title: "Weekly Tips & Tricks", platform: "linkedin", status: "Published", date: "2026-04-06T14:30:00" },
  { id: 3, title: "Company Culture Highlights", platform: "instagram", status: "Scheduled", date: "2026-04-08T12:00:00" },
  { id: 4, title: "Webinar Registration Reminder", platform: "facebook", status: "Scheduled", date: "2026-04-10T09:00:00" },
  { id: 5, title: "Industry News Update", platform: "twitter", status: "Draft", date: "2026-04-12T15:00:00" },
  { id: 6, title: "Client Success Story", platform: "linkedin", status: "Scheduled", date: "2026-04-15T11:00:00" },
  { id: 7, title: "Product Launch Teaser", platform: "instagram", status: "Draft", date: "2026-04-18T10:00:00" },
];

export default function CalendarTab({ onNewPost }: { onNewPost: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 6)); // Default to April 6, 2026 as per snapshot
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchQuery, setSearchQuery] = useState("");
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date(2026, 3, 6)); // Mocking today for the demo

  const renderPlatformIcon = (platform: string, className = "w-3 h-3") => {
    switch(platform) {
      case 'twitter': return <Twitter className={`${className} text-[#1DA1F2]`} />;
      case 'facebook': return <Facebook className={`${className} text-[#1877F2]`} />;
      case 'instagram': return <Instagram className={`${className} text-[#E1306C]`} />;
      case 'linkedin': return <Linkedin className={`${className} text-[#0A66C2]`} />;
      default: return null;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'Published': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Published</span>;
      case 'Scheduled': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">Scheduled</span>;
      case 'Draft': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">Draft</span>;
      default: return null;
    }
  };

  // Calendar rendering logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Find posts for this day
      const dayPosts = mockPosts.filter(post => isSameDay(parseISO(post.date), cloneDay));
      const isToday = isSameDay(day, new Date(2026, 3, 6));

      days.push(
        <div 
          className={`min-h-[120px] p-2 border-r border-b border-slate-700/50 transition-colors ${
            !isSameMonth(day, monthStart)
              ? "bg-slate-900/30 text-slate-600"
              : isToday 
                ? "bg-indigo-500/5 text-white" 
                : "bg-slate-800/30 text-slate-300 hover:bg-slate-800/80"
          }`}
          key={day.toString()}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
              isToday ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]" : ""
            }`}>
              {formattedDate}
            </span>
            {dayPosts.length > 0 && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded shadow-inner">
                {dayPosts.length} posts
              </span>
            )}
          </div>
          
          <div className="space-y-1.5">
            {dayPosts.map(post => (
              <div 
                key={post.id} 
                className={`p-1.5 rounded border text-xs cursor-pointer hover:shadow-md transition-all truncate flex items-center gap-1.5 ${
                  post.status === 'Published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                  post.status === 'Scheduled' ? 'bg-sky-500/10 border-sky-500/20 text-sky-300' :
                  'bg-slate-700/50 border-slate-600 text-slate-400'
                }`}
                title={post.title}
              >
                {renderPlatformIcon(post.platform)}
                <span className="truncate">{format(parseISO(post.date), 'h:mm a')} - {post.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg">
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-bold transition-colors ${
              viewMode === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-bold transition-colors ${
              viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>

        {viewMode === 'calendar' && (
          <div className="flex items-center space-x-4">
            <button onClick={goToToday} className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-md transition-colors shadow-inner">
              Today
            </button>
            <div className="flex items-center space-x-2">
              <button onClick={prevMonth} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-white font-bold min-w-[140px] text-center text-lg">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <button onClick={nextMonth} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500 shadow-inner"
            />
          </div>
          <button className="p-2.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-600 rounded-xl transition-colors shadow-inner">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={onNewPost}
            className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
        {viewMode === 'calendar' ? (
          <div>
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-700/50 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="flex flex-col">
              {rows}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Post</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {mockPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{post.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {renderPlatformIcon(post.platform, "w-4 h-4")}
                        <span className="text-[13px] text-slate-300 capitalize">{post.platform}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-slate-400">
                      {format(parseISO(post.date), 'MMM d, yyyy • h:mm a')}
                    </td>
                    <td className="py-4 px-6">
                      {renderStatusBadge(post.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        {post.status !== 'Published' && (
                          <button className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded" title="Publish Now">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded" title="More options">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}