<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>崇德國小：快樂鍵盤大師</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Roboto+Mono:wght@500&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #fce7f3;
            background-image: radial-gradient(#fbcfe8 2px, transparent 2px);
            background-size: 24px 24px;
            user-select: none;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .keyboard-container {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
        }

        .keyboard-case {
            background: #2d3748;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.1);
            display: inline-flex;
            gap: 15px;
            min-width: 1080px;
            transform-origin: center center;
            transition: transform 0.3s;
            border-bottom: 8px solid #1a202c;
        }

        .key {
            background: #f7fafc;
            color: #1a202c;
            border-radius: 6px;
            box-shadow: 0 4px 0 #cbd5e0, 0 5px 5px rgba(0,0,0,0.1);
            cursor: pointer;
            position: relative;
            transition: all 0.05s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .key-std { display: block !important; }

        .key:active, .key.active {
            transform: translateY(4px);
            box-shadow: 0 0 0 #cbd5e0, inset 0 2px 5px rgba(0,0,0,0.1);
            background: #fbbf24;
            color: #78350f !important;
        }
        
        .key.active span { color: #78350f !important; }

        .key.active-lock {
            background: #34d399;
            color: white;
            transform: translateY(4px);
            box-shadow: none;
        }

        .k-main { position: absolute; bottom: 4px; left: 6px; font-family: 'Roboto Mono', monospace; font-size: 0.95rem; font-weight: 700; line-height: 1; }
        .k-shift { position: absolute; top: 4px; left: 6px; font-size: 0.75rem; font-family: 'Roboto Mono', monospace; color: #4a5568; line-height: 1; }
        .k-zh { position: absolute; bottom: 4px; right: 6px; font-size: 0.8rem; font-weight: 500; color: #ef4444; line-height: 1; }
        
        .key-func { font-size: 0.8rem; font-weight: bold; }

        .status-light {
            width: 8px; height: 8px; background: #4a5568; border-radius: 50%; margin: 0 auto 4px auto;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.5); transition: all 0.3s;
        }
        .status-light.on { background: #34d399; box-shadow: 0 0 5px #34d399, 0 0 10px #34d399; }
        .status-text { color: #a0aec0; font-size: 0.6rem; text-align: center; text-transform: uppercase; }

        .section-main { display: flex; flex-direction: column; gap: 6px; }
        .section-nav { display: flex; flex-direction: column; gap: 6px; justify-content: space-between; width: 140px;}
        .section-numpad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 220px; }
        .numpad-0 { grid-column: span 2; }
        .numpad-plus { grid-row: span 2; height: 100% !important; }
        .numpad-enter { grid-row: span 2; height: 100% !important; }

        #floating-window {
            position: absolute; width: 420px; 
            background: rgba(255, 255, 255, 0.98); 
            border-radius: 16px; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.15); 
            border: 2px solid #fbcfe8;
            z-index: 50; display: flex; flex-direction: column; right: 20px; bottom: 60px; max-height: 80vh;
            transition: height 0.3s, opacity 0.3s;
        }
        
        #drag-handle { cursor: move; }
        #window-content { overflow-y: auto; flex-grow: 1; scrollbar-width: thin; }
        .minimized { height: 54px !important; overflow: hidden; }

        .copyright-footer {
            position: fixed;
            bottom: 15px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #64748b;
            font-weight: bold;
            pointer-events: none;
            z-index: 40;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
        }
        
        .correct-anim { animation: pulseGreen 0.5s; }
        .wrong-anim { animation: shakeRed 0.5s; }
        @keyframes pulseGreen { 0% { background: #d1fae5; } 100% { background: #fff; } }
        @keyframes shakeRed { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

        /* 啟動遮罩 */
        #start-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>

    <!-- 啟動遮罩：確保使用者點擊後獲取焦點 -->
    <div id="start-overlay" onclick="this.style.display='none'">
        <div class="bg-white p-8 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition cursor-pointer border-4 border-pink-400">
            <div class="text-6xl mb-4">⌨️</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">準備好了嗎？</h2>
            <p class="text-pink-500 font-bold mb-4">點擊任何地方開始認識鍵盤！</p>
            <div class="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold inline-block">點擊一下進入教室</div>
        </div>
    </div>

    <header class="bg-white/90 backdrop-blur-sm shadow-sm z-10 px-6 py-3 flex justify-between items-center shrink-0 border-b-4 border-pink-200">
        <div class="flex items-center gap-3">
            <div class="bg-pink-500 text-white p-2 rounded-xl shadow-md transform -rotate-3">
                <span class="text-2xl">🐝</span>
            </div>
            <div>
                <h1 class="text-xl font-bold text-gray-800 tracking-wide">崇德國小：快樂鍵盤大師</h1>
                <p class="text-xs text-pink-500 font-bold">三年級電腦課專用 | 智慧隨機題庫系統</p>
            </div>
        </div>
        
        <div class="flex gap-2">
            <div class="flex items-center bg-pink-50 rounded-lg px-2 mr-2 border border-pink-100">
                <button onclick="zoomKeyboard(-0.1)" class="p-1 hover:bg-pink-100 rounded font-bold text-gray-500 text-lg w-8">-</button>
                <span class="text-xs text-gray-500 mx-1 font-bold">大小</span>
                <button onclick="zoomKeyboard(0.1)" class="p-1 hover:bg-pink-100 rounded font-bold text-gray-500 text-lg w-8">+</button>
            </div>
            
            <div class="flex bg-pink-50 p-1 rounded-xl border border-pink-100">
                <button onclick="setMode('practice')" id="btn-practice" class="px-5 py-2 rounded-lg text-sm font-bold bg-white shadow text-pink-600 transition-all flex items-center gap-1">
                    <span>🎮</span> 自由練習
                </button>
                <button onclick="setMode('quiz')" id="btn-quiz" class="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700 transition-all flex items-center gap-1">
                    <span>🏆</span> 隨機測驗
                </button>
            </div>
        </div>
    </header>

    <div class="copyright-footer">
        © @teacher Bee資訊教室 崇德國小
    </div>

    <main class="keyboard-container" id="main-area">
        <div class="keyboard-case" id="keyboard-case">
             <div class="section-main">
                <!-- Row 1: F Keys -->
                <div class="flex gap-2 mb-2">
                    <div id="Escape" class="key key-func w-10 h-10 bg-red-100 text-red-800">Esc</div>
                    <div class="w-4"></div>
                    <div id="F1" class="key key-func w-10 h-10">F1</div>
                    <div id="F2" class="key key-func w-10 h-10">F2</div>
                    <div id="F3" class="key key-func w-10 h-10">F3</div>
                    <div id="F4" class="key key-func w-10 h-10">F4</div>
                    <div class="w-2"></div>
                    <div id="F5" class="key key-func w-10 h-10">F5</div>
                    <div id="F6" class="key key-func w-10 h-10">F6</div>
                    <div id="F7" class="key key-func w-10 h-10">F7</div>
                    <div id="F8" class="key key-func w-10 h-10">F8</div>
                    <div class="w-2"></div>
                    <div id="F9" class="key key-func w-10 h-10">F9</div>
                    <div id="F10" class="key key-func w-10 h-10">F10</div>
                    <div id="F11" class="key key-func w-10 h-10">F11</div>
                    <div id="F12" class="key key-func w-10 h-10">F12</div>
                </div>

                <div class="flex gap-1.5">
                    <div id="Backquote" class="key key-std w-10 h-10"><span class="k-shift">~</span><span class="k-main">`</span><span class="k-zh">巷</span></div>
                    <div id="Digit1" class="key key-std w-10 h-10"><span class="k-shift">!</span><span class="k-main">1</span><span class="k-zh">ㄅ</span></div>
                    <div id="Digit2" class="key key-std w-10 h-10"><span class="k-shift">@</span><span class="k-main">2</span><span class="k-zh">ㄉ</span></div>
                    <div id="Digit3" class="key key-std w-10 h-10"><span class="k-shift">#</span><span class="k-main">3</span><span class="k-zh">ˇ</span></div>
                    <div id="Digit4" class="key key-std w-10 h-10"><span class="k-shift">$</span><span class="k-main">4</span><span class="k-zh">ˋ</span></div>
                    <div id="Digit5" class="key key-std w-10 h-10"><span class="k-shift">%</span><span class="k-main">5</span><span class="k-zh">ㄓ</span></div>
                    <div id="Digit6" class="key key-std w-10 h-10"><span class="k-shift">^</span><span class="k-main">6</span><span class="k-zh">ˊ</span></div>
                    <div id="Digit7" class="key key-std w-10 h-10"><span class="k-shift">&</span><span class="k-main">7</span><span class="k-zh">˙</span></div>
                    <div id="Digit8" class="key key-std w-10 h-10"><span class="k-shift">*</span><span class="k-main">8</span><span class="k-zh">ㄚ</span></div>
                    <div id="Digit9" class="key key-std w-10 h-10"><span class="k-shift">(</span><span class="k-main">9</span><span class="k-zh">ㄞ</span></div>
                    <div id="Digit0" class="key key-std w-10 h-10"><span class="k-shift">)</span><span class="k-main">0</span><span class="k-zh">ㄢ</span></div>
                    <div id="Minus" class="key key-std w-10 h-10"><span class="k-shift">_</span><span class="k-main">-</span><span class="k-zh">ㄦ</span></div>
                    <div id="Equal" class="key key-std w-10 h-10"><span class="k-shift">+</span><span class="k-main">=</span></div>
                    <div id="Backspace" class="key key-func w-20 h-10 text-sm">Backspace</div>
                </div>

                <div class="flex gap-1.5">
                    <div id="Tab" class="key key-func w-14 h-10 text-sm">Tab</div>
                    <div id="KeyQ" class="key key-std w-10 h-10"><span class="k-main">Q</span><span class="k-zh">ㄆ</span></div>
                    <div id="KeyW" class="key key-std w-10 h-10"><span class="k-main">W</span><span class="k-zh">ㄊ</span></div>
                    <div id="KeyE" class="key key-std w-10 h-10"><span class="k-main">E</span><span class="k-zh">ㄍ</span></div>
                    <div id="KeyR" class="key key-std w-10 h-10"><span class="k-main">R</span><span class="k-zh">ㄐ</span></div>
                    <div id="KeyT" class="key key-std w-10 h-10"><span class="k-main">T</span><span class="k-zh">ㄔ</span></div>
                    <div id="KeyY" class="key key-std w-10 h-10"><span class="k-main">Y</span><span class="k-zh">ㄗ</span></div>
                    <div id="KeyU" class="key key-std w-10 h-10"><span class="k-main">U</span><span class="k-zh">ㄧ</span></div>
                    <div id="KeyI" class="key key-std w-10 h-10"><span class="k-main">I</span><span class="k-zh">ㄛ</span></div>
                    <div id="KeyO" class="key key-std w-10 h-10"><span class="k-main">O</span><span class="k-zh">ㄟ</span></div>
                    <div id="KeyP" class="key key-std w-10 h-10"><span class="k-main">P</span><span class="k-zh">ㄣ</span></div>
                    <div id="BracketLeft" class="key key-std w-10 h-10"><span class="k-shift">{</span><span class="k-main">[</span></div>
                    <div id="BracketRight" class="key key-std w-10 h-10"><span class="k-shift">}</span><span class="k-main">]</span></div>
                    <div id="Backslash" class="key key-std w-14 h-10"><span class="k-shift">|</span><span class="k-main">\</span><span class="k-zh">鎮</span></div>
                </div>

                <div class="flex gap-1.5">
                    <div id="CapsLock" class="key key-func w-16 h-10 text-sm">Caps</div>
                    <div id="KeyA" class="key key-std w-10 h-10"><span class="k-main">A</span><span class="k-zh">ㄇ</span></div>
                    <div id="KeyS" class="key key-std w-10 h-10"><span class="k-main">S</span><span class="k-zh">ㄋ</span></div>
                    <div id="KeyD" class="key key-std w-10 h-10"><span class="k-main">D</span><span class="k-zh">ㄎ</span></div>
                    <div id="KeyF" class="key key-std w-10 h-10"><span class="k-main">F</span><span class="k-zh">ㄑ</span></div>
                    <div id="KeyG" class="key key-std w-10 h-10"><span class="k-main">G</span><span class="k-zh">ㄕ</span></div>
                    <div id="KeyH" class="key key-std w-10 h-10"><span class="k-main">H</span><span class="k-zh">ㄘ</span></div>
                    <div id="KeyJ" class="key key-std w-10 h-10"><span class="k-main">J</span><span class="k-zh">ㄨ</span></div>
                    <div id="KeyK" class="key key-std w-10 h-10"><span class="k-main">K</span><span class="k-zh">ㄜ</span></div>
                    <div id="KeyL" class="key key-std w-10 h-10"><span class="k-main">L</span><span class="k-zh">ㄠ</span></div>
                    <div id="Semicolon" class="key key-std w-10 h-10"><span class="k-shift">:</span><span class="k-main">;</span><span class="k-zh">ㄤ</span></div>
                    <div id="Quote" class="key key-std w-10 h-10"><span class="k-shift">"</span><span class="k-main">'</span></div>
                    <div id="Enter" class="key key-func flex-grow h-10 text-sm bg-blue-100 text-blue-900">Enter</div>
                </div>

                <div class="flex gap-1.5">
                    <div id="ShiftLeft" class="key key-func w-24 h-10 text-sm">Shift</div>
                    <div id="KeyZ" class="key key-std w-10 h-10"><span class="k-main">Z</span><span class="k-zh">ㄈ</span></div>
                    <div id="KeyX" class="key key-std w-10 h-10"><span class="k-main">X</span><span class="k-zh">ㄌ</span></div>
                    <div id="KeyC" class="key key-std w-10 h-10"><span class="k-main">C</span><span class="k-zh">ㄏ</span></div>
                    <div id="KeyV" class="key key-std w-10 h-10"><span class="k-main">V</span><span class="k-zh">ㄒ</span></div>
                    <div id="KeyB" class="key key-std w-10 h-10"><span class="k-main">B</span><span class="k-zh">ㄖ</span></div>
                    <div id="KeyN" class="key key-std w-10 h-10"><span class="k-main">N</span><span class="k-zh">ㄙ</span></div>
                    <div id="KeyM" class="key key-std w-10 h-10"><span class="k-main">M</span><span class="k-zh">ㄩ</span></div>
                    <div id="Comma" class="key key-std w-10 h-10"><span class="k-shift">&lt;</span><span class="k-main">,</span><span class="k-zh">ㄝ</span></div>
                    <div id="Period" class="key key-std w-10 h-10"><span class="k-shift">&gt;</span><span class="k-main">.</span><span class="k-zh">ㄡ</span></div>
                    <div id="Slash" class="key key-std w-10 h-10"><span class="k-shift">?</span><span class="k-main">/</span><span class="k-zh">ㄥ</span></div>
                    <div id="ShiftRight" class="key key-func flex-grow h-10 text-sm">Shift</div>
                </div>

                <div class="flex gap-1.5">
                    <div id="ControlLeft" class="key key-func w-12 h-10 text-sm">Ctrl</div>
                    <div id="MetaLeft" class="key key-func w-12 h-10 text-sm">Win</div>
                    <div id="AltLeft" class="key key-func w-12 h-10 text-sm">Alt</div>
                    <div id="Space" class="key flex-grow h-10"></div>
                    <div id="AltRight" class="key key-func w-12 h-10 text-sm">Alt</div>
                    <div id="MetaRight" class="key key-func w-12 h-10 text-sm">Win</div>
                    <div id="ContextMenu" class="key key-func w-12 h-10 text-sm">Menu</div>
                    <div id="ControlRight" class="key key-func w-12 h-10 text-sm">Ctrl</div>
                </div>
            </div>

            <div class="section-nav">
                <div class="flex gap-1.5 mb-2">
                    <div id="PrintScreen" class="key key-func w-10 h-10 text-xs">PrtSc</div>
                    <div id="ScrollLock" class="key key-func w-10 h-10 text-xs">ScrLk</div>
                    <div id="Pause" class="key key-func w-10 h-10 text-xs">Pause</div>
                </div>
                
                <div class="grid grid-cols-3 gap-1.5">
                    <div id="Insert" class="key key-func w-10 h-10 text-xs">Ins</div>
                    <div id="Home" class="key key-func w-10 h-10 text-xs">Home</div>
                    <div id="PageUp" class="key key-func w-10 h-10 text-xs">PgUp</div>
                    <div id="Delete" class="key key-func w-10 h-10 text-xs text-red-600">Del</div>
                    <div id="End" class="key key-func w-10 h-10 text-xs">End</div>
                    <div id="PageDown" class="key key-func w-10 h-10 text-xs">PgDn</div>
                </div>

                <div class="flex-grow"></div>

                <div class="grid grid-cols-3 gap-1.5">
                    <div></div>
                    <div id="ArrowUp" class="key key-func w-10 h-10 text-xl">↑</div>
                    <div></div>
                    <div id="ArrowLeft" class="key key-func w-10 h-10 text-xl">←</div>
                    <div id="ArrowDown" class="key key-func w-10 h-10 text-xl">↓</div>
                    <div id="ArrowRight" class="key key-func w-10 h-10 text-xl">→</div>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="flex justify-between px-2 bg-gray-800 py-2 rounded border border-gray-600">
                    <div><div id="led-num" class="status-light"></div><div class="status-text">Num</div></div>
                    <div><div id="led-caps" class="status-light"></div><div class="status-text">Caps</div></div>
                    <div><div id="led-scroll" class="status-light"></div><div class="status-text">Scroll</div></div>
                </div>

                <div class="section-numpad">
                    <div id="NumLock" class="key key-func w-full h-10 text-xs">Num</div>
                    <div id="NumpadDivide" class="key key-func w-full h-10">/</div>
                    <div id="NumpadMultiply" class="key key-func w-full h-10">*</div>
                    <div id="NumpadSubtract" class="key key-func w-full h-10">-</div>
                    
                    <div id="Numpad7" class="key key-std w-full h-10"><span class="k-shift">Home</span><span class="k-main">7</span></div>
                    <div id="Numpad8" class="key key-std w-full h-10"><span class="k-shift">↑</span><span class="k-main">8</span></div>
                    <div id="Numpad9" class="key key-std w-full h-10"><span class="k-shift">PgUp</span><span class="k-main">9</span></div>
                    <div id="NumpadAdd" class="key key-func w-full h-full numpad-plus">+</div>
                    <div id="Numpad4" class="key key-std w-full h-10"><span class="k-shift">←</span><span class="k-main">4</span></div>
                    <div id="Numpad5" class="key key-std w-full h-10"><span class="k-main">5</span></div>
                    <div id="Numpad6" class="key key-std w-full h-10"><span class="k-shift">→</span><span class="k-main">6</span></div>
                    <div id="Numpad1" class="key key-std w-full h-10"><span class="k-shift">End</span><span class="k-main">1</span></div>
                    <div id="Numpad2" class="key key-std w-full h-10"><span class="k-shift">↓</span><span class="k-main">2</span></div>
                    <div id="Numpad3" class="key key-std w-full h-10"><span class="k-shift">PgDn</span><span class="k-main">3</span></div>
                    <div id="NumpadEnter" class="key key-func w-full h-full numpad-enter bg-blue-50">Enter</div>
                    <div id="Numpad0" class="key key-std w-full h-10 numpad-0"><span class="k-shift">Ins</span><span class="k-main">0</span></div>
                    <div id="NumpadDecimal" class="key key-std w-full h-10"><span class="k-shift">Del</span><span class="k-main">.</span></div>
                </div>
            </div>
        </div>
    </main>

    <div id="floating-window">
        <div id="drag-handle" class="bg-pink-500 text-white px-5 py-4 flex justify-between items-center select-none cursor-move rounded-t-2xl">
            <h2 id="window-title" class="font-bold text-lg tracking-wide flex items-center gap-2"><span>🎮</span> 練習模式</h2>
            <div class="flex gap-2">
                <button onclick="toggleMinimize()" class="hover:bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-xl leading-none transition-colors">_</button>
            </div>
        </div>
        <div id="window-content" class="p-6 bg-white rounded-b-2xl">
            <div id="panel-practice">
                <div id="info-placeholder" class="text-center py-8 text-gray-400">
                    <p class="text-6xl mb-4 animate-bounce">👋</p>
                    <p class="text-xl font-bold text-gray-600">按鍵盤開始探索</p>
                    <p class="text-sm mt-3 text-pink-400 font-medium">包含 Windows 鍵、截圖鍵等介紹喔！</p>
                </div>
                <div id="info-content" class="hidden">
                    <div class="flex items-center gap-5 mb-6 border-b-2 border-pink-100 pb-4">
                        <div class="relative w-20 h-20 bg-white border-4 border-gray-200 rounded-xl shadow-inner flex items-center justify-center transform hover:scale-105 transition">
                            <span id="info-key-main" class="text-3xl font-bold text-gray-800">A</span>
                            <span id="info-key-zh" class="absolute bottom-2 right-2 text-sm text-red-500 font-bold">ㄇ</span>
                            <span id="info-key-shift" class="absolute top-2 left-2 text-xs text-gray-500"></span>
                        </div>
                        <div>
                            <h3 id="info-key-name" class="text-2xl font-bold text-pink-600">A 鍵</h3>
                            <div class="text-sm font-mono text-gray-400 mt-1 bg-gray-100 px-2 py-0.5 rounded inline-block" id="info-code">KeyA</div>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 class="text-xs font-bold text-blue-500 uppercase mb-2 tracking-wider">按鍵功能說明</h4>
                            <p id="info-desc" class="text-gray-700 text-base leading-relaxed font-medium">...</p>
                        </div>
                        <div id="info-extra-box" class="hidden bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <p class="text-xs font-bold text-yellow-600 mb-1 flex items-center gap-1"><span>💡</span> 老師的小叮嚀</p>
                            <p id="info-extra" class="text-sm text-yellow-800 font-medium">...</p>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">詳細資訊與組合技</h4>
                            <ul id="info-combos" class="text-sm text-gray-600 space-y-2 list-none"></ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="panel-quiz" class="hidden flex-col h-full">
                <div class="flex justify-between items-center mb-5">
                    <span class="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">第 <span id="q-idx">1</span>/20 題</span>
                    <div class="flex gap-4 text-sm items-center">
                        <div class="bg-gray-100 px-3 py-1 rounded-full"><span class="font-bold text-gray-500">得分</span><span id="q-score" class="text-pink-600 text-lg font-bold ml-1">0</span></div>
                        <span id="q-lives" class="text-lg tracking-widest">❤️❤️❤️</span>
                    </div>
                </div>
                <div class="bg-indigo-50 rounded-2xl p-6 border-2 border-indigo-100 mb-6 text-center shadow-sm relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 text-indigo-100 text-6xl transform rotate-12">?</div>
                    <p class="text-xs text-indigo-400 mb-2 font-bold uppercase tracking-widest">任務說明</p>
                    <h3 id="q-text" class="text-xl font-bold text-indigo-900 leading-relaxed">...</h3>
                </div>
                <div id="q-feedback" class="h-10 text-center text-lg font-bold flex items-center justify-center rounded-lg transition-all"></div>
                <div class="mt-auto text-center pt-4 border-t border-gray-100"><p class="text-xs text-gray-400">若視窗擋住按鍵，可以按住最上方標題拖移喔！</p></div>
            </div>
            
            <div id="panel-result" class="hidden text-center py-6">
                <div class="text-7xl mb-4 animate-bounce">🏆</div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">太棒了！挑戰完成</h2>
                <div class="my-8"><span class="text-gray-400 text-sm block mb-1">總得分</span><span class="text-7xl font-bold text-pink-500" id="res-score">100</span></div>
                <p id="res-comment" class="text-xl font-bold text-orange-500 mb-8 bg-orange-50 inline-block px-4 py-2 rounded-lg">你是電腦小天才！</p>
                <button onclick="setMode('practice')" class="w-full bg-pink-500 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-pink-600 transform hover:scale-105 transition flex items-center justify-center gap-2"><span>↩️</span> 再玩一次</button>
            </div>
        </div>
    </div>

    <script>
        // 設定初始模式
        let currentMode = 'practice';
        let isNumLockOn = true; // 追蹤數字鎖狀態

        // 【百科全書模式】
        const keyData = {
            'F1': { name: 'F1 說明鍵', desc: '【幫助 Help】在大部分的程式裡，按下 F1 會跳出「使用說明」或「幫助」視窗。', combos: [] },
            'F2': { name: 'F2 重新命名', desc: '【重新命名 Rename】選取檔案後按 F2，可以直接更改檔案名字。', combos: [] },
            'F3': { name: 'F3 搜尋鍵', desc: '【搜尋 Search】在檔案總管或瀏覽器中，按 F3 可以快速找東西。', combos: [] },
            'F4': { name: 'F4 地址列', desc: '【地址列】在檔案總管中，按下 F4 會展開上面的地址列清單。', combos: ['Alt+F4: 關閉目前的視窗或程式'] },
            'F5': { name: 'F5 重新整理', desc: '【重新整理 Refresh】當網頁卡住或舊資料沒更新時，按 F5 讓網頁重新讀取一次。', combos: [] },
            'F6': { name: 'F6 網址列', desc: '按 F6 可以快速選取上方的網址列，方便你輸入新的網址。', combos: [] },
            'F11': { name: 'F11 全螢幕', desc: '【全螢幕 Fullscreen】讓瀏覽器畫面變大、隱藏工具列。再按一次就可以恢復原狀。', combos: [] },
            'PrintScreen': { name: 'PrtSc 照相機', desc: '【Print Screen 螢幕截圖】幫螢幕「拍」照片。為了測驗流程順暢，考試不考這個鍵。', combos: ['Win+PrtSc: 截圖並直接存成圖片檔'] },
            'ScrollLock': { name: 'ScrLk 捲動鎖', desc: '早期用來鎖定捲軸。在 Excel 中開啟後，按方向鍵會捲動畫面而不是移動格子。', extra: '觀察右上角第三個燈號' },
            'Pause': { name: 'Pause 暫停鍵', desc: '早期用來暫停程式執行，現在很少用到。', combos: ['Win+Pause: 打開系統詳細資訊'] },
            'Insert': { name: 'Ins 魔法開關', desc: '切換「插入」與「取代」模式。取代模式打字會把後面的字「吃掉」覆蓋過去！', extra: '不小心把字吃掉了？再按一次 Insert 就會恢復！' },
            'Delete': { name: 'Del 刪除鍵', desc: '【Delete 刪除】刪除游標「右邊」(後面) 的文字，或將檔案丟到回收桶。', combos: ['Ctrl+Alt+Del: 叫出安全選單'] },
            'Home': { name: 'Home 回家鍵', desc: '跳到「這一行的最前面」，或是跳回網頁的最頂端！', combos: ['Ctrl+Home: 跳到文件的最開頭'] },
            'End': { name: 'End 結束鍵', desc: '跳到「這一行的最後面」，或是跳到網頁的最底部！', combos: ['Ctrl+End: 跳到文件的最結尾'] },
            'PageUp': { name: 'PgUp 上一頁', desc: '將畫面往上翻一整頁。', combos: [] },
            'PageDown': { name: 'PgDn 下一頁', desc: '將畫面往下翻一整頁。', combos: [] },
            'Tab': { name: 'Tab 跳格鍵', desc: '在填表單時跳到下一個格子，或讓文字縮排。', combos: ['Alt+Tab: 快速切換到別的視窗'] },
            'CapsLock': { name: 'Caps Lock 大寫鎖', desc: '【大寫鎖定】燈亮時，打出來的英文字母全都是大寫。', extra: '輸入密碼時一定要注意這個燈有沒有亮！' },
            'ShiftLeft': { name: 'Shift 上檔鍵 (左)', desc: '【變身鍵】按住打英文變大寫，按住打數字變符號。按一下可切換中英文。', combos: ['Shift+Space: 切換全形 / 半形'] },
            'ShiftRight': { name: 'Shift 上檔鍵 (右)', desc: '功能和左邊 Shift 相同。', combos: ['Shift+Space: 切換全形 / 半形'] },
            'ControlLeft': { name: 'Ctrl 控制鍵 (左)', desc: '組合技的核心。', combos: ['Ctrl+C: 複製', 'Ctrl+V: 貼上', 'Ctrl+S: 存檔', 'Ctrl+Z: 復原', 'Ctrl+A: 全選', 'Ctrl+Space: 開關輸入法'] },
            'ControlRight': { name: 'Ctrl 控制鍵 (右)', desc: '功能和左邊的 Ctrl 一樣。', combos: [] },
            'MetaLeft': { name: 'Windows 開始鍵', desc: '打開系統「開始選單」。為了不干擾網頁操作，考試不考這個鍵。', combos: ['Win+Space: 切換語言', 'Win+D: 顯示桌面'] },
            'MetaRight': { name: 'Windows 開始鍵', desc: '功能和左邊的 Windows 鍵一樣。', combos: [] },
            'AltLeft': { name: 'Alt 變換鍵 (左)', desc: '【Alternate】變換鍵。用來改變其他按鍵的功能。', combos: ['Alt+F4: 關閉視窗', 'Alt+Tab: 切換視窗'] },
            'AltRight': { name: 'Alt 變換鍵 (右)', desc: '功能和左邊的 Alt 一樣。', combos: [] },
            'Space': { name: 'Space 空白鍵', desc: '鍵盤上最長的鍵。打出空白，也是切換全形半形的好幫手。', combos: ['Shift+Space: 切換胖胖的全形字', 'Ctrl+Space: 開關輸入法'] },
            'ContextMenu': { name: 'Menu 選單鍵', desc: '按下這個鍵，就等於你用滑鼠點了「右鍵」，會跳出選項選單。', combos: [] },
            'Enter': { name: 'Enter 確認/換行', desc: '送出訊息或換到下一行。', combos: [] },
            'Backspace': { name: 'Backspace 橡皮擦', desc: '刪除游標「左邊」(前面) 的文字。', combos: [] },
            'Escape': { name: 'Esc 逃跑鍵', desc: '取消動作、關閉彈出窗或退出全螢幕遊戲。', combos: [] },
            'NumLock': { name: 'Num Lock 數字鎖', desc: '控制右邊數字鍵盤。燈亮打數字，燈滅變成方向鍵、Home、End 功能喔！', extra: '觀察右上角第一個燈號' },
            'Digit1': { name: '1 / ㄅ / !', desc: '打數字 1。按住 Shift 變驚嘆號 (!)。注音是「ㄅ」。', combos: [] },
            'Digit2': { name: '2 / ㄉ / @', desc: '打數字 2。按住 Shift 變小老鼠 (@)。注音是「ㄉ」。', combos: [] },

            // 方向鍵
            'ArrowUp': { name: '上箭頭', desc: '將游標往上移動，或是網頁向上捲動。', combos: [] },
            'ArrowDown': { name: '下箭頭', desc: '將游標往下移動，或是網頁向下捲動。', combos: [] },
            'ArrowLeft': { name: '左箭頭', desc: '將游標往左邊移動。', combos: [] },
            'ArrowRight': { name: '右箭頭', desc: '將游標往右邊移動。', combos: [] },

            // 數字鍵盤專用 (第二功能)
            'Numpad7': { name: '數字 7', nameAlt: 'Home 鍵', desc: '輸入數字 7。', descAlt: '瞬間跳到這一行最前面。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad8': { name: '數字 8', nameAlt: '上箭頭', desc: '輸入數字 8。', descAlt: '將游標向上移動。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad9': { name: '數字 9', nameAlt: 'Page Up', desc: '輸入數字 9。', descAlt: '畫面往上翻一頁。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad4': { name: '數字 4', nameAlt: '左箭頭', desc: '輸入數字 4。', descAlt: '將游標向左移動。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad5': { name: '數字 5', desc: '輸入數字 5。這個鍵上面有個「小凸點」，方便找位置。', combos: [] },
            'Numpad6': { name: '數字 6', nameAlt: '右箭頭', desc: '輸入數字 6。', descAlt: '將游標向右移動。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad1': { name: '數字 1', nameAlt: 'End 鍵', desc: '輸入數字 1。', descAlt: '瞬間跳到這一行最後面。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad2': { name: '數字 2', nameAlt: '下箭頭', desc: '輸入數字 2。', descAlt: '將游標向下移動。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad3': { name: '數字 3', nameAlt: 'Page Down', desc: '輸入數字 3。', descAlt: '畫面往下翻一頁。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'Numpad0': { name: '數字 0', nameAlt: 'Insert 鍵', desc: '輸入數字 0。', descAlt: '切換「插入」或「取代」打字模式。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'NumpadDecimal': { name: '小數點 .', nameAlt: 'Delete 鍵', desc: '打出小數點。', descAlt: '刪除游標「右邊」(後面) 的字。', extra: '這是在 Num Lock 燈「滅掉」時的功能喔！' },
            'NumpadEnter': { name: 'Enter (數字區)', desc: '功能和中間的 Enter 一樣，方便右手快速確認。', combos: [] },
            'NumpadAdd': { name: '加號 +', desc: '數學運算的加法符號。', combos: [] },
            'NumpadSubtract': { name: '減號 -', desc: '數學運算的減法符號。', combos: [] },
            'NumpadMultiply': { name: '乘號 *', desc: '數學運算的乘法符號。', combos: [] },
            'NumpadDivide': { name: '除號 /', desc: '數學運算的除法符號。', combos: [] }
        };

        // 【智慧隨機題庫】
        const bankBuckets = {
            editing: [
                { t: "打錯字了！我要用哪個「橡皮擦」把左邊的字擦掉？", k: ['Backspace'] },
                { t: "我想把這個訊息「送出」，或是要「換下一行」，要按？", k: ['Enter'] },
                { t: "鍵盤上「最長」的那個按鍵是誰？", k: ['Space'] },
                { t: "打字打到一半想變英文，按哪顆鍵最快？", k: ['Shift'] },
                { t: "在填表單的時候，按什麼鍵可以跳到「下一個格子」？", k: ['Tab'] },
                { t: "想要打出的英文字母全部都變成「大寫」，要按哪個鎖定鍵？", k: ['CapsLock'] },
                { t: "把游標「右邊」的錯字刪掉，要按什麼？", k: ['Delete'] },
                { t: "想要打出胖胖的全形字(像這樣：ＡＢＣ)，要按 Shift 加上？", k: ['Shift', 'Space'] },
                { t: "要怎麼開啟或關閉中文輸入法呢？按 Ctrl 加上？", k: ['Control', 'Space'] },
                { t: "不小心把打好的字「吃掉」了！可能是按到哪個魔法開關？", k: ['Insert'] }
            ],
            shortcuts: [
                { t: "老師說這段話很重要，請用組合技把它「複製」起來！", k: ['Control', 'KeyC'] },
                { t: "複製好了，現在要把它「貼上」到作業簿裡！", k: ['Control', 'KeyV'] },
                { t: "糟糕！不小心把作業刪掉了，快吃「後悔藥」復原！", k: ['Control', 'KeyZ'] },
                { t: "老師說要「全選」(把全部文字選起來)，請按 Ctrl 加？", k: ['Control', 'KeyA'] },
                { t: "辛苦打完的報告要「存檔」，請按 Ctrl 加上？", k: ['Control', 'KeyS'] },
                { t: "想要把文字「剪下」(移到別的地方)，請按 Ctrl 加上？", k: ['Control', 'KeyX'] },
                { t: "想要在網頁裡「尋找」特定的字，請按 Ctrl 加上？", k: ['Control', 'KeyF'] },
                { t: "網頁跑不動了，按哪個鍵可以讓它「重新整理」？", k: ['F5'] },
                { t: "遇到問題需要「呼叫說明小幫手」，可以按哪顆功能鍵？", k: ['F1'] },
                { t: "想要取消正在做的動作，要按左上角的「逃跑鍵」？", k: ['Escape'] }
            ],
            navigation: [
                { t: "玩遊戲的時候，要往「上面」走，請按？", k: ['ArrowUp'] },
                { t: "賽車遊戲要往「左邊」轉彎，請按？", k: ['ArrowLeft'] },
                { t: "往下捲動網頁，除了用滑鼠，還可以按哪個方向鍵？", k: ['ArrowDown'] },
                { t: "想要往右邊移動一格，請按？", k: ['ArrowRight'] },
                { t: "網頁太長了，我想一秒鐘「回到最頂端」！", k: ['Home'] },
                { t: "這一行字太多，我想直接跳到這行的「最後面」！", k: ['End'] },
                { t: "這一頁看完了，請按 Page Down 往「下一頁」！", k: ['PageDown'] },
                { t: "想往上翻回「上一頁」，請按？", k: ['PageUp'] },
                { t: "想要直接跳到整篇文章的「最後一頁」，可以按 Ctrl 加上？", k: ['Control', 'End'] },
                { t: "想要直接跳到整篇文章的「第一頁」，可以按 Ctrl 加上？", k: ['Control', 'Home'] }
            ],
            numpad: [
                { t: "請開啟「數字鍵盤」的小燈泡 (Num Lock)！", k: ['NumLock'] },
                { t: "請按右邊數字鍵盤上的「Enter」鍵！", k: ['NumpadEnter'] },
                { t: "用右邊的數字區輸入數字「5」！(上面有小凸點喔)", k: ['Numpad5'] },
                { t: "數學課要打「加號 +」，請按數字區的哪個鍵？", k: ['NumpadAdd'] },
                { t: "數學課要打「減號 -」，請按數字區的哪個鍵？", k: ['NumpadSubtract'] },
                { t: "想要打數學的「乘號 *」，請按數字區的哪個鍵？", k: ['NumpadMultiply'] },
                { t: "想要打數學的「除號 /」，請按數字區的哪個鍵？", k: ['NumpadDivide'] },
                { t: "右邊數字鍵盤的「小數點 .」，請按哪個鍵？", k: ['NumpadDecimal'] },
                { t: "用數字鍵盤打出數字「0」，請按？", k: ['Numpad0'] },
                { t: "用數字鍵盤打出數字「9」，請按？", k: ['Numpad9'] }
            ],
            symbols: [
                { t: "想要輸入「驚嘆號 !」，要按住 Shift 加上哪個數字鍵？", k: ['Shift', 'Digit1'] },
                { t: "請輸入電子郵件會用到的「小老鼠 @」符號！", k: ['Shift', 'Digit2'] },
                { t: "想要打出 Hashtag「井字號 #」，要按住 Shift 加上？", k: ['Shift', 'Digit3'] },
                { t: "想要輸入代表錢錢的「$」，要按住 Shift 加上？", k: ['Shift', 'Digit4'] },
                { t: "想要輸入「左括號 ( 」，請按 Shift 加上？", k: ['Shift', 'Digit9'] },
                { t: "想要打出「問號 ?」，要按住 Shift 加上哪個鍵？", k: ['Shift', 'Slash'] },
                { t: "請輸入注音符號「ㄅ」！", k: ['Digit1'] },
                { t: "請輸入注音符號「ㄆ」！", k: ['KeyQ'] },
                { t: "請輸入注音符號「ㄇ」！", k: ['KeyA'] },
                { t: "輸入注音的「三聲 ˇ」，請按哪個鍵？", k: ['Digit3'] }
            ]
        };

        let quizQuestions = [], quizState = { idx: 0, score: 0, lives: 3 }, pressedKeys = new Set(), keyboardScale = 1;
        const floatWin = document.getElementById('floating-window'), dragHandle = document.getElementById('drag-handle');
        let isDragging = false, startX, startY, hasMoved = false;

        dragHandle.addEventListener('mousedown', (e) => {
            if(e.target.tagName === 'BUTTON') return;
            isDragging = true; const rect = floatWin.getBoundingClientRect();
            if (!hasMoved) {
                floatWin.style.left = rect.left + 'px'; floatWin.style.top = rect.top + 'px';
                floatWin.style.right = 'auto'; floatWin.style.bottom = 'auto'; hasMoved = true;
            }
            startX = e.clientX - floatWin.offsetLeft; startY = e.clientY - floatWin.offsetTop;
        });
        document.addEventListener('mousemove', (e) => { if (!isDragging) return; let newX = e.clientX - startX, newY = e.clientY - startY; floatWin.style.left = `${newX}px`; floatWin.style.top = `${newY}px`; });
        document.addEventListener('mouseup', () => { isDragging = false; });

        function toggleMinimize() { floatWin.classList.toggle('minimized'); }
        function zoomKeyboard(delta) { keyboardScale = Math.min(1.4, Math.max(0.5, keyboardScale + delta)); document.getElementById('keyboard-case').style.transform = `scale(${keyboardScale})`; }

        document.addEventListener('keydown', (e) => {
            if (e.key.length > 1 && !['Enter','Backspace','F12'].includes(e.key) && e.code !== 'Space') e.preventDefault();
            if (e.code === 'Space') e.preventDefault();
            updateLocks(e); pressedKeys.add(e.code);
            const el = document.getElementById(e.code); if (el) el.classList.add('active');
            currentMode === 'practice' ? showKeyInfo(e.code, e.key) : checkQuiz(e);
        });
        document.addEventListener('keyup', (e) => {
            pressedKeys.delete(e.code); const el = document.getElementById(e.code); if (el) el.classList.remove('active');
            updateLocks(e);
        });

        function updateLocks(e) { 
            if (!e) return;
            isNumLockOn = e.getModifierState("NumLock");
            ['NumLock', 'CapsLock', 'ScrollLock'].forEach(lock => { 
                const el = document.getElementById('led-' + lock.toLowerCase().replace('lock','')); 
                if (el) e.getModifierState(lock) ? el.classList.add('on') : el.classList.remove('on'); 
            }); 
        }

        function setMode(mode) {
            currentMode = mode; document.getElementById('panel-practice').style.display = mode === 'practice' ? 'block' : 'none';
            document.getElementById('panel-quiz').style.display = mode === 'quiz' ? 'flex' : 'none'; document.getElementById('panel-result').classList.add('hidden');
            const btnP = document.getElementById('btn-practice'), btnQ = document.getElementById('btn-quiz');
            if (mode === 'practice') { btnP.className = "px-5 py-2 rounded-lg text-sm font-bold bg-white shadow text-pink-600 transition-all flex items-center gap-1"; btnQ.className = "px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700 transition-all flex items-center gap-1"; document.getElementById('window-title').innerHTML = "<span>🎮</span> 練習模式"; }
            else { btnP.className = "px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700 transition-all flex items-center gap-1"; btnQ.className = "px-5 py-2 rounded-lg text-sm font-bold bg-white shadow text-purple-600 transition-all flex items-center gap-1"; document.getElementById('window-title').innerHTML = "<span>🏆</span> 闖關挑戰"; startQuiz(); }
        }

        function showKeyInfo(code, char) {
            document.getElementById('info-placeholder').classList.add('hidden'); document.getElementById('info-content').classList.remove('hidden');
            const k = keyData[code], domEl = document.getElementById(code);
            
            // 處理視覺顯示
            if (domEl) {
                const kMain = domEl.querySelector('.k-main'), kZh = domEl.querySelector('.k-zh'), kShift = domEl.querySelector('.k-shift');
                document.getElementById('info-key-main').innerText = kMain ? kMain.innerText : (char.length===1?char.toUpperCase():'⌨');
                document.getElementById('info-key-zh').innerText = kZh ? kZh.innerText : ''; document.getElementById('info-key-shift').innerText = kShift ? kShift.innerText : '';
            }

            // 處理文字說明 (數字鍵盤智慧切換)
            let displayName = k ? k.name : (char.length===1?char.toUpperCase():code);
            let displayDesc = k ? k.desc : "標準輸入按鍵。";
            
            // 如果 Num Lock 關閉且按的是有備用功能的數字鍵
            if (k && !isNumLockOn && k.nameAlt) {
                displayName = k.nameAlt + " (原 " + k.name + ")";
                displayDesc = "【目前功能：" + k.nameAlt + "】" + k.descAlt;
            }

            document.getElementById('info-key-name').innerText = displayName.split(' ')[0];
            document.getElementById('info-code').innerText = code;
            document.getElementById('info-desc').innerText = displayDesc;
            
            const extra = document.getElementById('info-extra-box'); 
            if (k && (k.extra || (k.nameAlt && !isNumLockOn))) { 
                extra.classList.remove('hidden'); 
                document.getElementById('info-extra').innerText = k.extra || "目前數字功能已關閉，變成功能鍵囉！"; 
            } else extra.classList.add('hidden');
            
            document.getElementById('info-combos').innerHTML = k && k.combos && k.combos.length ? k.combos.map(c => `<li>🔹 ${c}</li>`).join('') : "<li>這裡沒有組合技喔</li>";
        }

        function shuffle(arr) { return arr.sort(() => 0.5 - Math.random()); }
        function startQuiz() {
            quizQuestions = shuffle([...shuffle([...bankBuckets.editing]).slice(0,4), ...shuffle([...bankBuckets.shortcuts]).slice(0,4), ...shuffle([...bankBuckets.navigation]).slice(0,4), ...shuffle([...bankBuckets.numpad]).slice(0,4), ...shuffle([...bankBuckets.symbols]).slice(0,4)]);
            quizState = { idx: 0, score: 0, lives: 3 }; renderQuiz();
        }
        function renderQuiz() {
            if (quizState.idx >= quizQuestions.length) { showResult(); return; }
            const q = quizQuestions[quizState.idx]; document.getElementById('q-idx').innerText = quizState.idx + 1; document.getElementById('q-score').innerText = quizState.score;
            document.getElementById('q-lives').innerText = '❤️'.repeat(quizState.lives); document.getElementById('q-text').innerText = `Q${quizState.idx + 1}. ${q.t}`;
            document.getElementById('q-feedback').innerText = ''; document.getElementById('q-feedback').className = "";
        }
        function checkQuiz(e) {
            const q = quizQuestions[quizState.idx]; let isCorrect = false;
            if (q.k.length > 1) {
                isCorrect = q.k.every(req => {
                    if (req === 'Control') return pressedKeys.has('ControlLeft') || pressedKeys.has('ControlRight');
                    if (req === 'Shift') return pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
                    return pressedKeys.has(req);
                });
            } else {
                const t = q.k[0];
                if (t === 'Control') isCorrect = ['ControlLeft','ControlRight'].includes(e.code);
                else if (t === 'Shift') isCorrect = ['ShiftLeft','ShiftRight'].includes(e.code);
                else isCorrect = e.code === t;
            }
            if (isCorrect) { quizState.score += 5; document.getElementById('q-feedback').innerText = "⭕ 答對了！好棒！"; document.getElementById('q-feedback').className = "h-10 text-center text-lg font-bold text-green-600 bg-green-50 flex items-center justify-center rounded-lg"; setTimeout(() => { quizState.idx++; renderQuiz(); }, 1000); }
            else if (q.k.length === 1) handleWrong();
        }
        function handleWrong() {
            quizState.lives--; document.getElementById('q-feedback').innerText = "❌ 不對喔，再試試看！"; document.getElementById('q-feedback').className = "h-10 text-center text-lg font-bold text-red-500 bg-red-50 flex items-center justify-center rounded-lg";
            document.getElementById('q-lives').innerText = '❤️'.repeat(quizState.lives); if (quizState.lives <= 0) setTimeout(() => { quizState.idx++; quizState.lives = 3; renderQuiz(); }, 1500);
        }
        function showResult() {
            document.getElementById('panel-quiz').style.display = 'none'; document.getElementById('panel-result').classList.remove('hidden'); document.getElementById('res-score').innerText = quizState.score;
            const s = quizState.score; document.getElementById('res-comment').innerText = s >= 100 ? "太神啦！你是鍵盤大師！" : s >= 80 ? "優秀！給你拍拍手！" : "及格囉！繼續加油！";
        }
        document.querySelectorAll('.key').forEach(el => {
            el.addEventListener('mousedown', () => { 
                if (currentMode === 'practice') {
                    showKeyInfo(el.id, el.innerText);
                    document.getElementById(el.id).classList.add('active');
                } else {
                    checkQuiz({ code: el.id });
                    document.getElementById(el.id).classList.add('active');
                }
            });
            el.addEventListener('mouseup', () => { document.getElementById(el.id).classList.remove('active'); });
        });
    </script>
</body>
</html>
