const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Shared CSS (kept inside server.js for beginner simplicity)
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
      width:min(720px, 100%);
      background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 28px;
      box-shadow: var(--shadow);
      position: relative;
      overflow:hidden;
      transform: translateY(0) scale(1);
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
    }
    .dot{
      width:10px;height:10px;border-radius:50%;
      background: linear-gradient(180deg, var(--accent2), var(--accent));
      box-shadow: 0 0 16px rgba(124,247,212,.55);
    }
    h1{
      margin: 14px 0 8px;
      font-size: clamp(28px, 4vw, 42px);
      letter-spacing: .2px;
    }
    p{
      margin:0 0 18px;
      color: var(--muted);
      line-height: 1.6;
      font-size: 15.5px;
    }
    form{
      display:flex;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    input{
      flex: 1 1 260px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: rgba(16,26,51,.65);
      color: var(--text);
      outline: none;
      font-size: 15px;
    }
    input::placeholder{ color: rgba(169,183,228,.7); }
    input:focus{
      border-color: rgba(110,168,255,.55);
      box-shadow: 0 0 0 4px rgba(110,168,255,.15);
    }

    /* --- Button base (now using .btn) --- */
    .btn{
      padding: 12px 16px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 650;
      font-size: 15px;
      color: #081021;
      background: linear-gradient(135deg, var(--accent2), var(--accent));
      box-shadow: 0 10px 24px rgba(110,168,255,.25);

      position: relative;
      overflow: hidden;
      transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
      min-width: 110px;
    }
    .btn:hover{ transform: translateY(-1px); filter: brightness(1.02); }
    .btn:active{
      transform: translateY(1px) scale(0.99);
    }
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
    .card.submitting{
      animation: pop .35s ease;
    }
    @keyframes pop{
      0%{ transform: translateY(0) scale(1); }
      60%{ transform: translateY(-2px) scale(1.01); }
      100%{ transform: translateY(0) scale(1); }
    }

    .footer{
      margin-top: 18px;
      display:flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      color: rgba(169,183,228,.75);
      font-size: 13px;
    }
    a{
      color: var(--accent2);
      text-decoration: none;
      font-weight: 600;
    }
    a:hover{ text-decoration: underline; }
    .glow{
      position:absolute;
      inset:-200px;
      background: radial-gradient(circle at 40% 35%, rgba(110,168,255,.16), transparent 55%),
                  radial-gradient(circle at 60% 70%, rgba(124,247,212,.10), transparent 55%);
      pointer-events:none;
    }
  </style>
`;

app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Dynamic Cloud Website</title>
      ${css}
    </head>
    <body>
      <div class="card">
        <div class="glow"></div>

        <div class="badge"><span class="dot"></span> Live on Cloud (Node.js + Express + Render)</div>

        <h1>Dynamic Cloud Website</h1>
        <p>Enter your name and the server will generate a dynamic response in real-time.</p>

        <form method="POST" action="/greet">
          <input type="text" name="username" placeholder="Enter your name" required />

          <button class="btn" type="submit" id="submitBtn">
            <span class="btn-text">Submit</span>
            <span class="spinner" aria-hidden="true"></span>
          </button>
        </form>

        <div class="footer">
          <span>Deployed from GitHub → Render</span>
          <span>Made for assignment ✅</span>
        </div>
      </div>

      <script>
        const form = document.querySelector("form");
        const btn = document.getElementById("submitBtn");
        const card = document.querySelector(".card");

        form.addEventListener("submit", (e) => {
          e.preventDefault();               // stop instant redirect
          btn.classList.add("loading");     // show spinner
          card.classList.add("submitting"); // small pop animation

          // submit after a short delay so animation is visible
          setTimeout(() => form.submit(), 450);
        });
      </script>
    </body>
    </html>
  `);
});

app.post("/greet", (req, res) => {
  const name = (req.body.username || "").trim();

  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Hello ${name || "there"}</title>
      ${css}
    </head>
    <body>
      <div class="card">
        <div class="glow"></div>

        <div class="badge"><span class="dot"></span> Response generated by server</div>

        <h1>Hello ${name || "there"}! 🚀</h1>
        <p>Your website is running on the cloud and responding dynamically to your input.</p>

        <div style="margin-top:14px;">
          <a href="/">← Go Back</a>
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

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
