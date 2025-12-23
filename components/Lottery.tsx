import React, { useState, useEffect, useRef } from 'react';

interface LotteryProps {
  remainingNames: string[];
  winners: string[];
  onDraw: () => void;
  hasLoadedNames: boolean;
}

export const Lottery: React.FC<LotteryProps> = ({ remainingNames, winners, onDraw, hasLoadedNames }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingName, setRollingName] = useState('準備中');
  const timerRef = useRef<number | null>(null);

  // Get the most recent winner
  const currentWinner = winners.length > 0 ? winners[winners.length - 1] : null;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startDraw = () => {
    if (remainingNames.length === 0) return;

    setIsRolling(true);
    
    // Fast rolling animation
    timerRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingNames.length);
      setRollingName(remainingNames[randomIndex]);
    }, 50);

    // Stop animation and pick actual winner after 1.5s
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      onDraw();
      setIsRolling(false);
    }, 1500);
  };

  // Determine displayText
  let displayText = "等待抽獎";
  if (!hasLoadedNames) {
    displayText = "請先載入名單";
  } else if (isRolling) {
    displayText = rollingName;
  } else if (currentWinner) {
    displayText = currentWinner;
  } else if (remainingNames.length === 0 && winners.length > 0) {
    displayText = "抽獎結束";
  }

  // Helper text state
  const isFinished = hasLoadedNames && remainingNames.length === 0 && winners.length > 0;
  const canDraw = hasLoadedNames && remainingNames.length > 0 && !isRolling;

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        
        {/* The Reveal Box */}
        <div className="relative mb-16 w-full max-w-5xl text-center">
          {/* Glow Effect */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-3xl rounded-full transition-opacity duration-500 ${isRolling ? 'opacity-100' : 'opacity-20'}`}></div>
          
          {currentWinner && !isRolling && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/10 blur-3xl rounded-full animate-pulse"></div>
          )}

          {/* Text Display */}
          <h1 
            className={`
              relative z-10 font-black tracking-tight leading-none break-words select-none transition-all duration-200
              ${isRolling ? 'text-7xl md:text-9xl text-slate-300 blur-[1px]' : ''}
              ${!isRolling && currentWinner ? 'text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 drop-shadow-2xl scale-110' : ''}
              ${!isRolling && !currentWinner ? 'text-5xl md:text-7xl text-slate-700' : ''}
            `}
          >
            {displayText}
          </h1>

          {!isRolling && currentWinner && (
            <div className="mt-8 text-amber-500/80 text-2xl font-bold tracking-widest uppercase animate-bounce">
              恭喜中獎！
            </div>
          )}
        </div>

        {/* The Big Button */}
        <div className="z-20 flex flex-col items-center gap-4">
          <button
            onClick={startDraw}
            disabled={!canDraw}
            className={`
              group relative px-16 py-6 rounded-full text-3xl md:text-4xl font-black tracking-wider transition-all duration-200 shadow-2xl
              ${!hasLoadedNames 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border-4 border-slate-700 opacity-50'
                : isFinished
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-4 border-slate-700'
                  : isRolling
                    ? 'bg-indigo-600 text-white cursor-wait scale-95 opacity-90 border-4 border-indigo-400/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 border-4 border-blue-400/30 hover:shadow-blue-500/50'
              }
            `}
          >
            {isRolling ? "抽獎中..." : isFinished ? "名單已空" : "抽出得主"}
          </button>
          
          {!hasLoadedNames && (
            <p className="text-slate-500 text-sm animate-pulse">
              ← 請先在左側面板載入名單
            </p>
          )}

          {isFinished && (
            <p className="text-red-400 font-bold text-lg bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/50">
              名單已抽完，無法歸零或重抽
            </p>
          )}
        </div>
      </div>

      {/* History Panel */}
      <div className="h-32 md:h-40 bg-slate-900/80 backdrop-blur border-t border-slate-800 p-4 flex flex-col">
        <h3 className="text-slate-500 text-xs font-bold mb-3 flex items-center gap-2">
          <span>中獎名單紀錄</span>
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">{winners.length}</span>
        </h3>
        
        <div className="flex-1 flex gap-3 overflow-x-auto items-center pb-2 custom-scrollbar">
          {winners.length === 0 ? (
            <span className="text-slate-700 italic text-sm">尚未產生中獎者...</span>
          ) : (
            winners.slice().reverse().map((name, idx) => (
              <div 
                key={`${name}-${idx}`} 
                className={`
                  flex-shrink-0 px-6 py-3 rounded-lg border flex items-center gap-3 shadow-sm
                  ${idx === 0 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                  }
                `}
              >
                <span className="text-xs font-mono opacity-50">#{winners.length - idx}</span>
                <span className="font-bold text-lg whitespace-nowrap">{name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};