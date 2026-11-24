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

  let resultHtml = '<p>ボタンを押してじゃんけんを始めましょう！</p>';
  if (hands.includes(choice)) {
    const cpu = hands[Math.floor(Math.random() * hands.length)];
    const outcome = judge(choice, cpu);
    resultHtml =
      '<p>あなた：<strong>' + escapeHtml(choice) + '</strong> ／ 相手：<strong>' + escapeHtml(cpu) + '</strong></p>' +
      '<p><strong>結果：' + escapeHtml(outcome) + '</strong></p>';
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>じゃんけんWebアプリ</title>
    <style>
      body { font-family: sans-serif; max-width: 640px; margin: 48px auto; padding: 0 16px; background: #f8fafc; color: #0f172a; }
      .card { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
      .btns { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
      button { padding: 12px 18px; font-size: 16px; border-radius: 8px; border: none; background: #2563eb; color: #fff; cursor: pointer; }
      button:hover { background: #1d4ed8; }
      .result { margin-top: 20px; padding: 16px; background: #f1f5f9; border-radius: 8px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>じゃんけんWebアプリ</h1>
      <form method="GET" action="/" class="btns">
        <button type="submit" name="hand" value="グー">✊ グー</button>
        <button type="submit" name="hand" value="チョキ">✌️ チョキ</button>
        <button type="submit" name="hand" value="パー">🖐️ パー</button>
      </form>
      <div class="result">${resultHtml}</div>
    </div>
  </body>
</html>`);
});

server.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
