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
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left: Input Text Area */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-300">
          輸入或貼上名單 (每行一個名字)
        </label>

        <textarea
          className="w-full h-48 bg-slate-900/50 border-2 border-slate-600 rounded-xl p-4 text-base text-white focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all placeholder-slate-600"
          placeholder={`例如：\n王小明\n李大華\n張美丽...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleDemoLoad}
            className="flex-1 py-3 px-4 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold border-2 border-emerald-600/50 border-dashed rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>✨ 快試試：載入示範名單</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors whitespace-nowrap"
          >
            上傳檔案
          </button>
          <input type="file" accept=".csv,.txt" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </div>
      </div>

      {/* Right: Analysis & Confirm */}
      <div className="space-y-6 flex flex-col h-full justify-between">

        {/* Preview Panel */}
        <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700 flex-1 flex flex-col min-h-[140px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-400 font-medium">
              名單預覽
            </span>
            <div className="text-xs space-x-2">
              <span className="text-slate-500">總數: {analyzedData.length}</span>
              {duplicateCount > 0 && <span className="text-red-400 font-bold">重複: {duplicateCount}</span>}
            </div>
          </div>

          {analyzedData.length > 0 ? (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[150px] space-y-1">
              {analyzedData.map((item) => (
                <div key={item.id} className={`flex justify-between text-sm px-3 py-1.5 rounded-md ${item.isDuplicate ? 'bg-red-900/20 text-red-300' : 'text-slate-300 odd:bg-slate-800/30'}`}>
                  <span>{item.name}</span>
                  {item.isDuplicate && <span className="text-[10px] bg-red-500/20 px-1 rounded text-red-400">重複</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm italic border-2 border-dashed border-slate-700/50 rounded-lg">
              尚未輸入資料
            </div>
          )}

          {duplicateCount > 0 && (
            <button onClick={handleRemoveDuplicates} className="mt-3 w-full py-1.5 text-xs text-red-400 hover:text-red-300 hover:underline">
              移除重複項目
            </button>
          )}
        </div>

        {/* Big Confirm Button */}
        <button
          onClick={handleConfirmImport}
          disabled={analyzedData.length === 0}
          className={`
            w-full py-4 rounded-2xl font-black text-lg tracking-wide shadow-xl transition-all
            ${analyzedData.length === 0
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] hover:shadow-blue-500/25 ring-4 ring-blue-500/10'
            }
          `}
        >
          {analyzedData.length === 0 ? "請先輸入或載入名單" : "確認匯入並繼續 →"}
        </button>

      </div>
    </div>
  );
};