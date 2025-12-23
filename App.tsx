import React, { useState, useCallback } from 'react';
import { ImportList } from './components/ImportList';
import { Lottery } from './components/Lottery';
import { Grouping } from './components/Grouping';

const App: React.FC = () => {
  // --- Core State ---
  const [allNames, setAllNames] = useState<string[]>([]);
  const [remainingNames, setRemainingNames] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  
  // View Mode: 'lottery' or 'grouping'
  const [currentTab, setCurrentTab] = useState<'lottery' | 'grouping'>('lottery');

  // --- Actions ---

  // Load new list (This is the ONLY way to start fresh, essentially a new event)
  const handleImport = useCallback((names: string[]) => {
    setAllNames(names);
    setRemainingNames(names);
    setWinners([]);
  }, []);

  // Execute the logic to pick a winner (One way only)
  const handleDraw = useCallback(() => {
    setRemainingNames((prevRemaining) => {
      if (prevRemaining.length === 0) return prevRemaining;

      // Pick random index
      const randomIndex = Math.floor(Math.random() * prevRemaining.length);
      const winnerName = prevRemaining[randomIndex];

      // Remove from remaining
      const newRemaining = [...prevRemaining];
      newRemaining.splice(randomIndex, 1);

      // Add to winners
      setWinners((prevWinners) => [...prevWinners, winnerName]);

      return newRemaining;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar: Controls & Stats */}
      <aside className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-700 bg-slate-900/50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tighter">
            幸運抽獎系統
          </h1>
          <p className="text-xs text-slate-400 mt-1 tracking-widest">活動控制中心</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ImportList 
            onImport={handleImport} 
            stats={{
              total: allNames.length,
              remaining: remainingNames.length,
              winnerCount: winners.length
            }}
          />
        </div>
        
        {/* Footer info */}
        <div className="p-4 text-center text-slate-600 text-xs border-t border-slate-700">
          準備就緒
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 relative flex flex-col bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        
        {/* Mode Switcher Tabs */}
        <div className="flex justify-center p-4 gap-4 z-30">
          <button
            onClick={() => setCurrentTab('lottery')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-200 shadow-lg ${
              currentTab === 'lottery'
                ? 'bg-blue-600 text-white shadow-blue-900/50 scale-105'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            抽獎模式
          </button>
          <button
            onClick={() => setCurrentTab('grouping')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-200 shadow-lg ${
              currentTab === 'grouping'
                ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-105'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            分組模式
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {currentTab === 'lottery' ? (
            <Lottery 
              remainingNames={remainingNames}
              winners={winners}
              onDraw={handleDraw}
              hasLoadedNames={allNames.length > 0}
            />
          ) : (
            <Grouping names={allNames} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;