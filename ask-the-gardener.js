/* =============================================================
   Ask the Gardener — GrowGuide AI Widget
   Drop this <script> tag just before </body> on every page:
   <script src="/ask-the-gardener.js"></script>
   ============================================================= */

(function () {
  // ── STYLES ──────────────────────────────────────────────────
  const css = `
    #atg-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #2E4228;
      color: #F5F0E8;
      border: none;
      border-radius: 100px;
      padding: 14px 22px 14px 18px;
      font-family: 'Lato', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(46,66,40,0.45);
      transition: all 0.2s;
      letter-spacing: 0.3px;
    }
    #atg-fab:hover {
      background: #4A6741;
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(46,66,40,0.5);
    }
    #atg-fab .atg-fab-icon {
      font-size: 1.2rem;
      line-height: 1;
    }
    #atg-panel {
      position: fixed;
      bottom: 88px;
      right: 24px;
      z-index: 9998;
      width: 380px;
      max-width: calc(100vw - 32px);
      max-height: 560px;
      background: #FAF6EE;
      border: 1.5px solid #D8C8B0;
      border-radius: 20px;
      box-shadow: 0 12px 48px rgba(44,24,16,0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.92) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
      transform-origin: bottom right;
    }
    #atg-panel.atg-open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .atg-header {
      background: #2C1810;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      position: relative;
    }
    .atg-header::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, #4A6741, #C8842A, #7A9E72);
    }
    .atg-header-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4A6741, #2E4228);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
      box-shadow: 0 0 0 2px rgba(74,103,65,0.4);
    }
    .atg-header-text h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1rem;
      font-weight: 700;
      color: #F5F0E8;
      margin: 0 0 2px;
      line-height: 1;
    }
    .atg-header-text p {
      font-family: 'Lato', sans-serif;
      font-size: 0.7rem;
      color: #7A9E72;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .atg-close {
      margin-left: auto;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: #C8DBC4;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .atg-close:hover { background: rgba(255,255,255,0.18); }
    .atg-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .atg-messages::-webkit-scrollbar { width: 4px; }
    .atg-messages::-webkit-scrollbar-track { background: transparent; }
    .atg-messages::-webkit-scrollbar-thumb { background: #D8C8B0; border-radius: 2px; }
    .atg-bubble {
      max-width: 90%;
      padding: 10px 14px;
      border-radius: 16px;
      font-family: 'Lato', sans-serif;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .atg-bubble.atg-bot {
      background: white;
      border: 1.5px solid #D8C8B0;
      color: #1E130C;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .atg-bubble.atg-user {
      background: #2E4228;
      color: #F5F0E8;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }
    .atg-bubble.atg-typing {
      background: white;
      border: 1.5px solid #D8C8B0;
      align-self: flex-start;
      padding: 12px 18px;
    }
    .atg-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .atg-dots span {
      width: 6px;
      height: 6px;
      background: #A89880;
      border-radius: 50%;
      animation: atgDot 1.2s infinite;
    }
    .atg-dots span:nth-child(2) { animation-delay: 0.2s; }
    .atg-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes atgDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    .atg-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .atg-suggestion {
      background: #EDE6D8;
      border: 1px solid #D8C8B0;
      color: #4A3020;
      border-radius: 100px;
      padding: 5px 12px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Lato', sans-serif;
      transition: all 0.15s;
    }
    .atg-suggestion:hover {
      background: #2E4228;
      color: #F5F0E8;
      border-color: #2E4228;
    }
    .atg-input-row {
      padding: 12px 14px;
      border-top: 1.5px solid #D8C8B0;
      display: flex;
      gap: 8px;
      background: white;
      flex-shrink: 0;
    }
    .atg-input {
      flex: 1;
      border: 1.5px solid #D8C8B0;
      border-radius: 100px;
      padding: 10px 16px;
      font-family: 'Lato', sans-serif;
      font-size: 0.85rem;
      color: #1E130C;
      background: #FAF6EE;
      outline: none;
      transition: border-color 0.15s;
    }
    .atg-input:focus { border-color: #4A6741; }
    .atg-input::placeholder { color: #A89880; }
    .atg-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #2E4228;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .atg-send:hover { background: #4A6741; }
    .atg-send:disabled { background: #C0A888; cursor: not-allowed; }
    .atg-error {
      background: #FCDCDC;
      border: 1.5px solid #F0A0A8;
      color: #8A1020;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      padding: 10px 14px;
      font-family: 'Lato', sans-serif;
      font-size: 0.82rem;
      align-self: flex-start;
      max-width: 90%;
    }
    @media (max-width: 440px) {
      #atg-panel { right: 8px; bottom: 80px; }
      #atg-fab { right: 8px; bottom: 12px; padding: 12px 16px 12px 14px; font-size: 0.82rem; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── HTML ─────────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.id = 'atg-fab';
  fab.innerHTML = `<span class="atg-fab-icon">🌱</span> Ask the Gardener`;

  const panel = document.createElement('div');
  panel.id = 'atg-panel';
  panel.innerHTML = `
    <div class="atg-header">
      <div class="atg-header-icon">🌿</div>
      <div class="atg-header-text">
        <h3>Ask the Gardener</h3>
        <p>POWERED BY AI · UK GROWING ADVICE</p>
      </div>
      <button class="atg-close" id="atg-close-btn">✕</button>
    </div>
    <div class="atg-messages" id="atg-messages"></div>
    <div class="atg-input-row">
      <input class="atg-input" id="atg-input" type="text" placeholder="Ask a gardening question…" maxlength="300" />
      <button class="atg-send" id="atg-send-btn">➤</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // ── STATE ────────────────────────────────────────────────────
  const messages = [];
  let isOpen = false;
  let isLoading = false;

  const SYSTEM_PROMPT = `You are "Ask the Gardener", the friendly AI gardening advisor for GrowGuide (growguideuk.netlify.app) — a free UK gardening tools website.

Your role:
- Give practical, accurate, friendly UK-specific gardening advice
- Keep answers concise but genuinely helpful (3–6 sentences is ideal for a chat widget)
- Always think in UK seasons, UK climate, UK regions (not US or Australian advice)
- Reference UK-specific products, suppliers or organisations where relevant (RHS, Garden Organic, etc.)
- If asked about pests, diseases, planting times, or companion planting, you can mention that GrowGuide has dedicated tools for these
- Be warm and encouraging — GrowGuide's audience includes beginners
- Never suggest anything harmful to wildlife, children or pets without a clear warning
- If a question is outside gardening entirely, politely redirect

Format: Plain conversational text only. No markdown, no bullet points, no headers — this renders in a small chat bubble.`;

  const SUGGESTIONS = [
    'Why are my tomato leaves curling?',
    'What can I plant in April?',
    'How do I improve clay soil?',
    'Best companion plants for courgettes?',
    'When should I start seeds indoors?',
  ];

  // ── FUNCTIONS ────────────────────────────────────────────────
  function getMessagesEl() { return document.getElementById('atg-messages'); }
  function getInput() { return document.getElementById('atg-input'); }
  function getSendBtn() { return document.getElementById('atg-send-btn'); }

  function scrollToBottom() {
    const el = getMessagesEl();
    el.scrollTop = el.scrollHeight;
  }

  function addBotMessage(text) {
    const el = getMessagesEl();
    const bubble = document.createElement('div');
    bubble.className = 'atg-bubble atg-bot';
    bubble.textContent = text;
    el.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function addUserMessage(text) {
    const el = getMessagesEl();
    const bubble = document.createElement('div');
    bubble.className = 'atg-bubble atg-user';
    bubble.textContent = text;
    el.appendChild(bubble);
    scrollToBottom();
  }

  function showTyping() {
    const el = getMessagesEl();
    const bubble = document.createElement('div');
    bubble.className = 'atg-bubble atg-typing';
    bubble.id = 'atg-typing';
    bubble.innerHTML = `<div class="atg-dots"><span></span><span></span><span></span></div>`;
    el.appendChild(bubble);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('atg-typing');
    if (el) el.remove();
  }

  function showWelcome() {
    const el = getMessagesEl();
    el.innerHTML = '';

    const bubble = document.createElement('div');
    bubble.className = 'atg-bubble atg-bot';
    bubble.textContent = "Hello! I'm your GrowGuide gardening advisor. Ask me anything about growing in the UK — pests, planting times, soil, watering, you name it. 🌱";
    el.appendChild(bubble);

    const sugEl = document.createElement('div');
    sugEl.className = 'atg-suggestions';
    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'atg-suggestion';
      btn.textContent = s;
      btn.onclick = () => sendMessage(s);
      sugEl.appendChild(btn);
    });
    el.appendChild(sugEl);
    scrollToBottom();
  }

  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;
    isLoading = true;

    const input = getInput();
    const sendBtn = getSendBtn();
    input.value = '';
    sendBtn.disabled = true;

    // Remove suggestion chips after first message
    document.querySelectorAll('.atg-suggestions').forEach(el => el.remove());

    addUserMessage(text);
    messages.push({ role: 'user', content: text });

    showTyping();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      messages.push({ role: 'assistant', content: reply });

      removeTyping();
      addBotMessage(reply);

    } catch (err) {
      removeTyping();
      const el = getMessagesEl();
      const errEl = document.createElement('div');
      errEl.className = 'atg-error';
      errEl.textContent = "Sorry, something went wrong. Please check your connection and try again.";
      el.appendChild(errEl);
      scrollToBottom();
      // Remove failed message from history
      messages.pop();
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── EVENTS ───────────────────────────────────────────────────
  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('atg-open', isOpen);
    fab.innerHTML = isOpen
      ? `<span class="atg-fab-icon">✕</span> Close`
      : `<span class="atg-fab-icon">🌱</span> Ask the Gardener`;
    if (isOpen && getMessagesEl().children.length === 0) showWelcome();
    if (isOpen) setTimeout(() => getInput().focus(), 250);
  });

  document.getElementById('atg-close-btn').addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('atg-open');
    fab.innerHTML = `<span class="atg-fab-icon">🌱</span> Ask the Gardener`;
  });

  document.getElementById('atg-send-btn').addEventListener('click', () => {
    sendMessage(getInput().value.trim());
  });

  document.getElementById('atg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(getInput().value.trim());
  });

})();
