import { useState } from "react";
import { Search, Filter, Plus, Users as UsersIcon, Shield, Edit, X, Trash2, Eye, Lock, Pin, Activity } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

export default function UsersPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pinnedUsers, setPinnedUsers] = useState<Set<number>>(new Set());

  const togglePin = (index: number) => {
    setPinnedUsers(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const [users, setUsers] = useState([
    { id: 1, name: "Neeraj Kumar", email: "neeraj@pinkgorilla.com", role: "Administrator", status: "Active", lastLogin: "Just now", phone: "+1 555 123 4567", dateAdded: "15-08-2025" },
    { id: 2, name: "Vinayak Sharma", email: "vinayak@pinkgorilla.com", role: "Manager", status: "Active", lastLogin: "2 hours ago", phone: "---", dateAdded: "20-09-2025" },
    { id: 3, name: "Maria Christina", email: "maria@pinkgorilla.com", role: "Support Agent", status: "Active", lastLogin: "Yesterday", phone: "+1 555 987 6543", dateAdded: "10-10-2025" },
    { id: 4, name: "Chayan Alavi", email: "chayan@pinkgorilla.com", role: "Developer", status: "Offline", lastLogin: "3 days ago", phone: "---", dateAdded: "05-11-2025" },
  ]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    designation: 'HR',
    password: '',
    twilioPhone: '',
    role: 'Administrator',
    timezone: 'America/Denver'
  });

  const handleAddUserSubmit = () => {
    // Combine first and last name for the display
    const fullName = `${newUser.firstName} ${newUser.lastName}`.trim() || 'New User';
    
    const userToAdd = {
      id: Date.now(),
      name: fullName,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      lastLogin: "Just now",
      phone: `${newUser.phoneCode} ${newUser.phone}`.trim() || "---",
      dateAdded: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
    };
    
    setUsers([...users, userToAdd]);
    setIsAddUserModalOpen(false);
    
    // Reset form
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phoneCode: '+1',
      phone: '',
      designation: 'HR',
      password: '',
      twilioPhone: '',
      role: 'Administrator',
      timezone: 'America/Denver'
    });
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const usersList = [
    { name: "Neeraj Kumar", email: "neeraj@pinkgorilla.com", role: "Administrator", status: "Active", lastLogin: "Just now", phone: "+1 555 123 4567", dateAdded: "15-08-2025" },
    { name: "Vinayak Sharma", email: "vinayak@pinkgorilla.com", role: "Manager", status: "Active", lastLogin: "2 hours ago", phone: "---", dateAdded: "20-09-2025" },
    { name: "Maria Christina", email: "maria@pinkgorilla.com", role: "Support Agent", status: "Active", lastLogin: "Yesterday", phone: "+1 555 987 6543", dateAdded: "10-10-2025" },
    { name: "Chayan Alavi", email: "chayan@pinkgorilla.com", role: "Developer", status: "Offline", lastLogin: "3 days ago", phone: "---", dateAdded: "05-11-2025" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = !appliedSearchQuery || 
      user.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(appliedSearchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Users" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[22px] text-white font-semibold">User Management</h1>
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">Total Users</p>
                   <h3 className="text-3xl font-bold text-white">12</h3>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                 </div>
              </div>
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">Administrators</p>
                   <h3 className="text-3xl font-bold text-white">3</h3>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                 </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20  overflow-hidden border border-white/10">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 backdrop-blur-xl/50">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search users" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-all shadow-sm hover:shadow"
                  >
                    Filter <Filter className="w-3.5 h-3.5" />
                  </button>
                  {appliedSearchQuery && (
                    <button 
                      onClick={handleReset}
                      className="px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-900/40 backdrop-blur-xl border-b border-white/10">
                    <tr>
                      <th className="py-4 px-6 font-semibold text-slate-300">Name</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Role</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Status</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Last Login</th>
                      <th className="py-4 px-6 font-semibold text-slate-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No users found matching "{appliedSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                    filteredUsers.map((user, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 backdrop-blur-xl/50/50 transition-colors bg-slate-900/40 backdrop-blur-xl">
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
                               {user.name.charAt(0)}
                             </div>
                             <div>
                               <div 
                                 className="font-semibold text-white cursor-pointer hover:text-indigo-400 transition-colors"
                                 onClick={() => { setSelectedUser(user); setIsActivityModalOpen(true); }}
                               >
                                 {user.name}
                               </div>
                               <div className="text-xs text-slate-400">{user.email}</div>
                             </div>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                           <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium text-xs border border-white/10">
                             {user.role}
                           </span>
                        </td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                              ${user.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                             {user.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{user.lastLogin}</td>
                        <td className="py-4 px-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setSelectedUser(user); setIsActivityModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group/tooltip relative" 
                              >
                                 <Eye className="w-4 h-4" />
                                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">View Activity</span>
                              </button>
                              <button 
                                onClick={() => { setSelectedUser(user); setIsEditUserModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group/tooltip relative" 
                              >
                                 <Edit className="w-4 h-4" />
                                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Edit User</span>
                              </button>
                              <button 
                                onClick={() => { setSelectedUser(user); setIsPasswordModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors group/tooltip relative" 
                              >
                                 <Lock className="w-4 h-4" />
                                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Update Password</span>
                              </button>
                              <button 
                                onClick={() => togglePin(user.id)}
                                className={`p-2 rounded-lg transition-colors group/tooltip relative ${pinnedUsers.has(user.id) ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'}`}
                              >
                                 <Pin className="w-4 h-4" />
                                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">{pinnedUsers.has(user.id) ? 'Unpin User' : 'Pin User'}</span>
                              </button>
                              <button 
                                onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors group/tooltip relative" 
                              >
                                 <Trash2 className="w-4 h-4" />
                                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Delete User</span>
                              </button>
                           </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Create A New User</h2>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name*</label>
                  <input 
                    type="text" 
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Jordan"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Peterson"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address*</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="vikas@pinkgorillasoftware.com"
                    className="w-full px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <div className="flex">
                    <select 
                      value={newUser.phoneCode}
                      onChange={(e) => setNewUser({...newUser, phoneCode: e.target.value})}
                      className="px-3 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 border-r-0 rounded-l-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all w-20"
                    >
                      <option>+1</option>
                      <option>+44</option>
                      <option>+91</option>
                    </select>
                    <input 
                      type="tel" 
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-r-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
                  {newUser.designation === 'Custom' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter custom designation"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        value={(newUser as any).customDesignation || ''}
                        onChange={(e) => setNewUser({ ...newUser, customDesignation: e.target.value } as any)}
                      />
                      <button
                        onClick={() => setNewUser({ ...newUser, designation: 'HR / Human Resources' })}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors border border-slate-600 bg-slate-950 shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={newUser.designation}
                      onChange={(e) => setNewUser({...newUser, designation: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="CEO / President / Founder">CEO / President / Founder</option>
                      <option value="CTO / Chief Technology Officer">CTO / Chief Technology Officer</option>
                      <option value="CFO / Chief Financial Officer">CFO / Chief Financial Officer</option>
                      <option value="COO / Chief Operating Officer">COO / Chief Operating Officer</option>
                      <option value="Vice President">Vice President</option>
                      <option value="Director">Director</option>
                      <option value="Manager">Manager</option>
                      <option value="HR / Human Resources">HR / Human Resources</option>
                      <option value="Sales Representative">Sales Representative</option>
                      <option value="Account Executive">Account Executive</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Software Developer">Software Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Customer Support / Success">Customer Support / Success</option>
                      <option value="Administrator / Office Manager">Administrator / Office Manager</option>
                      <option value="Custom">Custom...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password*</label>
                  <input 
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twilio Phone</label>
                  <input 
                    type="tel" 
                    value={newUser.twilioPhone}
                    onChange={(e) => setNewUser({...newUser, twilioPhone: e.target.value})}
                    placeholder=""
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role*</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Support Agent</option>
                    <option>Developer</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <select 
                    value={newUser.timezone}
                    onChange={(e) => setNewUser({...newUser, timezone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    <option>America/Denver</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleAddUserSubmit}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete User</h2>
            <p className="text-[15px] text-slate-300 mb-8 text-center">
              Are you sure you want to delete {selectedUser?.name}?
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteUser} 
                className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name*</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser?.name?.split(' ')[0]}
                    placeholder="Jordan"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue={selectedUser?.name?.split(' ').slice(1).join(' ')}
                    placeholder="Peterson"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address*</label>
                  <input 
                    type="email" 
                    defaultValue={selectedUser?.email}
                    placeholder="vikas@pinkgorillasoftware.com"
                    className="w-full px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <div className="flex">
                    <select 
                      defaultValue={selectedUser?.phone?.split(' ')[0] || '+1'}
                      className="px-3 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 border-r-0 rounded-l-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all w-20"
                    >
                      <option>+1</option>
                      <option>+44</option>
                      <option>+91</option>
                    </select>
                    <input 
                      type="tel" 
                      defaultValue={selectedUser?.phone?.split(' ').slice(1).join(' ') || ''}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-r-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
                  <select 
                    defaultValue="HR / Human Resources"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    <option value="CEO / President / Founder">CEO / President / Founder</option>
                    <option value="CTO / Chief Technology Officer">CTO / Chief Technology Officer</option>
                    <option value="CFO / Chief Financial Officer">CFO / Chief Financial Officer</option>
                    <option value="COO / Chief Operating Officer">COO / Chief Operating Officer</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Director">Director</option>
                    <option value="Manager">Manager</option>
                    <option value="HR / Human Resources">HR / Human Resources</option>
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Account Executive">Account Executive</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Software Developer">Software Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Customer Support / Success">Customer Support / Success</option>
                    <option value="Administrator / Office Manager">Administrator / Office Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password*</label>
                  <input 
                    type="password" 
                    defaultValue="********"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twilio Phone</label>
                  <input 
                    type="tel" 
                    placeholder=""
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role*</label>
                  <select 
                    defaultValue={selectedUser?.role}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Support Agent</option>
                    <option>Developer</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <select 
                    defaultValue="America/Denver"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    <option>America/Denver</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  // In a real app, we'd update the user state here
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Update Password</h2>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password*</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password*</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Activity Modal (Reusing existing structure for consistency) */}
      {isActivityModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsActivityModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 overflow-hidden shadow-sm">
                  <span className="text-4xl font-bold">{selectedUser.name.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-medium text-[#e2e8f0]">{selectedUser.name}'s Activity</h2>
                <p className="text-slate-400 text-[15px]">{selectedUser.email}</p>
              </div>
              
              <div className="h-[1px] w-full bg-slate-700 mb-8"></div>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <h3 className="text-slate-400 font-medium mb-1">Phone</h3>
                  <p className="text-slate-200">{selectedUser.phone || '---'}</p>
                </div>
                <div>
                  <h3 className="text-slate-400 font-medium mb-1">Designation</h3>
                  <p className="text-slate-200">{selectedUser.role}</p>
                </div>
                <div>
                  <h3 className="text-slate-400 font-medium mb-1">Date Added</h3>
                  <p className="text-slate-200">{selectedUser.dateAdded || '---'}</p>
                </div>
                <div>
                  <h3 className="text-slate-400 font-medium mb-1">Last Seen</h3>
                  <p className="text-slate-200">{selectedUser.lastLogin}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-600 bg-slate-950">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Logged in to the system</p>
                      <span className="text-xs text-slate-500">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-600 bg-slate-950">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Edit className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Updated profile settings</p>
                      <span className="text-xs text-slate-500">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
