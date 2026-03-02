import React, { useState, useEffect, useCallback, useRef } from 'react';

// ----------------------------------------------------------------------
// 1. 資料設定
// ----------------------------------------------------------------------

const ZHUYIN_MAP = {
  'Backquote': '巷', 'Digit1': 'ㄅ', 'Digit2': 'ㄉ', 'Digit3': 'ˇ', 'Digit4': 'ˋ', 'Digit5': 'ㄓ',
  'Digit6': 'ˊ', 'Digit7': '˙', 'Digit8': 'ㄚ', 'Digit9': 'ㄞ', 'Digit0': 'ㄢ', 'Minus': 'ㄦ', 
  'KeyQ': 'ㄆ', 'KeyW': 'ㄊ', 'KeyE': 'ㄍ', 'KeyR': 'ㄐ', 'KeyT': 'ㄔ',
  'KeyY': 'ㄗ', 'KeyU': 'ㄧ', 'KeyI': 'ㄛ', 'KeyO': 'ㄟ', 'KeyP': 'ㄣ',
  'KeyA': 'ㄇ', 'KeyS': 'ㄋ', 'KeyD': 'ㄎ', 'KeyF': 'ㄑ', 'KeyG': 'ㄕ',
  'KeyH': 'ㄘ', 'KeyJ': 'ㄨ', 'KeyK': 'ㄜ', 'KeyL': 'ㄠ', 'Semicolon': 'ㄤ',
  'KeyZ': 'ㄈ', 'KeyX': 'ㄌ', 'KeyC': 'ㄏ', 'KeyV': 'ㄒ', 'KeyB': 'ㄖ',
  'KeyN': 'ㄙ', 'KeyM': 'ㄩ', 'Comma': 'ㄝ', 'Period': 'ㄡ', 'Slash': 'ㄥ'
};

// 符號模式挑戰清單：包含英文組合鍵、功能鍵、以及「注音標點符號」
const SYMBOL_CHALLENGES = [
  // --- 英文 Shift 組合鍵 ---
  { code: 'Digit1', shift: true, label: '!', desc: '英文符號：驚嘆號' },
  { code: 'Digit2', shift: true, label: '@', desc: '英文符號：小老鼠 (At)' },
  { code: 'Digit3', shift: true, label: '#', desc: '英文符號：井字號' },
  { code: 'Digit4', shift: true, label: '$', desc: '英文符號：錢符號' },
  { code: 'Digit5', shift: true, label: '%', desc: '英文符號：百分比' },
  { code: 'Digit7', shift: true, label: '&', desc: '英文符號：And (和)' },
  { code: 'Digit8', shift: true, label: '*', desc: '英文符號：星號' },
  { code: 'Slash', shift: true, label: '?', desc: '英文符號：問號' },
  { code: 'Backquote', shift: true, label: '~', desc: '英文符號：波浪號' },

  // --- 注音標點符號練習 (重要教學點) ---
  { code: 'Comma', shift: false, label: '，', desc: '注音標點：全形逗號' },
  { code: 'Period', shift: false, label: '。', desc: '注音標點：全形句號' },
  { code: 'Quote', shift: false, label: '、', desc: '注音標點：頓號 (直式/橫式)' },
  { code: 'Semicolon', shift: false, label: '；', desc: '注音標點：全形分號' },
  { code: 'BracketLeft', shift: false, label: '「', desc: '注音標點：左引號' },
  { code: 'BracketRight', shift: false, label: '」', desc: '注音標點：右引號' },
  { code: 'Slash', shift: true, label: '？', desc: '注音標點：全形問號' },

  // --- 核心功能鍵 ---
  { code: 'ShiftLeft', shift: false, label: 'Shift', desc: '【功能】切換中英 或 組合鍵', hint: '請按左 Shift' },
  { code: 'CapsLock', shift: false, label: 'Caps', desc: '【功能】鎖定大寫 / 切換大小寫', hint: '請按 Caps Lock' },
];

const KEYBOARD_LAYOUT = [
  [{ code: 'Backquote', label: '`', shiftLabel: '~', width: 1 }, { code: 'Digit1', label: '1', shiftLabel: '!', width: 1 }, { code: 'Digit2', label: '2', shiftLabel: '@', width: 1 }, { code: 'Digit3', label: '3', shiftLabel: '#', width: 1 }, { code: 'Digit4', label: '4', shiftLabel: '$', width: 1 }, { code: 'Digit5', label: '5', shiftLabel: '%', width: 1 }, { code: 'Digit6', label: '6', shiftLabel: '^', width: 1 }, { code: 'Digit7', label: '7', shiftLabel: '&', width: 1 }, { code: 'Digit8', label: '8', shiftLabel: '*', width: 1 }, { code: 'Digit9', label: '9', shiftLabel: '(', width: 1 }, { code: 'Digit0', label: '0', shiftLabel: ')', width: 1 }, { code: 'Minus', label: '-', shiftLabel: '_', width: 1 }, { code: 'Equal', label: '=', shiftLabel: '+', width: 1 }, { code: 'Backspace', label: '←', width: 2 }],
  [{ code: 'Tab', label: 'Tab', width: 1.5 }, { code: 'KeyQ', label: 'Q', width: 1 }, { code: 'KeyW', label: 'W', width: 1 }, { code: 'KeyE', label: 'E', width: 1 }, { code: 'KeyR', label: 'R', width: 1 }, { code: 'KeyT', label: 'T', width: 1 }, { code: 'KeyY', label: 'Y', width: 1 }, { code: 'KeyU', label: 'U', width: 1 }, { code: 'KeyI', label: 'I', width: 1 }, { code: 'KeyO', label: 'O', width: 1 }, { code: 'KeyP', label: 'P', width: 1 }, { code: 'BracketLeft', label: '[', shiftLabel: '{', width: 1 }, { code: 'BracketRight', label: ']', shiftLabel: '}', width: 1 }, { code: 'Backslash', label: '\\', shiftLabel: '|', width: 1.5 }],
  [{ code: 'CapsLock', label: 'Caps', width: 1.8 }, { code: 'KeyA', label: 'A', width: 1 }, { code: 'KeyS', label: 'S', width: 1 }, { code: 'KeyD', label: 'D', width: 1 }, { code: 'KeyF', label: 'F', width: 1 }, { code: 'KeyG', label: 'G', width: 1 }, { code: 'KeyH', label: 'H', width: 1 }, { code: 'KeyJ', label: 'J', width: 1 }, { code: 'KeyK', label: 'K', width: 1 }, { code: 'KeyL', label: 'L', width: 1 }, { code: 'Semicolon', label: ';', shiftLabel: ':', width: 1 }, { code: 'Quote', label: "'", shiftLabel: '"', width: 1 }, { code: 'Enter', label: 'Enter', width: 2.2 }],
  [{ code: 'ShiftLeft', label: 'Shift', width: 2.4 }, { code: 'KeyZ', label: 'Z', width: 1 }, { code: 'KeyX', label: 'X', width: 1 }, { code: 'KeyC', label: 'C', width: 1 }, { code: 'KeyV', label: 'V', width: 1 }, { code: 'KeyB', label: 'B', width: 1 }, { code: 'KeyN', label: 'N', width: 1 }, { code: 'KeyM', label: 'M', width: 1 }, { code: 'Comma', label: ',', shiftLabel: '<', width: 1 }, { code: 'Period', label: '.', shiftLabel: '>', width: 1 }, { code: 'Slash', label: '/', shiftLabel: '?', width: 1 }, { code: 'ShiftRight', label: 'Shift', width: 2.6 }],
  [{ code: 'ControlLeft', label: 'Ctrl', width: 1.5 }, { code: 'MetaLeft', label: 'Win', width: 1.25 }, { code: 'AltLeft', label: 'Alt', width: 1.25 }, { code: 'Space', label: 'Space', width: 6.5 }, { code: 'AltRight', label: 'Alt', width: 1.25 }, { code: 'MetaRight', label: 'Fn', width: 1.25 }, { code: 'ControlRight', label: 'Ctrl', width: 1.5 }]
];

// 篩選純字鍵
const FLAT_LAYOUT = KEYBOARD_LAYOUT.flat();
const CHAR_KEYS_FOR_DRILL = FLAT_LAYOUT.filter(k => 
  k.code.startsWith('Key') || 
  k.code.startsWith('Digit') || 
  ['Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Backslash', 'Semicolon', 'Quote', 'Comma', 'Period', 'Slash', 'Backquote'].includes(k.code)
);

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState('EN'); 
  const [currentTask, setCurrentTask] = useState(null);
  const [score, setScore] = useState(0);
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [feedback, setFeedback] = useState({ text: '準備就緒，按空白鍵開始！', type: 'info' }); 
  const [pressedKeys, setPressedKeys] = useState(new Set()); 
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.0);
  const [lastRawCode, setLastRawCode] = useState('');

  const startTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);

  const handleModeChange = (mode) => {
    setGameMode(mode);
    stopGame();
    setFeedback({ text: `切換至：${mode === 'EN' ? '英文' : mode === 'ZH' ? '注音' : '符號'}`, type: 'info' });
  };

  const nextRound = useCallback(() => {
    let task = null;
    if (gameMode === 'SYMBOL') {
      const challenge = SYMBOL_CHALLENGES[Math.floor(Math.random() * SYMBOL_CHALLENGES.length)];
      task = { ...challenge };
    } else {
      const randomKey = CHAR_KEYS_FOR_DRILL[Math.floor(Math.random() * CHAR_KEYS_FOR_DRILL.length)];
      task = { code: randomKey.code, shift: false, label: randomKey.label, desc: '' };
    }
    setCurrentTask(task);
    setMistakesOnCurrent(0);
    setTimeLeft(10.0);
    startTimeRef.current = Date.now();
  }, [gameMode]);

  const startGame = useCallback(() => {
    setScore(0); setCombo(0); setIsPlaying(true);
    setFeedback({ text: '開始挑戰！', type: 'success' });
    nextRound();
  }, [nextRound]);

  const stopGame = useCallback(() => {
    setIsPlaying(false); setCurrentTask(null);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, []);

  const handleKeyDown = useCallback((e) => {
    // 攔截瀏覽器快捷鍵
    if (/^F\d+$/.test(e.code) || ['Tab', 'Space', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'].includes(e.code)) {
      e.preventDefault();
    }
    
    setLastRawCode(e.code);

    if (!isPlaying) { if (e.code === 'Space') startGame(); return; }
    
    setPressedKeys(prev => new Set(prev).add(e.code));
    if (!currentTask) return;

    let isCorrect = false;
    
    // 判定邏輯
    if (currentTask.code === 'ShiftLeft') {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') isCorrect = true;
    } else if (currentTask.code === 'CapsLock') {
        if (e.code === 'CapsLock') isCorrect = true;
    } else {
        if (e.code === currentTask.code) {
            if (currentTask.shift) {
                if (e.shiftKey) isCorrect = true;
                else {
                    setFeedback({ text: '請按住 Shift 再按！', type: 'warning' });
                    return;
                }
            } else {
                isCorrect = true;
            }
        }
    }

    if (isCorrect) {
      setScore(s => s + 100 + Math.max(0, Math.floor((2000 - (Date.now() - startTimeRef.current)) / 10)));
      setCombo(c => c + 1); setFeedback({ text: '正確!', type: 'success' });
      setTimeout(nextRound, 150);
    } else {
      const isModifier = ['Shift', 'Control', 'Alt', 'Meta'].some(m => e.key.includes(m));
      if (!isModifier) {
        setMistakesOnCurrent(m => {
          if (m >= 1) { 
            setScore(s => Math.max(0, s - 50)); 
            setFeedback({ text: '按錯了 (-50)', type: 'error' }); 
            return m + 1; 
          }
          setFeedback({ text: '小心！', type: 'warning' }); 
          setCombo(0); 
          return 1;
        });
      }
    }
  }, [isPlaying, currentTask, mistakesOnCurrent, nextRound, startGame]);

  const handleKeyUp = useCallback((e) => { 
    setPressedKeys(prev => { 
      const n = new Set(prev); 
      n.delete(e.code); 
      return n; 
    }); 
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown); 
    window.addEventListener('keyup', handleKeyUp);
    const handleBlur = () => setPressedKeys(new Set());
    window.addEventListener('blur', handleBlur);
    return () => { 
        window.removeEventListener('keydown', handleKeyDown); 
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isPlaying && currentTask) {
      timerIntervalRef.current = setInterval(() => setTimeLeft(t => {
        if (t <= 0.1) { setCombo(0); setScore(s => Math.max(0, s - 20)); nextRound(); return 0; }
        return t - 0.1;
      }), 100);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isPlaying, currentTask, nextRound]);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden">
      <div className="absolute top-2 right-2 text-[10px] text-slate-600 font-mono">
        Last Code: {lastRawCode || 'None'}
      </div>

      <div className="w-full max-w-[1200px] mb-3 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex gap-8 items-center pl-4 min-w-[250px]">
          <div><div className="text-xs text-slate-400 uppercase tracking-tighter">Score</div><div className="text-4xl font-mono font-bold text-cyan-400">{score}</div></div>
          <div><div className="text-xs text-slate-400 uppercase tracking-tighter">Combo</div><div className={`text-3xl font-mono font-bold ${combo > 5 ? 'text-yellow-400 animate-pulse' : ''}`}>{combo}x</div></div>
        </div>
        <div className="flex items-center gap-6 pr-2">
          <div className="text-right hidden md:block">
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">鍵盤極速光</h1>
            <p className="text-slate-500 text-[10px] font-mono mt-1 opacity-80">© Bee老師資訊教室 by 崇德國小</p>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
            {['EN', 'ZH', 'SYMBOL'].map(m => (
              <button key={m} onClick={() => handleModeChange(m)} disabled={isPlaying} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${gameMode === m ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                {m === 'EN' ? '英文' : m === 'ZH' ? '注音' : '符號'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mb-3 min-h-[5rem] flex flex-col justify-center items-center bg-slate-900/50 rounded-lg border border-slate-700/50 p-2 relative shrink-0">
        {currentTask ? (
          <div className="text-center z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-5xl font-black text-white mb-1 drop-shadow-lg flex items-center justify-center gap-3">
              {currentTask.shift && <span className="px-3 py-1 bg-yellow-600/20 rounded text-xl border border-yellow-500/50 text-yellow-400 font-bold">Shift</span>}
              {currentTask.shift && <span className="text-slate-500">+</span>}
              <span className="text-cyan-400">{currentTask.label}</span>
            </div>
            {currentTask.desc && <div className="text-yellow-300 text-sm font-medium bg-yellow-900/30 px-4 py-1 rounded-full border border-yellow-700/30 mt-2">{currentTask.desc}</div>}
          </div>
        ) : <div className="text-slate-500 text-lg font-medium">按下空白鍵開始挑戰</div>}
      </div>

      <div className="w-full max-w-[1200px] mb-1 h-3 bg-slate-800 rounded-full overflow-hidden shrink-0 border border-slate-700">
        <div className={`h-full transition-all duration-100 linear ${timeLeft < 3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
      </div>
      
      <div className={`h-8 mb-2 text-base font-bold flex items-center ${feedback.type === 'error' ? 'text-red-400' : feedback.type === 'success' ? 'text-green-400' : 'text-slate-400'}`}>{feedback.text}</div>

      <div className="flex flex-col xl:flex-row items-center justify-center gap-6 w-full max-w-[1400px]">
        <div className="p-5 bg-slate-950 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-8 border-slate-800 relative scale-90 md:scale-100 lg:scale-110 origin-top">
          <div className="flex flex-col gap-2 min-w-[700px]">
            {KEYBOARD_LAYOUT.map((row, ri) => (
              <div key={ri} className="flex gap-2 justify-center">
                {row.map((k) => {
                  const isTarget = currentTask && (k.code === currentTask.code || (currentTask.shift && (k.code === 'ShiftLeft' || k.code === 'ShiftRight')));
                  const isPressed = pressedKeys.has(k.code);
                  let style = `relative flex flex-col items-center justify-center rounded-xl transition-all duration-75 font-semibold h-12 md:h-16 min-w-[2.5rem] `;
                  if (isPressed) style += "bg-slate-700 text-white translate-y-1 mt-1 border-b-0 ";
                  else if (isTarget) style += k.code.includes('Shift') ? "bg-yellow-600 text-white border-b-4 border-yellow-800 animate-pulse " : mistakesOnCurrent === 0 ? "bg-cyan-600 text-white border-b-4 border-cyan-800 animate-pulse " : "bg-red-500 text-white border-b-4 border-red-700 ";
                  else style += "bg-slate-800 text-slate-300 border-b-4 border-slate-900 hover:bg-slate-700 ";
                  return (
                    <div key={k.code} className={style} style={{ flexGrow: k.width, flexBasis: `${k.width * 3.8}rem` }}>
                      {k.shiftLabel && <span className={`absolute top-1 left-2 text-xs ${gameMode === 'SYMBOL' ? 'text-yellow-300 font-bold scale-125' : 'opacity-30'}`}>{k.shiftLabel}</span>}
                      <span className={`leading-none ${gameMode === 'ZH' && ZHUYIN_MAP[k.code] ? 'text-[10px] opacity-40' : 'text-base md:text-xl'}`}>{k.label}</span>
                      {ZHUYIN_MAP[k.code] && <span className={`leading-none ${gameMode === 'ZH' ? 'text-lg md:text-2xl font-bold text-cyan-200 mt-1' : 'text-[10px] absolute bottom-1 right-2 opacity-20'}`}>{ZHUYIN_MAP[k.code]}</span>}
                      {['KeyF', 'KeyJ'].includes(k.code) && <span className="absolute bottom-2 w-4 h-0.5 bg-slate-600 rounded-full opacity-50"></span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center p-4 min-w-[220px]">
          {!isPlaying ? (
            <button onClick={startGame} className="w-full px-8 py-8 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-3xl text-2xl shadow-xl shadow-cyan-900/20 active:scale-95 flex flex-col items-center">
              <span>開始挑戰</span><span className="text-xs font-normal opacity-70 mt-2">按 SPACE 開始</span>
            </button>
          ) : <button onClick={stopGame} className="w-full px-8 py-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl text-2xl shadow-xl shadow-red-900/20 active:scale-95">結束遊戲</button>}
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 w-full text-slate-400 text-xs leading-relaxed shadow-inner">
            <p className="mb-3 font-bold text-slate-200 border-b border-slate-700 pb-1">練習重點：</p>
            <ul className="list-disc pl-4 space-y-2">
              <li className={gameMode === 'SYMBOL' ? 'opacity-40' : 'text-white'}>
                {gameMode === 'EN' ? '英文' : '注音'}模式：練習<span className="text-cyan-400">字鍵位置</span>
              </li>
              <li className={gameMode === 'SYMBOL' ? 'text-white' : 'opacity-40'}>
                符號模式：練習<span className="text-yellow-400">組合鍵與標點</span>
              </li>
              <li>注意：注音標點（如逗號）不需按 Shift。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
