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

  // Execute the logic to pick a winner
  const handleDraw = useCallback(() => {
    if (remainingNames.length === 0) return;

    // Pick random index
    const randomIndex = Math.floor(Math.random() * remainingNames.length);
    const winnerName = remainingNames[randomIndex];

    // Update both states
    setRemainingNames((prev) => {
      const newHelper = [...prev];
      newHelper.splice(randomIndex, 1);
      return newHelper;
    });

    setWinners((prev) => [...prev, winnerName]);
  }, [remainingNames]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">

      {/* Header & Instructions */}
      <header className="bg-slate-800 border-b border-slate-700 pt-8 pb-6 px-4 text-center shadow-lg relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tighter mb-3">
          幸運抽獎系統
        </h1>
        <p className="text-slate-400 text-base md:text-lg mb-6 max-w-2xl mx-auto">
          簡單、公平的抽獎工具。匯入名單，立即開始抽出幸運得主！
        </p>

        {/* Stepper */}
        <div className="flex justify-center items-center gap-2 md:gap-4 text-sm md:text-base font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            匯入名單
          </div>
          <div className="h-px w-8 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            開始抽獎
          </div>
          <div className="h-px w-8 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            查看結果
          </div>
        </div>

        {/* Mode Switcher (Secondary) */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-slate-900/50 p-1 rounded-lg flex border border-slate-700">
            <button
              onClick={() => setCurrentTab('lottery')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${currentTab === 'lottery' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
            >
              抽獎
            </button>
            <button
              onClick={() => setCurrentTab('grouping')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${currentTab === 'grouping' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
            >
              分組
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">

        {/* Step 1: Import */}
        <section className={`transition-all duration-500 ${allNames.length > 0 ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Step 1</span>
            <h2 className="text-xl font-bold text-slate-200">準備名單</h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700/50">
            <ImportList
              onImport={handleImport}
              stats={{
                total: allNames.length,
                remaining: remainingNames.length,
                winnerCount: winners.length
              }}
            />
          </div>
        </section>

        {/* Step 2 & 3: Action Area */}
        {currentTab === 'lottery' && (
          <section className="animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Step 2 & 3</span>
              <h2 className="text-xl font-bold text-slate-200">進行抽獎</h2>
            </div>

            <div className="bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px]">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-50 pointer-events-none"></div>

              <Lottery
                remainingNames={remainingNames}
                winners={winners}
                onDraw={handleDraw}
                hasLoadedNames={allNames.length > 0}
              />
            </div>
          </section>
        )}

        {currentTab === 'grouping' && (
          <section className="animate-in slide-in-from-bottom-4 fade-in duration-700">
            <Grouping names={allNames} />
          </section>
        )}

      </main>

      <footer className="text-center p-8 text-slate-600 text-xs">
        HR Helper &copy; 2026
      </footer>
    </div>
  );
};

export default App;