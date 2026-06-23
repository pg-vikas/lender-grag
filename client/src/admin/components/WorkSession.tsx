import { useState, useEffect } from 'react';

export function WorkSession() {
  const [status, setStatus] = useState<'stopped' | 'running'>('stopped');
  const [firstClockIn, setFirstClockIn] = useState<Date | null>(null);
  const [lastClockIn, setLastClockIn] = useState<Date | null>(null);
  const [lastClockOut, setLastClockOut] = useState<Date | null>(null);
  
  const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Midnight reset check based on firstClockIn
      if (firstClockIn && now.getDate() !== firstClockIn.getDate()) {
        setStatus('stopped');
        setFirstClockIn(null);
        setLastClockIn(null);
        setLastClockOut(null);
        setTotalWorkedSeconds(0);
        setCurrentSessionSeconds(0);
        setTotalBreakSeconds(0);
        return;
      }

      if (status === 'running' && lastClockIn) {
        setCurrentSessionSeconds(Math.floor((now.getTime() - lastClockIn.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status, lastClockIn, firstClockIn]);

  const handleClockIn = () => {
    const now = new Date();
    if (!firstClockIn) {
      setFirstClockIn(now);
    }
    
    if (lastClockOut) {
      setTotalBreakSeconds(prev => prev + Math.floor((now.getTime() - lastClockOut.getTime()) / 1000));
    }
    
    setLastClockIn(now);
    setStatus('running');
    setLastClockOut(null);
    setCurrentSessionSeconds(0);
  };

  const handleClockOut = () => {
    const now = new Date();
    setLastClockOut(now);
    setStatus('stopped');
    setTotalWorkedSeconds(prev => prev + currentSessionSeconds);
    setCurrentSessionSeconds(0);
  };

  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const displayWorkedTime = totalWorkedSeconds + (status === 'running' ? currentSessionSeconds : 0);

  return (
    <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-8 mb-6 shadow-sm border border-white/10 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="min-w-[150px]">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Work Session</h2>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status === 'running' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-slate-400 border-slate-600/50 bg-slate-800/50'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
              {status === 'running' ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center py-4 md:py-0">
          <div className="text-4xl md:text-5xl font-bold text-white tracking-tight tabular-nums drop-shadow-md">
            {formatDuration(displayWorkedTime)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right min-w-[150px]">
          <div className="text-sm text-slate-300">
            <span className="text-slate-500 mr-2">Current session:</span> 
            <span className="font-mono tabular-nums">{formatDuration(currentSessionSeconds)}</span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-500 mr-2">Breaks today:</span> 
            <span className="font-mono tabular-nums">{formatDuration(totalBreakSeconds)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase mb-2">Clock In</div>
          <div className="text-2xl font-bold text-white mb-1 tracking-tight">
            {lastClockIn ? lastClockIn.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit'}) : '--:--:--'}
          </div>
          <div className="text-sm text-slate-400">
            {lastClockIn ? lastClockIn.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase mb-2">Clock Out</div>
          <div className="text-2xl font-bold text-white mb-1 tracking-tight">
            {lastClockOut ? lastClockOut.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit'}) : '--:--:--'}
          </div>
          <div className="text-sm text-slate-400">
            {lastClockOut ? lastClockOut.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleClockIn}
          disabled={status === 'running'}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
            status === 'running' 
              ? 'bg-emerald-500/10 text-emerald-500/50 cursor-not-allowed border border-emerald-500/10' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          CLOCK IN
        </button>
        <button 
          onClick={handleClockOut}
          disabled={status === 'stopped'}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
            status === 'stopped' 
              ? 'bg-rose-500/10 text-rose-500/50 cursor-not-allowed border border-rose-500/10' 
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
          }`}
        >
          CLOCK OUT
        </button>
      </div>
    </div>
  );
}