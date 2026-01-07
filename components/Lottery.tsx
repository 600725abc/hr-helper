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
  let displayText = "等待開獎";
  if (!hasLoadedNames) {
    displayText = "請先匯入名單 (Step 1)";
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
    <div className="flex flex-col h-full w-full relative">

      {/* 1. Control Area (The Button) - Top Dominant */}
      <div className="z-20 flex flex-col items-center justify-center pt-12 pb-8">
        <button
          onClick={startDraw}
          disabled={!canDraw}
          className={`
            group relative px-20 py-8 rounded-full text-4xl md:text-5xl font-black tracking-wider transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.5)]
            ${!hasLoadedNames
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border-4 border-slate-700 opacity-50 grayscale'
              : isFinished
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-4 border-slate-700'
                : isRolling
                  ? 'bg-indigo-600 text-white cursor-wait scale-95 opacity-90 border-4 border-indigo-400/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-110 hover:-translate-y-1 active:scale-95 border-4 border-white/20 hover:shadow-[0_0_80px_rgba(59,130,246,0.6)]'
            }
          `}
        >
          {isRolling ? "抽獎中..." : isFinished ? "名單已空" : "🔥 開始抽獎"}

          {/* Ripple effect hint */}
          {!isRolling && canDraw && (
            <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping -z-10"></span>
          )}
        </button>

        {!hasLoadedNames && (
          <p className="mt-4 text-slate-500 text-sm font-medium animate-pulse">
            ☝️ 請先在上方完成 Step 1
          </p>
        )}
      </div>

      {/* 2. Result Area (The Stage) - Below */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-[300px] relative z-10">

        <div className="relative w-full text-center">
          {/* Glow Effect */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150px] bg-blue-500/10 blur-3xl rounded-full transition-opacity duration-500 ${isRolling ? 'opacity-100' : 'opacity-20'}`}></div>

          {/* Winner Label or Current Status */}
          <h2 className="text-sm font-bold text-slate-500 mb-4 tracking-[0.2em] uppercase min-h-[1.5em]">
            {!isRolling && currentWinner ? (
              <span className="text-amber-400 text-xl md:text-2xl font-bold tracking-[0.3em] uppercase winner-label-enter block">
                🎉 恭喜中獎
              </span>
            ) : "Current Result"}
          </h2>

          {/* The Name */}
          <div className={`
             relative z-10 transition-all duration-200 py-4
             ${isRolling ? 'scale-110 blur-[1px]' : ''}
           `}>
            {/* If winner exists and not rolling, show BIG animated winner name */}
            {!isRolling && currentWinner ? (
              <div className="winner-name-enter">
                <span className="font-black text-7xl md:text-9xl leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_10px_30px_rgba(251,191,36,0.5)]">
                  {currentWinner}
                </span>
              </div>
            ) : (
              /* Normal display for rolling / waiting */
              <span className="font-black text-6xl md:text-8xl leading-tight text-slate-700">
                {isRolling ? rollingName : (!currentWinner ? displayText : '—')}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* 3. History Ticker - Bottom */}
      <div className="bg-slate-900/80 backdrop-blur border-t border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-slate-400">最新中獎</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {winners.length === 0 ? (
            <div className="text-slate-700 text-xs italic px-2">等待第一位幸運兒...</div>
          ) : (
            winners.slice().reverse().map((name, idx) => (
              <div
                key={`${name}-${idx}`}
                className={`
                  flex-shrink-0 px-4 py-2 rounded border flex items-center gap-2
                  ${idx === 0
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                  }
                `}
              >
                <span className="text-xs font-mono opacity-50">#{winners.length - idx}</span>
                <span className="font-bold whitespace-nowrap">{name}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};