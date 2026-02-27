import React, { useState, useEffect, useCallback, useRef } from 'react';

// ----------------------------------------------------------------------
// 1. 資料設定：注音表與特殊符號表
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

const SYMBOL_CHALLENGES = [
  { code: 'Digit1', shift: true, label: '!', desc: '驚嘆號：表示強烈語氣' },
  { code: 'Digit2', shift: true, label: '@', desc: '小老鼠 (At)：用於 Email 或標註人名' },
  { code: 'Digit3', shift: true, label: '#', desc: '井字號 (Hash)：標籤、分機號碼' },
  { code: 'Digit4', shift: true, label: '$', desc: '錢符號：程式變數或貨幣' },
  { code: 'Digit5', shift: true, label: '%', desc: '百分比符號' },
  { code: 'Digit6', shift: true, label: '^', desc: '插入號：數學次方或表情符號' },
  { code: 'Digit7', shift: true, label: '&', desc: 'And (和)：程式邏輯或連接詞' },
  { code: 'Digit8', shift: true, label: '*', desc: '星號：乘法運算或註解' },
  { code: 'Digit9', shift: true, label: '(', desc: '左括號：補充說明用' },
  { code: 'Digit0', shift: true, label: ')', desc: '右括號：補充說明用' },
  { code: 'Minus', shift: true, label: '_', desc: '底線：常用於帳號命名' },
  { code: 'Equal', shift: true, label: '+', desc: '加號：數學運算' },
  { code: 'BracketLeft', shift: true, label: '{', desc: '大括號：程式區塊開始' },
  { code: 'BracketRight', shift: true, label: '}', desc: '大括號：程式區塊結束' },
  { code: 'Backslash', shift: true, label: '|', desc: '直槓 (Pipe)：程式邏輯' },
  { code: 'Semicolon', shift: true, label: ':', desc: '冒號：用於清單或定義' },
  { code: 'Quote', shift: true, label: '"', desc: '雙引號：引用對話或強調' },
  { code: 'Comma', shift: true, label: '<', desc: '小於符號 / 書名號' },
  { code: 'Period', shift: true, label: '>', desc: '大於符號 / 書名號' },
  { code: 'Slash', shift: true, label: '?', desc: '問號：表示疑問' },
  { code: 'Backquote', shift: true, label: '~', desc: '波浪號：表示範圍' },
  { code: 'ShiftLeft', shift: false, label: '中/英', desc: '【功能】切換 中文/英文', hint: '請按一下左 Shift' },
  { code: 'Space', shift: true, label: '全/半', desc: '【功能】切換 全形/半形', hint: '按住 Shift + 空白鍵' },
  { code: 'CapsLock', shift: false, label: 'Caps', desc: '【功能】鎖定大寫', hint: '請按一下 Caps Lock' },
];

const KEYBOARD_LAYOUT = [
  [{ code: 'Backquote', label: '`', shiftLabel: '~', width: 1 }, { code: 'Digit1', label: '1', shiftLabel: '!', width: 1 }, { code: 'Digit2', label: '2', shiftLabel: '@', width: 1 }, { code: 'Digit3', label: '3', shiftLabel: '#', width: 1 }, { code: 'Digit4', label: '4', shiftLabel: '$', width: 1 }, { code: 'Digit5', label: '5', shiftLabel: '%', width: 1 }, { code: 'Digit6', label: '6', shiftLabel: '^', width: 1 }, { code: 'Digit7', label: '7', shiftLabel: '&', width: 1 }, { code: 'Digit8', label: '8', shiftLabel: '*', width: 1 }, { code: 'Digit9', label: '9', shiftLabel: '(', width: 1 }, { code: 'Digit0', label: '0', shiftLabel: ')', width: 1 }, { code: 'Minus', label: '-', shiftLabel: '_', width: 1 }, { code: 'Equal', label: '=', shiftLabel: '+', width: 1 }, { code: 'Backspace', label: '←', width: 2 }],
  [{ code: 'Tab', label: 'Tab', width: 1.5 }, { code: 'KeyQ', label: 'Q', width: 1 }, { code: 'KeyW', label: 'W', width: 1 }, { code: 'KeyE', label: 'E', width: 1 }, { code: 'KeyR', label: 'R', width: 1 }, { code: 'KeyT', label: 'T', width: 1 }, { code: 'KeyY', label: 'Y', width: 1 }, { code: 'KeyU', label: 'U', width: 1 }, { code: 'KeyI', label: 'I', width: 1 }, { code: 'KeyO', label: 'O', width: 1 }, { code: 'KeyP', label: 'P', width: 1 }, { code: 'BracketLeft', label: '[', shiftLabel: '{', width: 1 }, { code: 'BracketRight', label: ']', shiftLabel: '}', width: 1 }, { code: 'Backslash', label: '\\', shiftLabel: '|', width: 1.5 }],
  [{ code: 'CapsLock', label: 'Caps', width: 1.8 }, { code: 'KeyA', label: 'A', width: 1 }, { code: 'KeyS', label: 'S', width: 1 }, { code: 'KeyD', label: 'D', width: 1 }, { code: 'KeyF', label: 'F', width: 1 }, { code: 'KeyG', label: 'G', width: 1 }, { code: 'KeyH', label: 'H', width: 1 }, { code: 'KeyJ', label: 'J', width: 1 }, { code: 'KeyK', label: 'K', width: 1 }, { code: 'KeyL', label: 'L', width: 1 }, { code: 'Semicolon', label: ';', shiftLabel: ':', width: 1 }, { code: 'Quote', label: "'", shiftLabel: '"', width: 1 }, { code: 'Enter', label: 'Enter', width: 2.2 }],
  [{ code: 'ShiftLeft', label: 'Shift', width: 2.4 }, { code: 'KeyZ', label: 'Z', width: 1 }, { code: 'KeyX', label: 'X', width: 1 }, { code: 'KeyC', label: 'C', width: 1 }, { code: 'KeyV', label: 'V', width: 1 }, { code: 'KeyB', label: 'B', width: 1 }, { code: 'KeyN', label: 'N', width: 1 }, { code: 'KeyM', label: 'M', width: 1 }, { code: 'Comma', label: ',', shiftLabel: '<', width: 1 }, { code: 'Period', label: '.', shiftLabel: '>', width: 1 }, { code: 'Slash', label: '/', shiftLabel: '?', width: 1 }, { code: 'ShiftRight', label: 'Shift', width: 2.6 }],
  [{ code: 'ControlLeft', label: 'Ctrl', width: 1.5 }, { code: 'MetaLeft', label: 'Win', width: 1.25 }, { code: 'AltLeft', label: 'Alt', width: 1.25 }, { code: 'Space', label: 'Space', width: 6.5 }, { code: 'AltRight', label: 'Alt', width: 1.25 }, { code: 'MetaRight', label: 'Fn', width: 1.25 }, { code: 'ControlRight', label: 'Ctrl', width: 1.5 }]
];

const FLAT_KEYS_STANDARD = KEYBOARD_LAYOUT.flat().filter(k => k.code !== 'Fn' && k.code !== 'MetaRight');

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

  const startTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);

  const handleModeChange = (mode) => {
    setGameMode(mode);
    stopGame();
    setFeedback({ text: `已切換至：${mode === 'EN' ? '英文模式' : mode === 'ZH' ? '注音模式' : '符號練習'}`, type: 'info' });
  };

  const nextRound = useCallback(() => {
    let task = null;
    if (gameMode === 'SYMBOL') {
      const challenge = SYMBOL_CHALLENGES[Math.floor(Math.random() * SYMBOL_CHALLENGES.length)];
      task = { ...challenge, hint: challenge.hint || (challenge.shift ? `Shift + ${challenge.code}` : '') };
    } else {
      const randomKey = FLAT_KEYS_STANDARD[Math.floor(Math.random() * FLAT_KEYS_STANDARD.length)];
      task = { code: randomKey.code, shift: false, label: randomKey.label, desc: '' };
    }
    setCurrentTask(task);
    setMistakesOnCurrent(0);
    setTimeLeft(10.0);
    startTimeRef.current = Date.now();
  }, [gameMode]);

  const startGame = useCallback(() => {
    setScore(0); setCombo(0); setIsPlaying(true);
    setFeedback({ text: '開始遊戲！', type: 'success' });
    nextRound();
  }, [nextRound]);

  const stopGame = useCallback(() => {
    setIsPlaying(false); setCurrentTask(null);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, []);

  const handleKeyDown = useCallback((e) => {
    // --- 核心：攔截瀏覽器預設行為 ---
    // 1. 攔截 F1-F12 功能鍵 (避面幫助、搜尋、開發者工具)
    if (/^F\d+$/.test(e.code)) {
      e.preventDefault();
    }
    // 2. 攔截系統組合鍵 (Ctrl + S/F/P/G, Alt 等)
    if (e.ctrlKey && ['KeyS', 'KeyF', 'KeyP', 'KeyG'].includes(e.code)) {
      e.preventDefault();
    }
    // 3. 攔截遊戲常用的控制鍵 (Tab, Space, 方向鍵, Alt, Win鍵)
    const keysToBlock = ['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];
    if (keysToBlock.includes(e.code)) {
      e.preventDefault();
    }

    if (!isPlaying) { if (e.code === 'Space') startGame(); return; }
    
    setPressedKeys(prev => {
        const n = new Set(prev);
        n.add(e.code);
        return n;
    });

    if (!currentTask) return;

    let isCorrect = (e.code === currentTask.code || (currentTask.code === 'ShiftLeft' && (e.code === 'ShiftLeft' || e.code === 'ShiftRight')));
    
    if (isCorrect && currentTask.shift && !e.shiftKey) { 
        setFeedback({ text: '請按住 Shift！', type: 'warning' }); 
        return; 
    }

    if (isCorrect) {
      setScore(s => s + 100 + Math.max(0, Math.floor((2000 - (Date.now() - startTimeRef.current)) / 10)));
      setCombo(c => c + 1); setFeedback({ text: '正確!', type: 'success' });
      setTimeout(nextRound, 150);
    } else if (!['Shift', 'Control', 'Alt'].some(k => e.key.includes(k))) {
      setMistakesOnCurrent(m => {
        if (m >= 1) { setScore(s => Math.max(0, s - 50)); setFeedback({ text: '按錯了 (-50)', type: 'error' }); return m + 1; }
        setFeedback({ text: '小心！', type: 'warning' }); setCombo(0); return 1;
      });
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
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
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
              <button key={m} onClick={() => handleModeChange(m)} disabled={isPlaying} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${gameMode === m ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>
                {m === 'EN' ? '英文' : m === 'ZH' ? '注音' : '符號'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1200px] mb-3 min-h-[5rem] flex flex-col justify-center items-center bg-slate-900/50 rounded-lg border border-slate-700/50 p-2 relative overflow-hidden shrink-0">
        {currentTask ? (
          <div className="text-center z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-5xl font-black text-white mb-1 drop-shadow-lg flex items-center justify-center gap-3">
              {currentTask.shift && <span className="px-3 py-1 bg-yellow-600/20 rounded text-xl border border-yellow-500/50 text-yellow-400">Shift</span>}
              {currentTask.shift && <span className="text-slate-500">+</span>}
              <span className="text-cyan-400">{currentTask.label}</span>
            </div>
            {currentTask.desc && <div className="text-yellow-300 text-sm font-medium bg-yellow-900/30 px-4 py-1 rounded-full border border-yellow-700/30 mt-2">{currentTask.desc}</div>}
          </div>
        ) : <div className="text-slate-500 text-lg font-medium">按下空白鍵或右方按鈕開始</div>}
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
            <button onClick={startGame} className="w-full px-8 py-8 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-3xl text-2xl shadow-xl shadow-cyan-900/20 transform transition-transform active:scale-95 flex flex-col items-center">
              <span>開始挑戰</span><span className="text-xs font-normal opacity-70 mt-2">PRESS SPACE</span>
            </button>
          ) : <button onClick={stopGame} className="w-full px-8 py-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl text-2xl shadow-xl shadow-red-900/20 active:scale-95">結束遊戲</button>}
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 w-full text-slate-400 text-xs leading-relaxed shadow-inner">
            <p className="mb-3 font-bold text-slate-200 border-b border-slate-700 pb-1">操作秘訣：</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>切換輸入法為 <span className="text-cyan-400 font-bold">ENG</span></li>
              <li>注意注音符號的 <span className="text-white">位置顏色</span></li>
              <li>符號模式必須按住 <span className="text-yellow-400">Shift</span></li>
              <li>保持 <span className="text-white font-bold">Combo</span> 可獲得更高分數！</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}