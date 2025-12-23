import React, { useState, useRef, useMemo } from 'react';

interface ImportListProps {
  onImport: (names: string[]) => void;
  stats: {
    total: number;
    remaining: number;
    winnerCount: number;
  };
}

const DEMO_NAMES = [
  "陳小明", "林美華", "張偉", "王志強", "李淑芬", "黃俊傑", "吳雅婷", "劉建國", "蔡秀英", "楊家豪",
  "許欣怡", "鄭建華", "謝惠雯", "郭志偉", "洪詩涵", "曾國強", "邱美玲", "廖家瑋", "賴亦珊", "周彥宏",
  "葉佩珊", "徐志明", "朱小雲", "孫偉柏", "何孟璇"
];

export const ImportList: React.FC<ImportListProps> = ({ onImport, stats }) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze the input text for duplicates
  const analyzedData = useMemo(() => {
    const rawLines = inputText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const seen = new Set<string>();
    const result: { name: string; isDuplicate: boolean; id: number }[] = [];
    
    rawLines.forEach((name, idx) => {
      const isDuplicate = seen.has(name);
      seen.add(name);
      result.push({ name, isDuplicate, id: idx });
    });

    return result;
  }, [inputText]);

  const duplicateCount = analyzedData.filter(d => d.isDuplicate).length;
  const uniqueCount = analyzedData.length - duplicateCount;

  // Load the final list into the App
  const handleConfirmImport = () => {
    const uniqueNames = Array.from(new Set(analyzedData.map(d => d.name)));
    if (uniqueNames.length > 0) {
      if (stats.total > 0) {
        if (!window.confirm("載入新名單將會開始一個全新的活動，目前的抽獎進度將被覆蓋。確定要繼續嗎？")) {
          return;
        }
      }
      onImport(uniqueNames);
      setIsOpen(false);
      setInputText('');
    } else {
      alert("沒有有效的名單！");
    }
  };

  // One-click remove duplicates
  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(analyzedData.map(d => d.name)));
    setInputText(uniqueNames.join('\n'));
  };

  const handleDemoLoad = () => {
    setInputText(DEMO_NAMES.join('\n'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Stats Panel */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 text-center">
          <div className="text-xs text-slate-400 font-semibold">剩餘人數</div>
          <div className="text-2xl font-bold text-white">{stats.remaining}</div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 text-center">
          <div className="text-xs text-slate-400 font-semibold">中獎人數</div>
          <div className="text-2xl font-bold text-amber-400">{stats.winnerCount}</div>
        </div>
        <div className="col-span-2 bg-slate-700/30 p-2 rounded border border-slate-700 text-center flex justify-between px-4">
          <span className="text-xs text-slate-500">總載入人數</span>
          <span className="text-xs font-mono text-slate-300">{stats.total}</span>
        </div>
      </div>

      {/* Accordion Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        <span>名單管理</span>
        <span>{isOpen ? '收起 −' : '展開 +'}</span>
      </button>

      {/* Import Controls */}
      {isOpen && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handleDemoLoad}
              className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs border border-emerald-600/50 rounded transition-colors"
            >
              載入示範名單
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs border border-slate-600 rounded transition-colors"
            >
              上傳 CSV/TXT
            </button>
            <input 
              type="file" 
              accept=".csv,.txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              名單編輯 (每行一個名字)
            </label>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-600"
              placeholder="貼上名單..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Analysis & Preview */}
          {analyzedData.length > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">
                  總計: {analyzedData.length} | 重複: <span className={duplicateCount > 0 ? "text-red-400 font-bold" : "text-slate-400"}>{duplicateCount}</span>
                </span>
                {duplicateCount > 0 && (
                  <button 
                    onClick={handleRemoveDuplicates}
                    className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded hover:bg-red-900/50 transition-colors border border-red-900/50"
                  >
                    一鍵移除重複
                  </button>
                )}
              </div>
              
              {/* Scrollable Preview List */}
              <div className="h-24 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {analyzedData.map((item) => (
                  <div key={item.id} className={`flex justify-between text-xs px-2 py-1 rounded ${item.isDuplicate ? 'bg-red-900/20 text-red-300' : 'text-slate-300 odd:bg-slate-800/50'}`}>
                    <span>{item.name}</span>
                    {item.isDuplicate && <span className="text-[10px] bg-red-500/20 px-1 rounded text-red-400">重複</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmImport}
            disabled={analyzedData.length === 0}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/50"
          >
            {analyzedData.length === 0 ? "請先輸入名單" : `確認匯入 ${uniqueCount} 筆名單`}
          </button>
        </div>
      )}
    </div>
  );
};