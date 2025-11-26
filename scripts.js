// ========== 全局变量 ==========
window.currentLang = localStorage.getItem('jdes-lang') || 'en';

const myTickets = [
  [4, 10, 17, 19, 25, 31, 6],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 6, 8, 9, 11, 24, 8],
  [4, 5, 6, 11, 14, 15, 9],
  [3, 8, 9, 12, 14, 15, 16]
];

const translations = {
  en: {
    motto: "Even in the face of gales, never give up",
    heroTitle: "JDES",
    heroDesc: "Record thoughts · Share creations · Explore the edge of the digital world",
    aboutTitle: "About JDES",
    aboutDesc: "Hi, I'm JDES a digital nomad, indie developer, and lifelong learner.<br>I believe technology should serve humanity, and writing is an extension of thought.<br>This is where I share insights, projects, and inspiration.",
    contactTitle: "Get in Touch",
    contactDesc: "Feel free to reach out via email or social media:",
    aiTitle: "Ask JDES AI",
    aiPlaceholder: "Ask something (e.g., What is JDES?)",
    langToggle: "ZH",
    noPosts: "No posts yet.",
    icpText: 'Beijing ICP Filing No. <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color:#999;">12345678-1</a>',
    counterText: 'Running for <span id="busuanzi_value_site_uv"></span> days, visited <span id="busuanzi_value_site_pv"></span> times'
  },
  zh: {
    motto: "纵使疾风起，人生不言弃",
    heroTitle: "JDES-绝地而生",
    heroDesc: "记录思想 · 分享创造 · 探索数字世界的边界",
    aboutTitle: "关于 JDES-绝地而生",
    aboutDesc: "你好，我是 JDES，一名数字游民、独立开发者与终身学习者。<br>我相信技术应服务于人，而写作是思想的延伸。<br>这里是我分享洞见、项目与灵感的地方。",
    contactTitle: "联系我",
    contactDesc: "欢迎通过邮箱或社交媒体联系我：",
    aiTitle: "向JDES AI提问",
    aiPlaceholder: "输入问题（例如：JDES 是什么意思？）",
    langToggle: "EN",
    noPosts: "暂无文章",
    icpText: '京ICP备 <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color:#999;">12345678-1</a> 号',
    counterText: '已运行 <span id="busuanzi_value_site_uv"></span> 天，访问 <span id="busuanzi_value_site_pv"></span> 次'
  }
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initLottoInputs();
  applyLanguage(window.currentLang);
  loadMockStock();
});

// ========== Starfield Animation ==========
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const isMobile = window.innerWidth <= 768;
  const starCount = isMobile ? 80 : 300;

  class Star {
    constructor() {
      this.reset();
      this.depth = Math.random();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = Math.random() * 0.15 + 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > canvas.height + 10) this.y = -10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.x < -10) this.x = canvas.width + 10;
    }
    draw(time) {
      const size = 0.3 + this.depth * 1.4;
      const baseOpacity = 0.2 + this.depth * 0.8;
      const twinkle = Math.sin(time * (0.8 + this.depth * 1.5)) * 0.25;
      const opacity = Math.max(0, Math.min(1, baseOpacity + twinkle));
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }
  }

  const stars = Array.from({ length: starCount }, () => new Star());
  let time = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.016;
    stars.forEach(star => {
      star.update();
      star.draw(time);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ========== Mock Stock ==========
function loadMockStock() {
  setTimeout(() => {
    document.getElementById('stock-display').innerHTML = `
      <div style="text-align: center;">
        <div style="font-weight: 600; color: #f57c00;">12.45</div>
        <div style="font-size: 12px; color: #aaa;">↑0.32 (2.64%)</div>
      </div>
    `;
  }, 300);
}

// ========== Lotto Logic ==========
function initLottoInputs() {
  const redInputsContainer = document.getElementById('red-inputs');
  const inputs = [];
  for (let i = 0; i < 6; i++) {
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.min = 1;
    inp.max = 33;
    inp.placeholder = '';
    inp.dataset.index = i;
    redInputsContainer.appendChild(inp);
    inputs.push(inp);

    inp.addEventListener('input', function(e) {
      let val = e.target.value.trim();
      if (val === '') return;
      val = val.replace(/\D/g, '');
      if (val.length > 2) val = val.slice(0, 2);
      e.target.value = val;

      const num = parseInt(val);
      if (num >= 1 && num <= 33) {
        if (val.length === 2 || (val.length === 1 && num >= 1)) {
          const nextIndex = parseInt(e.target.dataset.index) + 1;
          if (nextIndex < 6) {
            inputs[nextIndex].focus();
          } else {
            document.getElementById('blue-input').focus();
          }
        }
      }
    });

    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const idx = parseInt(e.target.dataset.index);
        if (idx < 5) {
          inputs[idx + 1].focus();
        } else {
          document.getElementById('blue-input').focus();
        }
      }
    });
  }

  document.getElementById('blue-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkLottery();
    }
  });
}

function checkPrize(drawnRed, drawnBlue, ticket) {
  const redSet = new Set(drawnRed);
  const ticketRed = ticket.slice(0, 6);
  const ticketBlue = ticket[6];
  const matchRed = ticketRed.filter(n => redSet.has(n)).length;
  const matchBlue = ticketBlue === drawnBlue ? 1 : 0;

  if (matchRed === 6 && matchBlue === 1) return { level: '1st Prize', prize: '≈¥5M+' };
  if (matchRed === 6 && matchBlue === 0) return { level: '2nd Prize', prize: '≈¥200K+' };
  if (matchRed === 5 && matchBlue === 1) return { level: '3rd Prize', prize: '¥3,000' };
  if ((matchRed === 5 && matchBlue === 0) || (matchRed === 4 && matchBlue === 1)) return { level: '4th Prize', prize: '¥200' };
  if ((matchRed === 4 && matchBlue === 0) || (matchRed === 3 && matchBlue === 1)) return { level: '5th Prize', prize: '¥10' };
  if (matchBlue === 1) return { level: '6th Prize', prize: '¥5' };
  return null;
}

function checkLottery() {
  const redInputs = document.querySelectorAll('#red-inputs input');
  const blueInput = document.getElementById('blue-input');

  const reds = Array.from(redInputs).map(inp => parseInt(inp.value) || 0).filter(n => n > 0);
  const blue = parseInt(blueInput.value) || 0;

  if (reds.length !== 6 || reds.some(n => n < 1 || n > 33) || blue < 1 || blue > 16) {
    document.getElementById('my-result').innerHTML = `<div style="color:#f44336;">Please enter valid draw numbers!</div>`;
    return;
  }

  const uniqueReds = [...new Set(reds)].sort((a, b) => a - b);
  if (uniqueReds.length !== 6) {
    document.getElementById('my-result').innerHTML = `<div style="color:#f44336;">Red balls must be unique!</div>`;
    return;
  }

  let results = [];
  for (let i = 0; i < myTickets.length; i++) {
    const prize = checkPrize(uniqueReds, blue, myTickets[i]);
    if (prize) {
      results.push(`#${i+1}: ${prize.level} (${prize.prize})`);
    }
  }

  const resultEl = document.getElementById('my-result');
  if (results.length > 0) {
    resultEl.innerHTML = `<div style="color: #4caf50;">🎉 Congratulations!</div>` + results.map(r => `<div>${r}</div>`).join('');
  } else {
    resultEl.innerHTML = `<div style="color: #888;">No win this time. Keep going!</div>`;
  }
}

// ========== AI Assistant ==========
function appendMessage(role, content) {
  const chatContainer = document.getElementById('chat-container');
  const el = document.createElement('div');
  el.className = `ai-message ai-${role}-msg`;
  const prefix = role === 'user' ? (window.currentLang === 'zh' ? '我：' : 'Me:') : (window.currentLang === 'zh' ? 'JDES AI：' : 'JDES AI:');
  el.innerHTML = `<strong>${prefix}</strong> ${content}`;
  chatContainer.appendChild(el);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mockResponse(userMsg) {
  if (window.currentLang === 'zh') {
    const replies = [
      "我是 JDES（绝地而生）的助手。正式版将通过 DashScope 连接JDES AI。",
      "当前为演示模式。真实 AI 需要正确配置 SDK 和域名白名单。",
      "JDES 意为“绝地而生”，是一个关于数字极简、独立开发与深度思考的个人博客。",
      "你可以试试问：“JDES 是什么意思？” 或 “彩票面板怎么用？”",
      "由于未授权域名，DashScope SDK 当前无法启用，正在使用模拟回复。"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  } else {
    const replies = [
      "I'm JDES's assistant. In production, I'd connect to JDES AI via DashScope.",
      "This is a demo mode. Real AI requires proper SDK setup and domain whitelist.",
      "JDES stands for 'Jue Di Er Sheng' (Rising from Adversity), a personal blog about digital minimalism, indie dev, and deep thinking.",
      "Try asking: 'What is the motto of JDES?' or 'Tell me about the lottery panel.'",
      "DashScope Web SDK may be blocked due to missing domain authorization."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
}

async function askQwen() {
  const inputEl = document.getElementById('user-input');
  const userMessage = inputEl.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  inputEl.value = '';
  inputEl.disabled = true;
  document.getElementById('ai-send-btn').disabled = true;

  appendMessage('assistant', window.currentLang === 'zh' ? '思考中...' : 'Thinking...');

  try {
    if (typeof window.dashClient !== 'undefined') {
      const response = await window.dashClient.chatCompletion({
        model: 'qwen-max',
        messages: [
          { 
            role: 'system', 
            content: window.currentLang === 'zh' 
              ? '你是 JDES（绝地而生）博客的助手，请用简洁、专业、友好的中文回答问题。' 
              : 'You are JDES, a personal blog assistant. Respond concisely, helpfully, and professionally in English.'
          },
          { role: 'user', content: userMessage }
        ]
      });
      const container = document.getElementById('chat-container');
      if (container.lastChild?.textContent?.includes(window.currentLang === 'zh' ? '思考中...' : 'Thinking...')) {
        container.removeChild(container.lastChild);
      }
      appendMessage('assistant', response.output.text);
    } else {
      await new Promise(r => setTimeout(r, 800));
      const container = document.getElementById('chat-container');
      if (container.lastChild?.textContent?.includes(window.currentLang === 'zh' ? '思考中...' : 'Thinking...')) {
        container.removeChild(container.lastChild);
      }
      appendMessage('assistant', mockResponse(userMessage));
    }
  } catch (error) {
    console.error('AI Error:', error);
    const container = document.getElementById('chat-container');
    if (container.lastChild?.textContent?.includes(window.currentLang === 'zh' ? '思考中...' : 'Thinking...')) {
      container.removeChild(container.lastChild);
    }
    appendMessage('assistant', `⚠️ ${error.message || (window.currentLang === 'zh' ? 'AI 不可用，正在使用演示模式。' : 'AI unavailable. Using demo mode.')}`);
  } finally {
    inputEl.disabled = false;
    document.getElementById('ai-send-btn').disabled = false;
    inputEl.focus();
  }
}

document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    askQwen();
  }
});

// ========== Language & Posts ==========
function applyLanguage(lang) {
  const t = translations[lang];
  document.querySelector('.motto-text').textContent = t.motto;
  document.querySelector('.hero h1').innerHTML = t.heroTitle;
  document.querySelector('.hero p').textContent = t.heroDesc;

  document.querySelector('#about h2').textContent = t.aboutTitle;
  document.querySelector('#about p').innerHTML = t.aboutDesc;
  document.querySelector('#contact h2').textContent = t.contactTitle;
  document.querySelector('#contact p:first-of-type').textContent = t.contactDesc;
  document.querySelector('#ai-assistant h2').textContent = t.aiTitle;
  document.getElementById('user-input').placeholder = t.aiPlaceholder;
  document.getElementById('lang-toggle').textContent = t.langToggle;

  document.getElementById('icp-text').innerHTML = t.icpText;
  document.getElementById('counter-text').innerHTML = t.counterText;

  document.querySelector('.logo-text').setAttribute('aria-label', lang === 'zh' ? 'JDES（绝地而生）首页' : 'JDES Home');

  localStorage.setItem('jdes-lang', lang);
  window.currentLang = lang;

  loadAndRenderPosts();
}

function toggleLanguage() {
  const newLang = window.currentLang === 'en' ? 'zh' : 'en';
  applyLanguage(newLang);
}

function loadAndRenderPosts() {
  const lang = window.currentLang;
  const posts = lang === 'zh' ? [
    {
      title: "欢迎来到 JDES",
      excerpt: "这是我的第一个中文测试文章，用于验证多语言功能是否正常。",
      date: "2025年11月26日",
      category: "公告"
    }
  ] : [
    {
      title: "Welcome to JDES",
      excerpt: "This is a sample post to verify multilingual support.",
      date: "Nov 26, 2025",
      category: "Announcement"
    }
  ];

  const container = document.getElementById('posts');
  if (posts.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#777;">${translations[lang].noPosts}</p>`;
  } else {
    container.innerHTML = posts.map(post => `
      <article class="post-card">
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <div class="post-meta">${post.date} · ${post.category}</div>
      </article>
    `).join('');
  }
}