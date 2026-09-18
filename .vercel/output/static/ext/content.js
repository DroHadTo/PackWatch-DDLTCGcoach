(function () {
  if (window.__packWatch) return;
  window.__packWatch = true;

  const NAMES = (window.__PW_NAMES || []).slice().sort(function (a, b) {
    return b.length - a.length;
  });
  const KEYS = [
    "End Turn", "YOUR TURN", "New Game", "Resume", "Confirm", "Cancel",
    "Play Again", "Change decks", "Vs Bot", "Vs Pack", "Tutorial", "Hot Pack",
    "Graveyard", "How to Play", "Leaderboard", "Sign in", "Taunt", "Rush",
    "Poison", "Fury", "Frozen", "your hand", "Lobby", "PvP",
  ];

  let ticks = 0;
  let lastHash = "";
  let lastAsk = "";
  let frameUrl = "";
  let capturing = false;

  function textOf() {
    var t = "";
    try {
      t = (document.body && document.body.innerText) || "";
    } catch (e) {
      t = "";
    }
    return String(t).replace(/\s+/g, " ").trim();
  }

  function scrape() {
    var t = textOf();
    var upper = t.toUpperCase();
    var buttons = [];
    try {
      document.querySelectorAll("button, [role=button], a, [onclick]").forEach(function (el) {
        var s = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
        if (s && s.length < 48) buttons.push(s);
      });
    } catch (e) { /* ignore */ }
    var labels = [];
    KEYS.forEach(function (k) {
      if (upper.indexOf(k.toUpperCase()) >= 0) labels.push(k);
    });
    buttons.forEach(function (b) {
      if (labels.indexOf(b) < 0) labels.push(b);
    });
    labels = labels.slice(0, 80);
    var turn = /YOUR TURN/.test(upper) ? "you" : /OPPONENT|ENEMY TURN|THEIR TURN/.test(upper) ? "opp" : "unknown";
    var hps = [];
    var re = /(\d{1,2})\s*\/\s*40/g;
    var m;
    while ((m = re.exec(t))) hps.push(parseInt(m[1], 10));
    var cards = [];
    NAMES.forEach(function (n) {
      var rx = new RegExp("\\b" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (rx.test(t)) cards.push(n);
    });
    var canvases = 0;
    try {
      canvases = document.querySelectorAll("canvas").length;
    } catch (e) { /* ignore */ }
    return {
      turn: turn,
      youHP: hps[0] || null,
      oppHP: hps[1] || null,
      labels: labels,
      cards: cards.slice(0, 20),
      canvases: canvases,
      snippet: t.slice(0, 1200),
      t: Date.now(),
    };
  }

  function grabCanvases() {
    var out = [];
    try {
      document.querySelectorAll("canvas").forEach(function (c) {
        if (!c.width || !c.height) return;
        try {
          out.push(c.toDataURL("image/jpeg", 0.45));
        } catch (e) { /* tainted */ }
      });
    } catch (e) { /* ignore */ }
    return out;
  }

  function coach(s) {
    var taunt = s.labels.concat(s.cards).some(function (l) {
      return /taunt/i.test(l);
    });
    var now = "Watching. When it is your turn, spend mana, crack Taunt, then only legal fights.";
    if (s.turn === "opp") now = "Their turn. Plan the next swing. Do not click.";
    if (s.turn === "you") {
      now = taunt
        ? "Your turn. Crack Taunt first — you cannot win through a wall."
        : "Your turn. Spend the mana. Develop, then only take kill-gate fights. Close face if the path is open.";
    }
    var dont = [
      "Rush cannot hit the Hero the turn it enters.",
      "Traps cannot spring the turn they are set.",
      "Mana does not bank.",
    ];
    if (taunt) dont.unshift("Do not hit face through Taunt.");
    return { now: now, dont: dont };
  }

  function answer(s, q) {
    q = (q || "").toLowerCase();
    if (!q.trim()) q = "what should i do";
    if (/wayne|banned|ban/.test(q)) {
      return "Wayne is banned from online play. Do not register it. Pack Watch builds without it.";
    }
    if (/face|hero/.test(q)) {
      if (s.labels.concat(s.cards).some(function (l) { return /taunt/i.test(l); })) {
        return "No. Taunt is up — face is closed until every Taunt is gone.";
      }
      return "A creature cannot hit the Hero the turn it is played, even with Rush. If a ready body is already on board and Taunt is gone, chip face.";
    }
    if (/poison/.test(q)) return "Poison destroys the creature it fights even if ATK is lower. It does not ignore Hero HP.";
    if (/taunt/.test(q)) return "Attacks must hit Taunt first. Face and non-Taunt are closed.";
    if (/rush/.test(q)) return "Rush may hit creatures the turn it enters. Never the Hero that turn.";
    if (/trap/.test(q)) return "Set face-down. Cannot spring the turn you set it.";
    if (/mana|coin/.test(q)) return "Cap +1 each turn, refill to cap. Unspent mana does not bank. Coin pays +1 once and does not raise the cap.";
    if (/win|advantage|edge/.test(q)) {
      return "Play to win. Spend mana, crack Taunt, only take fights that kill, close the Hero when the math is there.";
    }
    var c = coach(s);
    return c.now + " " + (s.cards.length ? "I can see: " + s.cards.join(", ") + "." : "Keep the match in this tab so I can keep reading.");
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount() {
    if (document.getElementById("packwatch-host")) return;
    var host = el("div");
    host.id = "packwatch-host";
    var wrap = el("div", "pw");
    wrap.innerHTML =
      '<div class="pw-bar" id="pw-bar">' +
      '<span class="pw-dot" id="pw-dot"></span>' +
      '<span class="pw-title">Pack Watch</span>' +
      '<span class="pw-live" id="pw-live">LIVE</span>' +
      '<button type="button" class="pw-toggle" id="pw-hide">Hide</button>' +
      "</div>" +
      '<div class="pw-body" id="pw-body">' +
      '<img class="pw-view empty" id="pw-view" alt="Live play tab">' +
      '<p class="pw-state" id="pw-state">Connecting to this tab…</p>' +
      '<p class="pw-now" id="pw-now">I watch this page every beat. Start or resume a match.</p>' +
      '<p class="pw-dont" id="pw-dont"></p>' +
      '<p class="pw-cards" id="pw-cards"></p>' +
      '<textarea id="pw-q" placeholder="What should I do? Can I hit face?"></textarea>' +
      '<button type="button" class="pw-ask" id="pw-ask">Tell me</button>' +
      '<p class="pw-reply" id="pw-reply"></p>' +
      "</div>";
    host.appendChild(wrap);
    (document.documentElement || document.body).appendChild(host);

    wrap.addEventListener("mousedown", function (e) { e.stopPropagation(); }, true);
    wrap.addEventListener("mouseup", function (e) { e.stopPropagation(); }, true);
    wrap.addEventListener("click", function (e) { e.stopPropagation(); }, true);
    wrap.addEventListener("keydown", function (e) { e.stopPropagation(); }, true);
    wrap.addEventListener("keyup", function (e) { e.stopPropagation(); }, true);
    wrap.addEventListener("wheel", function (e) { e.stopPropagation(); }, true);

    var hide = document.getElementById("pw-hide");
    var body = document.getElementById("pw-body");
    hide.addEventListener("click", function () {
      var on = !body.classList.contains("hidden");
      body.classList.toggle("hidden", on);
      hide.textContent = on ? "Show" : "Hide";
    });

    document.getElementById("pw-ask").addEventListener("click", function () {
      lastAsk = document.getElementById("pw-q").value;
      var s = scrape();
      document.getElementById("pw-reply").textContent = answer(s, lastAsk);
    });

    var bar = document.getElementById("pw-bar");
    var dragging = false;
    var ox = 0;
    var oy = 0;
    bar.addEventListener("mousedown", function (e) {
      if (e.target && e.target.id === "pw-hide") return;
      dragging = true;
      var r = host.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      host.style.left = Math.max(8, e.clientX - ox) + "px";
      host.style.top = Math.max(8, e.clientY - oy) + "px";
      host.style.right = "auto";
    });
    window.addEventListener("mouseup", function () {
      dragging = false;
    });
  }

  function paint(s) {
    mount();
    var c = coach(s);
    var state = document.getElementById("pw-state");
    var now = document.getElementById("pw-now");
    var dont = document.getElementById("pw-dont");
    var cards = document.getElementById("pw-cards");
    var live = document.getElementById("pw-live");
    var dot = document.getElementById("pw-dot");
    if (state) {
      state.textContent =
        "Live · tick " +
        ticks +
        " · turn " +
        s.turn +
        " · HP " +
        (s.youHP != null ? s.youHP : "?") +
        " / " +
        (s.oppHP != null ? s.oppHP : "?") +
        " · " +
        s.labels.length +
        " controls · " +
        s.canvases +
        " canvases";
    }
    if (now) now.textContent = c.now;
    if (dont) dont.textContent = c.dont[0] || "";
    if (cards) {
      cards.textContent = s.cards.length
        ? "Seen on board/text: " + s.cards.join(" · ")
        : "Reading this tab. Card names appear here when the client prints them.";
    }
    if (live) live.textContent = "LIVE";
    if (dot) {
      dot.className = "pw-dot" + (s.turn === "opp" ? " opp" : "");
    }
    var view = document.getElementById("pw-view");
    if (view && frameUrl) {
      view.src = frameUrl;
      view.classList.remove("empty");
    }
  }

  function save(s) {
    try {
      chrome.storage.local.get(["brain"], function (res) {
        var brain = res.brain || { labels: {}, seen: 0, cards: {} };
        s.labels.forEach(function (l) {
          brain.labels[l] = (brain.labels[l] || 0) + 1;
        });
        s.cards.forEach(function (n) {
          brain.cards[n] = (brain.cards[n] || 0) + 1;
        });
        brain.seen += 1;
        brain.last = { turn: s.turn, youHP: s.youHP, oppHP: s.oppHP, t: s.t };
        chrome.storage.local.set({ brain: brain });
      });
    } catch (e) { /* ignore */ }
  }

  function requestCapture() {
    if (capturing) return;
    capturing = true;
    try {
      chrome.runtime.sendMessage({ type: "pw-capture" }, function (res) {
        capturing = false;
        if (res && res.ok && res.url) frameUrl = res.url;
      });
    } catch (e) {
      capturing = false;
    }
  }

  function tick() {
    ticks += 1;
    var s = scrape();
    var hash = s.turn + "|" + s.youHP + "|" + s.oppHP + "|" + s.labels.join(",") + "|" + s.cards.join(",");
    paint(s);
    if (hash !== lastHash) {
      lastHash = hash;
      save(s);
    }
    var canv = grabCanvases();
    if (canv[0]) {
      frameUrl = canv[0];
      var view = document.getElementById("pw-view");
      if (view) {
        view.src = frameUrl;
        view.classList.remove("empty");
      }
    } else if (ticks % 2 === 0) {
      requestCapture();
    }
  }

  function start() {
    mount();
    tick();
    setInterval(tick, 450);
    try {
      var obs = new MutationObserver(function () {
        tick();
      });
      obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
