import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { Search, Send, Check, CheckCheck, Clock, MoreVertical, Phone, Video, Info } from "lucide-react";

export default function MessagesPage() {
  const [openMenus, setOpenMenus] = useState<string>('support');
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThreadId]);

  const [threads, setThreads] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "JD",
      color: "bg-indigo-500",
      lastMessage: "I need help with my recent invoice.",
      time: "10:42 AM",
      unread: 2,
      status: "online",
      messages: [
        { id: 1, sender: 'customer', text: "Hi, I have a question about my latest invoice.", time: "10:30 AM", status: "read" },
        { id: 2, sender: 'support', text: "Hello John! I'd be happy to help you with that. Could you please provide your invoice number?", time: "10:32 AM", status: "read" },
        { id: 3, sender: 'customer', text: "Sure, it's INV-2023-0045.", time: "10:35 AM", status: "read" },
        { id: 4, sender: 'support', text: "Thank you. Let me pull that up for you.", time: "10:36 AM", status: "read" },
        { id: 5, sender: 'support', text: "I see the invoice. What specifically would you like to know about it?", time: "10:38 AM", status: "read" },
        { id: 6, sender: 'customer', text: "There seems to be an extra charge for 'Premium Support' that I didn't sign up for.", time: "10:41 AM", status: "read" },
        { id: 7, sender: 'customer', text: "I need help with my recent invoice.", time: "10:42 AM", status: "read" }
      ]
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@company.co",
      avatar: "SS",
      color: "bg-emerald-500",
      lastMessage: "Thank you, that solved my problem!",
      time: "Yesterday",
      unread: 0,
      status: "offline",
      messages: [
        { id: 1, sender: 'customer', text: "Hi, I'm having trouble finding the setting to update my profile picture.", time: "2:10 PM", status: "read" },
        { id: 2, sender: 'support', text: "Hello Sarah! I can certainly help you with that.", time: "2:12 PM", status: "read" },
        { id: 3, sender: 'customer', text: "Great, how do I do it?", time: "2:15 PM", status: "read" },
        { id: 4, sender: 'support', text: "You can update your profile picture by going to Settings > Profile > Avatar and clicking 'Upload'.", time: "2:20 PM", status: "read" },
        { id: 5, sender: 'customer', text: "Thank you, that solved my problem!", time: "2:45 PM", status: "read" }
      ]
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@techcorp.com",
      avatar: "MJ",
      color: "bg-rose-500",
      lastMessage: "Thanks for the update. Do you have an ETA?",
      time: "9:15 AM",
      unread: 1,
      status: "away",
      messages: [
        { id: 1, sender: 'customer', text: "Is the API down right now?", time: "9:05 AM", status: "read" },
        { id: 2, sender: 'support', text: "Hello Mike. We are currently experiencing some degraded performance on our US-East endpoints.", time: "9:11 AM", status: "read" },
        { id: 3, sender: 'support', text: "Our engineering team is actively working on resolving it.", time: "9:12 AM", status: "read" },
        { id: 4, sender: 'support', text: "You can check our status page at status.gorillahub.com for real-time updates.", time: "9:13 AM", status: "read" },
        { id: 5, sender: 'customer', text: "Thanks for the update. Do you have an ETA?", time: "9:15 AM", status: "unread" }
      ]
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily@designstudio.net",
      avatar: "EC",
      color: "bg-purple-500",
      lastMessage: "I would like to pay annually if there is a discount.",
      time: "Mon",
      unread: 0,
      status: "online",
      messages: [
        { id: 1, sender: 'customer', text: "Hi there, I'd like to upgrade my plan.", time: "11:20 AM", status: "read" },
        { id: 2, sender: 'support', text: "Hi Emily! Thanks for reaching out. We have Pro and Enterprise plans available.", time: "11:25 AM", status: "read" },
        { id: 3, sender: 'customer', text: "What's the main difference between Pro and Enterprise?", time: "11:30 AM", status: "read" },
        { id: 4, sender: 'support', text: "Enterprise includes dedicated account management, custom SLA, and priority support.", time: "11:35 AM", status: "read" },
        { id: 5, sender: 'customer', text: "I think Pro is enough for us right now. I would like to pay annually if there is a discount.", time: "11:40 AM", status: "read" }
      ]
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.w@retailer.com",
      avatar: "DW",
      color: "bg-amber-500",
      lastMessage: "I will keep an eye out for the email.",
      time: "Last week",
      unread: 0,
      status: "offline",
      messages: [
        { id: 1, sender: 'customer', text: "Hi, I saw a preview of the new reporting features.", time: "4:28 PM", status: "read" },
        { id: 2, sender: 'customer', text: "When will the new reporting features be available?", time: "4:30 PM", status: "read" },
        { id: 3, sender: 'support', text: "Hi David! We are aiming to release the new reporting features in Q3.", time: "4:45 PM", status: "read" },
        { id: 4, sender: 'support', text: "We'll send an email announcement once they're live and available in your dashboard.", time: "4:46 PM", status: "read" },
        { id: 5, sender: 'customer', text: "Sounds good, thanks. I will keep an eye out for the email.", time: "5:00 PM", status: "read" }
      ]
    }
  ]);

  const handleSendMessage = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setThreads(prevThreads => {
      const activeThreadIndex = prevThreads.findIndex(t => t.id === activeThreadId);
      if (activeThreadIndex === -1) return prevThreads;
      
      const updatedThread = {
        ...prevThreads[activeThreadIndex],
        lastMessage: newMessage,
        time: timeString,
        messages: [
          ...prevThreads[activeThreadIndex].messages,
          { 
            id: prevThreads[activeThreadIndex].messages.length + 1, 
            sender: 'support', 
            text: newMessage, 
            time: timeString, 
            status: "read" 
          }
        ]
      };

      const newThreads = [...prevThreads];
      newThreads.splice(activeThreadIndex, 1);
      newThreads.unshift(updatedThread);
      
      return newThreads;
    });
    
    setNewMessage("");
    setTimeout(scrollToBottom, 100);
  };

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const filteredThreads = threads.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    scrollToBottom();
  }, [activeThread.messages.length]);

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Messages" />

        <main className="flex-1 overflow-hidden p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6">
            
            {/* Left Sidebar - Chat List */}
            <div className="w-full lg:w-1/3 xl:w-1/4 h-full flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-slate-800/50 bg-slate-900/40">
                <h2 className="text-lg font-semibold text-white mb-4">Conversations</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500/50 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {filteredThreads.length > 0 ? (
                  <div className="flex flex-col">
                    {filteredThreads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => {
                          setActiveThreadId(thread.id);
                          setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: 0 } : t));
                        }}
                        className={`w-full p-4 flex items-start gap-3 border-b border-slate-800/30 transition-all hover:bg-slate-800/40 text-left ${activeThreadId === thread.id ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : thread.unread > 0 ? 'bg-slate-800/30 border-l-2 border-l-transparent' : 'border-l-2 border-l-transparent'}`}
                      >
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-full ${thread.color} text-white flex items-center justify-center font-semibold text-sm shadow-sm`}>
                            {thread.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${thread.status === 'online' ? 'bg-green-500' : thread.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm truncate ${activeThreadId === thread.id ? 'text-indigo-300 font-semibold' : thread.unread > 0 ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                              {thread.name}
                            </h3>
                            <span className={`text-xs shrink-0 ml-2 ${thread.unread > 0 ? 'text-indigo-400 font-semibold' : 'text-slate-500'}`}>{thread.time}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs truncate ${thread.unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                              {thread.lastMessage}
                            </p>
                            {thread.unread > 0 && (
                              <span className="w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                {thread.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No conversations found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Area - Chat View */}
            <div className="flex-1 h-full flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800/50 bg-slate-900/40 flex items-center justify-between backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full ${activeThread.color} text-white flex items-center justify-center font-semibold text-sm shadow-sm`}>
                      {activeThread.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${activeThread.status === 'online' ? 'bg-green-500' : activeThread.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">{activeThread.name}</h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      {activeThread.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group relative">
                    <Phone className="w-4 h-4" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Audio Call</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group relative">
                    <Video className="w-4 h-4" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Video Call</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group relative">
                    <Info className="w-4 h-4" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Client Info</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group relative">
                    <MoreVertical className="w-4 h-4" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">More Options</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0f172a]/30">
                <div className="text-center my-4">
                  <span className="bg-slate-800/50 text-slate-400 text-[10px] font-medium px-3 py-1 rounded-full border border-white/5">
                    Today
                  </span>
                </div>

                {activeThread.messages.map((msg, index) => {
                  const isSupport = msg.sender === 'support';
                  return (
                    <div key={msg.id} className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                            isSupport 
                              ? 'bg-indigo-600 text-white rounded-br-sm' 
                              : 'bg-slate-800 border border-slate-600 bg-slate-950 text-slate-200 rounded-bl-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-500 ${isSupport ? 'justify-end' : 'justify-start'}`}>
                          <span>{msg.time}</span>
                          {isSupport && (
                            <CheckCheck className="w-3 h-3 text-indigo-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                  <div className="flex-1 relative bg-slate-900/60 border border-slate-600 bg-slate-950 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full max-h-32 min-h-[44px] py-3 pl-4 pr-12 bg-transparent text-sm text-white focus:outline-none resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                      newMessage.trim() 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-600 bg-slate-950'
                    }`}
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
                <div className="text-[10px] text-slate-500 mt-2 text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded mx-0.5 font-sans border border-slate-600 bg-slate-950">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded mx-0.5 font-sans border border-slate-600 bg-slate-950">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded mx-0.5 font-sans border border-slate-600 bg-slate-950">Enter</kbd> for new line
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
