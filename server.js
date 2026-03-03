const express = require("express");
const Sentiment = require("sentiment");

const app = express();
const sentiment = new Sentiment();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

/* ========= Profile Links ========= */
const PROFILE = {
  name: "Rishin Mallick",
  degree: "B.Tech (Electronics & Computer Science) — 3rd Year",
  college: "KIIT (Kalinga Institute of Industrial Technology)",
  github: "https://github.com/2330106-dot",
  linkedin: "https://www.linkedin.com/in/rishin-mallick-8a9540289/",
  liveDemo: "https://dynamic-cloud-website.onrender.com",
};

/* ========= Dynamic Portfolio Data ========= */
const serverStartedAt = Date.now();
let portfolioVisitors = 0; // counts visits to "/" (portfolio page)

const motivationalQuotes = [
  "Small steps every day beat big plans someday.",
  "Consistency is the real superpower.",
  "Don’t stop when you’re tired. Stop when it’s done.",
  "Learn one thing today. You’ll thank yourself tomorrow.",
  "Progress > perfection.",
  "Discipline builds the future you want.",
];

const techTips = [
  "Tip: Use environment variables (process.env) for ports/keys in production.",
  "Tip: Keep routes clean: GET for pages, POST for form submissions.",
  "Tip: Always validate and sanitize user input on the server.",
  "Tip: Use Git commits frequently with clear messages.",
  "Tip: In Express, middleware runs top-to-bottom—order matters.",
  "Tip: Deploy often—small updates are easier to debug than big ones.",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}h`);
  if (minutes || hours || days) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

/* ============ Shared CSS (inside server.js) ============ */
const css = `
<style>
  :root{
    --bg:#0b1220;
    --card:#101a33;
    --text:#e8eefc;
    --muted:#a9b7e4;
    --accent:#6ea8ff;
    --accent2:#7cf7d4;
    --border: rgba(255,255,255,.10);
    --shadow: 0 20px 60px rgba(0,0,0,.45);
  }
  *{ box-sizing:border-box; }
  body{
    margin:0;
    min-height:100vh;
    display:grid;
    place-items:center;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: radial-gradient(1200px 600px at 20% 10%, rgba(110,168,255,.25), transparent 60%),
                radial-gradient(900px 500px at 80% 20%, rgba(124,247,212,.18), transparent 60%),
                var(--bg);
    color:var(--text);
    padding: 28px;
  }
  .card{
    width:min(920px, 100%);
    background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px;
    box-shadow: var(--shadow);
    position: relative;
    overflow:hidden;
  }
  .badge{
    display:inline-flex;
    gap:10px;
    align-items:center;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 13px;
    background: rgba(16,26,51,.55);
    width: fit-content;
  }
  .dot{
    width:10px;height:10px;border-radius:50%;
    background: linear-gradient(180deg, var(--accent2), var(--accent));
    box-shadow: 0 0 16px rgba(124,247,212,.55);
  }
  h1{
    margin: 14px 0 8px;
    font-size: clamp(28px, 4vw, 46px);
    letter-spacing: .2px;
  }
  h2{
    margin: 18px 0 10px;
    font-size: 18px;
    color: var(--text);
  }
  p{
    margin:0 0 18px;
    color: var(--muted);
    line-height: 1.6;
    font-size: 15.5px;
  }
  .grid{
    display:grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 18px;
  }
  @media (max-width: 880px){
    .grid{ grid-template-columns: 1fr; }
  }
  .panel{
    border: 1px solid var(--border);
    background: rgba(16,26,51,.45);
    border-radius: 14px;
    padding: 16px;
  }
  .pill{
    display:inline-flex;
    padding: 7px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: rgba(232,238,252,.9);
    margin: 6px 6px 0 0;
    font-size: 13px;
    background: rgba(16,26,51,.55);
  }
  .list{
    margin: 0;
    padding-left: 18px;
    color: rgba(169,183,228,.92);
    line-height: 1.65;
    font-size: 14.5px;
  }
  form{
    display:flex;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  input, textarea{
    flex: 1 1 260px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(16,26,51,.65);
    color: var(--text);
    outline: none;
    font-size: 15px;
  }
  textarea{ min-height: 110px; resize: vertical; }
  input::placeholder, textarea::placeholder{ color: rgba(169,183,228,.7); }
  input:focus, textarea:focus{
    border-color: rgba(110,168,255,.55);
    box-shadow: 0 0 0 4px rgba(110,168,255,.15);
  }
  a{
    color: var(--accent2);
    text-decoration: none;
    font-weight: 650;
  }
  a:hover{ text-decoration: underline; }
  .footer{
    margin-top: 18px;
    display:flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    color: rgba(169,183,228,.75);
    font-size: 13px;
  }
  .glow{
    position:absolute;
    inset:-200px;
    background: radial-gradient(circle at 40% 35%, rgba(110,168,255,.16), transparent 55%),
                radial-gradient(circle at 60% 70%, rgba(124,247,212,.10), transparent 55%);
    pointer-events:none;
  }

  /* --- Submit animation --- */
  .btn{
    position: relative;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 750;
    font-size: 15px;
    color: #081021;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    box-shadow: 0 10px 24px rgba(110,168,255,.25);
    min-width: 120px;
  }
  .btn:hover{ transform: translateY(-1px); filter: brightness(1.02); }
  .btn:active{ transform: translateY(1px) scale(0.99); }

  .btn.loading{
    pointer-events: none;
    filter: brightness(0.95);
    transform: translateY(0) scale(1);
  }
  .btn.loading .btn-text{ opacity: 0; }
  .btn .spinner{
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    opacity: 0;
    transition: opacity .2s ease;
  }
  .btn.loading .spinner{ opacity: 1; }

  .spinner::before{
    content:"";
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: rgba(255,255,255,.95);
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* small “card pop” on submit */
  .card.submitting{ animation: pop .35s ease; }
  @keyframes pop{
    0%{ transform: translateY(0) scale(1); }
    60%{ transform: translateY(-2px) scale(1.01); }
    100%{ transform: translateY(0) scale(1); }
  }

  .result{
    margin-top: 14px;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: rgba(16,26,51,.45);
  }
  .mini{
    font-size: 13px;
    color: rgba(169,183,228,.85);
  }
</style>
`;

function commonScript() {
  return `
  <script>
    const form = document.querySelector("form");
    const btn = document.getElementById("submitBtn");
    const card = document.querySelector(".card");
    if(form && btn && card){
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        btn.classList.add("loading");
        card.classList.add("submitting");
        setTimeout(() => form.submit(), 450);
      });
    }
  </script>
  `;
}

/* ===================== 1) Portfolio Home ===================== */
app.get("/", (req, res) => {
  portfolioVisitors += 1;

  const serverTime = new Date().toLocaleString();
  const uptime = formatUptime(Date.now() - serverStartedAt);
  const quote = pickRandom(motivationalQuotes);
  const tip = pickRandom(techTips);

  res.send(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>${PROFILE.name} | Cloud + AI Portfolio</title>
    ${css}
  </head>
  <body>
    <div class="card">
      <div class="glow"></div>

      <div class="badge"><span class="dot"></span> Portfolio on Cloud (Node.js + Express + Render)</div>

      <h1>${PROFILE.name} — Cloud + AI Portfolio 🚀</h1>
      <p>
        ${PROFILE.degree} • ${PROFILE.college}<br/>
        This project demonstrates <b>cloud deployment</b> + a small <b>AI/ML (NLP)</b> feature running on the backend.
      </p>

      <!-- ✅ Dynamic Section -->
      <div class="panel" style="margin-top:10px;">
        <p class="mini" style="margin-bottom:10px;"><b>Live Dynamic Data (updates on every refresh)</b></p>
        <p>Server Time: <b>${serverTime}</b></p>
        <p>Server Uptime: <b>${uptime}</b></p>
        <p>Portfolio Visitors: <b>${portfolioVisitors}</b></p>
        <p>Motivational Quote: <b>${escapeHtml(quote)}</b></p>
        <p>Tech Tip: <b>${escapeHtml(tip)}</b></p>
      </div>

      <div class="grid" style="margin-top:18px;">
        <div class="panel">
          <h2>About</h2>
          <p>
            I am a 3rd-year B.Tech student in Electronics & Computer Science. I build
            backend-driven web apps, deploy them on cloud, and add AI/ML features to make them interactive and useful.
          </p>

          <h2>Skills</h2>
          <span class="pill">Node.js</span>
          <span class="pill">Express.js</span>
          <span class="pill">HTML + CSS</span>
          <span class="pill">Git & GitHub</span>
          <span class="pill">Render (Cloud)</span>
          <span class="pill">NLP Sentiment (AI/ML)</span>
          <span class="pill">SQL / DBMS Basics</span>
          <span class="pill">Electronics Basics (Signals, DSP)</span>

          <h2>Live Demos</h2>
          <p class="mini">Click and test the working in real-time:</p>
          <p><a href="/ai">→ AI Sentiment Analyzer</a></p>
          <p><a href="/greet">→ Dynamic Greeting</a></p>
        </div>

        <div class="panel">
          <h2>Projects</h2>
          <ul class="list">
            <li><b>Dynamic Cloud Website (This Project)</b> — form input, server-side response, deployed on Render with GitHub auto-deploy.</li>
            <li><b>AI Sentiment Analyzer (NLP)</b> — classifies user text as Positive / Neutral / Negative using a sentiment library.</li>
            <li><b>Electronics Signal Toolkit (Mini)</b> — generating basic signals (sine/square/triangular) and analyzing time-domain behavior (academic mini-project).</li>
          </ul>

          <h2>Quick Links</h2>
          <p>
            GitHub: <a href="${PROFILE.github}" target="_blank" rel="noreferrer">${PROFILE.github}</a><br/>
            LinkedIn: <a href="${PROFILE.linkedin}" target="_blank" rel="noreferrer">${PROFILE.linkedin}</a><br/>
            Live Demo: <a href="${PROFILE.liveDemo}" target="_blank" rel="noreferrer">${PROFILE.liveDemo}</a>
          </p>

          <h2>How it works</h2>
          <p class="mini">
            Browser → sends request → Express server generates dynamic HTML → hosted on Render cloud.
          </p>
        </div>
      </div>

      <div class="footer">
        <span>Deployed from GitHub → Render</span>
        <span>Made for class assignment ✅</span>
      </div>
    </div>
  </body>
  </html>
  `);
});

/* ===================== 2) Dynamic Greeting ===================== */
app.get("/greet", (req, res) => {
  res.send(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Dynamic Greeting</title>
    ${css}
  </head>
  <body>
    <div class="card">
      <div class="glow"></div>
      <div class="badge"><span class="dot"></span> Dynamic response generated by server</div>

      <h1>Dynamic Greeting</h1>
      <p>Enter your name. The backend (Express) will generate a dynamic response page.</p>

      <form method="POST" action="/greet/result">
        <input type="text" name="username" placeholder="Enter your name" required />
        <button class="btn" type="submit" id="submitBtn">
          <span class="btn-text">Submit</span>
          <span class="spinner" aria-hidden="true"></span>
        </button>
      </form>

      <div style="margin-top:14px;"><a href="/">← Back to Portfolio</a></div>

      <div class="footer">
        <span>Node + Express</span>
        <span>Cloud: Render</span>
      </div>
    </div>
    ${commonScript()}
  </body>
  </html>
  `);
});

app.post("/greet/result", (req, res) => {
  const name = (req.body.username || "").trim();
  res.send(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Hello ${escapeHtml(name || "there")}</title>
    ${css}
  </head>
  <body>
    <div class="card">
      <div class="glow"></div>
      <div class="badge"><span class="dot"></span> Response generated by server</div>

      <h1>Hello ${escapeHtml(name || "there")}! 🚀</h1>
      <p>Your website is running on cloud and responding dynamically to your input.</p>

      <div style="margin-top:14px;">
        <a href="/greet">← Go Back</a> &nbsp; | &nbsp;
        <a href="/">Portfolio</a>
      </div>

      <div class="footer">
        <span>Status: Live ✅</span>
        <span>Node + Express</span>
      </div>
    </div>
  </body>
  </html>
  `);
});

/* ===================== 3) AI/ML Page (Sentiment Analyzer) ===================== */
app.get("/ai", (req, res) => {
  res.send(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>AI Sentiment Analyzer</title>
    ${css}
  </head>
  <body>
    <div class="card">
      <div class="glow"></div>
      <div class="badge"><span class="dot"></span> AI/ML Feature (NLP Sentiment Analysis)</div>

      <h1>AI Sentiment Analyzer 🤖</h1>
      <p>Type a short message. The backend will classify it as Positive / Neutral / Negative.</p>

      <form method="POST" action="/ai/result">
        <textarea name="text" placeholder="Example: I am happy because my cloud project is working perfectly!" required></textarea>
        <button class="btn" type="submit" id="submitBtn">
          <span class="btn-text">Analyze</span>
          <span class="spinner" aria-hidden="true"></span>
        </button>
      </form>

      <div style="margin-top:14px;"><a href="/">← Back to Portfolio</a></div>

      <div class="footer">
        <span>AI: Sentiment (NLP)</span>
        <span>Cloud: Render</span>
      </div>
    </div>
    ${commonScript()}
  </body>
  </html>
  `);
});

app.post("/ai/result", (req, res) => {
  const text = (req.body.text || "").trim();
  const analysis = sentiment.analyze(text);
  const score = analysis.score;

  let label = "Neutral 🙂";
  if (score > 1) label = "Positive 😊";
  if (score < -1) label = "Negative 😟";

  res.send(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Sentiment Result</title>
    ${css}
  </head>
  <body>
    <div class="card">
      <div class="glow"></div>
      <div class="badge"><span class="dot"></span> Result generated by server (AI/ML)</div>

      <h1>Sentiment: ${label}</h1>
      <p>The server analyzed your text using an NLP sentiment model.</p>

      <div class="result">
        <div style="color:rgba(169,183,228,.9); font-size:13px; margin-bottom:8px;">Your text</div>
        <div style="white-space:pre-wrap;">${escapeHtml(text)}</div>
        <div style="margin-top:10px; color:rgba(169,183,228,.9); font-size:13px;">
          Score: <b>${score}</b>
        </div>
        <div style="margin-top:6px; color:rgba(169,183,228,.85); font-size:13px;">
          Explanation: higher score → positive words, lower score → negative words.
        </div>
      </div>

      <div style="margin-top:14px;">
        <a href="/ai">← Analyze again</a> &nbsp; | &nbsp;
        <a href="/">Portfolio</a>
      </div>

      <div class="footer">
        <span>AI/ML: NLP Sentiment</span>
        <span>Node + Express</span>
      </div>
    </div>
  </body>
  </html>
  `);
});

/* ===================== Helpers ===================== */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
