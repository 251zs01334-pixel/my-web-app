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
  if (user === cpu) return 'あいこ';
  if (
    (user === 'グー' && cpu === 'チョキ') ||
    (user === 'チョキ' && cpu === 'パー') ||
    (user === 'パー' && cpu === 'グー')
  ) {
    return 'あなたの勝ち！';
  }
  return 'あなたの負け…';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:' + port);
  const choice = url.searchParams.get('hand');

  let resultHtml = '<p>大きいボタンを押してじゃんけんを始めましょう！</p>';
  if (hands.includes(choice)) {
    const cpu = hands[Math.floor(Math.random() * hands.length)];
    const outcome = judge(choice, cpu);
    resultHtml =
      '<p>あなた：<strong>' + escapeHtml(choice) + '</strong> ／ 相手：<strong>' + escapeHtml(cpu) + '</strong></p>' +
      '<p class="outcome">結果：' + escapeHtml(outcome) + '</p>';
  }

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
        max-width: 720px;
        margin: 40px auto;
        padding: 0 16px;
        background: #ffffff;
        color: #111827;
      }
      .card {
        padding: 24px;
        border-radius: 16px;
        background: #ffffff;
      }
      h1 {
        font-size: 28px;
        margin-bottom: 20px;
      }
      .btns {
        display: flex;
        gap: 20px;
        margin-top: 16px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .hand-btn {
        width: 170px;
        height: 170px;
        font-size: 36px;
        font-weight: 800;
        background: #ffffff;
        color: #111827;
        border: 4px solid #111827;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.08s ease, background-color 0.15s ease;
      }
      .hand-btn:hover {
        background: #f3f4f6;
        transform: translateY(-2px);
      }
      .hand-btn:active {
        transform: translateY(1px);
        background: #e5e7eb;
      }
      .result {
        margin-top: 28px;
        padding: 18px 20px;
        background: #f8fafc;
        border: 2px solid #cbd5e1;
        border-radius: 12px;
        font-size: 18px;
      }
      .outcome {
        font-size: 22px;
        font-weight: 800;
        margin-top: 8px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>じゃんけんWebアプリ</h1>
      <form method="GET" action="/" class="btns">
        <button type="submit" name="hand" value="グー" class="hand-btn">グー</button>
        <button type="submit" name="hand" value="チョキ" class="hand-btn">チョキ</button>
        <button type="submit" name="hand" value="パー" class="hand-btn">パー</button>
      </form>
      <div class="result">${resultHtml}</div>
    </div>
  </body>
</html>`);
});

server.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
