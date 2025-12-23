import React, { useState } from 'react';

interface GroupingProps {
  names: string[];
}

export const Grouping: React.FC<GroupingProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<string[][]>([]);

  const handleCreateGroups = () => {
    if (names.length === 0) return;
    
    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: string[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }
    setGroups(newGroups);
  };

  return (
    <div className="h-full flex flex-col p-8 overflow-hidden">
      {/* Controls */}
      <div className="flex justify-center items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">每組人數</label>
          <input 
            type="number" 
            min="1"
            max={names.length || 99}
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
            className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-2 w-32 text-center text-xl font-bold text-white focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        
        <button
          onClick={handleCreateGroups}
          disabled={names.length === 0}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-emerald-900/50 transition-all hover:scale-105 active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-t-4 active:border-b-0"
        >
          {groups.length > 0 ? "重新隨機分組" : "產生分組"}
        </button>
      </div>

      {names.length === 0 && (
         <div className="flex-1 flex items-center justify-center text-slate-600">
           <p>← 請先載入名單</p>
         </div>
      )}

      {/* Grid Display */}
      {groups.length > 0 && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {groups.map((group, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col animate-in fade-in zoom-in duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-2xl transition-all" 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-emerald-400">第 {idx + 1} 組</span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">{group.length} 人</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {group.map((member, mIdx) => (
                    <div key={mIdx} className="text-slate-200 font-medium border-b border-slate-700/50 last:border-0 pb-1 last:pb-0">
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};