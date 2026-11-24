'use strict';
const http = require('node:http');
const port = process.env.PORT || 8000;
const hands = ['グー', 'チョキ', 'パー'];

function escapeHtml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function judge(user, cpu) {
  if (user === cpu) return 'draw';
  if (
    (user === 'グー' && cpu === 'チョキ') ||
    (user === 'チョキ' && cpu === 'パー') ||
    (user === 'パー' && cpu === 'グー')
  ) {
    return 'win';
  }
  return 'lose';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:' + port);
  const choice = url.searchParams.get('hand');
  const isAikode = url.searchParams.get('aikode') === '1';

  let resultHtml = '<p class="lead">大きな絵文字ボタンを押して、じゃんけんを始めましょう！</p>';
  let nextAikode = false;
  const headingText = isAikode ? 'あいこで…！' : 'じゃんけんWebアプリ';
  const subtitleText = isAikode ? '「あいこで〜、しょっ！」好きな手を選んでね' : '相手と一発勝負！好きな手を選んでね';

  if (hands.includes(choice)) {
    const cpu = hands[Math.floor(Math.random() * hands.length)];
    const outcome = judge(choice, cpu);
    const prefix = isAikode ? 'あいこで ' : '';

    if (outcome === 'win') {
      resultHtml =
        '<p class="picks">あなた：<strong>' + escapeHtml(choice) + '</strong> ／ 相手：<strong>' + escapeHtml(cpu) + '</strong></p>' +
        '<p class="outcome win">' + prefix + 'あなたの勝ち！</p>';
      nextAikode = false;
    } else if (outcome === 'lose') {
      resultHtml =
        '<p class="picks">あなた：<strong>' + escapeHtml(choice) + '</strong> ／ 相手：<strong>' + escapeHtml(cpu) + '</strong></p>' +
        '<p class="outcome lose">' + prefix + 'あなたの負け…</p>';
      nextAikode = false;
    } else {
      resultHtml =
        '<p class="picks">あなた：<strong>' + escapeHtml(choice) + '</strong> ／ 相手：<strong>' + escapeHtml(cpu) + '</strong></p>' +
        '<p class="outcome draw">あいこで…！もう一回手を選んでね</p>';
      nextAikode = true;
    }
  }

  const aikodeInputHtml = nextAikode ? '<input type="hidden" name="aikode" value="1">' : '';

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>じゃんけんWebアプリ</title>
    <style>
      body {
        font-family: sans-serif;
        min-height: 100vh;
        margin: 0;
        padding: 36px 16px;
        background: linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 50%, #fef3c7 100%);
        color: #0f172a;
        box-sizing: border-box;
      }
      .card {
        max-width: 740px;
        margin: 0 auto;
        padding: 32px 24px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
        border: 2px solid #ffffff;
      }
      h1 {
        font-size: 30px;
        margin: 0 0 8px;
        text-align: center;
        background: linear-gradient(90deg, #2563eb, #9333ea, #ea580c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        text-align: center;
        color: #475569;
        margin: 0 0 24px;
        font-size: 15px;
      }
      .btns {
        display: flex;
        gap: 18px;
        margin-top: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .hand-btn {
        width: 175px;
        height: 175px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: transform 0.12s ease, box-shadow 0.15s ease, filter 0.15s ease;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }
      .hand-btn .emoji {
        font-size: 64px;
        line-height: 1;
      }
      .hand-btn .label {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.05em;
      }
      .hand-btn.rock {
        background: #eff6ff;
        border: 3px solid #3b82f6;
        color: #1d4ed8;
      }
      .hand-btn.scissors {
        background: #fdf2f8;
        border: 3px solid #ec4899;
        color: #be185d;
      }
      .hand-btn.paper {
        background: #f0fdf4;
        border: 3px solid #22c55e;
        color: #15803d;
      }
      .hand-btn:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 14px 24px rgba(15, 23, 42, 0.14);
        filter: brightness(0.98);
      }
      .hand-btn:active {
        transform: translateY(1px) scale(0.99);
      }
      .result {
        margin-top: 28px;
        padding: 20px 22px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        font-size: 18px;
        text-align: center;
      }
      .lead, .picks {
        margin: 0;
        color: #334155;
      }
      .outcome {
        display: inline-block;
        font-size: 24px;
        font-weight: 800;
        margin: 12px 0 0;
        padding: 6px 14px;
        border-radius: 10px;
      }
      .outcome.win {
        color: #dc2626;
        background: #fef2f2;
      }
      .outcome.lose {
        color: #2563eb;
        background: #eff6ff;
      }
      .outcome.draw {
        color: #facc15;
        background: #1e293b;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${escapeHtml(headingText)}</h1>
      <p class="subtitle">${escapeHtml(subtitleText)}</p>
      <form method="GET" action="/" class="btns">
        ${aikodeInputHtml}
        <button type="submit" name="hand" value="グー" class="hand-btn rock">
          <span class="emoji">✊</span>
          <span class="label">グー</span>
        </button>
        <button type="submit" name="hand" value="チョキ" class="hand-btn scissors">
          <span class="emoji">✌️</span>
          <span class="label">チョキ</span>
        </button>
        <button type="submit" name="hand" value="パー" class="hand-btn paper">
          <span class="emoji">🖐️</span>
          <span class="label">パー</span>
        </button>
      </form>
      <div class="result">${resultHtml}</div>
    </div>
  </body>
</html>`);
});

server.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
