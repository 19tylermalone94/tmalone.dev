/* ============================================================
   Tyler Malone — Cosmic · interactions
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Starfield ---------------- */
  const canvas = document.getElementById("starfield");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, stars = [], shootTimer = 0, shoot = null;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastWidth = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      // mobile browsers fire "resize" while scrolling as the URL bar hides/shows,
      // changing only innerHeight — re-seeding then would make every star jump
      // to a new random spot mid-scroll. Only reseed on real width changes.
      if (innerWidth === lastWidth) return;
      lastWidth = innerWidth;
      const count = Math.min(360, Math.floor((innerWidth * innerHeight) / 5200));
      stars = [];
      for (let i = 0; i < count; i++) {
        const layer = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: layer,                                  // depth → parallax + size
          r: (layer * 1.5 + 0.25) * dpr,
          tw: Math.random() * Math.PI * 2,           // twinkle phase
          tws: 0.6 + Math.random() * 1.8,            // twinkle speed
          hue: Math.random() < 0.18 ? "warm" : (Math.random() < 0.25 ? "cool" : "white"),
        });
      }
    }

    function color(star, a) {
      if (star.hue === "warm") return `rgba(233,201,135,${a})`;
      if (star.hue === "cool") return `rgba(127,214,232,${a})`;
      return `rgba(244,241,255,${a})`;
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // ease mouse parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      for (const s of stars) {
        s.tw += dt * s.tws;
        const a = 0.35 + Math.sin(s.tw) * 0.35 + s.z * 0.25;
        const px = s.x + mouse.x * s.z * 40 * dpr;
        const py = s.y + mouse.y * s.z * 40 * dpr;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color(s, Math.max(0, Math.min(1, a)));
        ctx.fill();
        if (s.z > 0.82) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = color(s, Math.max(0, a * 0.08));
          ctx.fill();
        }
      }

      // occasional shooting star
      shootTimer -= dt;
      if (!shoot && shootTimer <= 0) {
        shootTimer = 5 + Math.random() * 8;
        const sx = Math.random() * w * 0.7;
        shoot = { x: sx, y: Math.random() * h * 0.4, vx: (3 + Math.random() * 3) * dpr * 60, vy: (1.4 + Math.random() * 1.6) * dpr * 60, life: 1 };
      }
      if (shoot) {
        shoot.life -= dt * 0.8;
        shoot.x += shoot.vx * dt;
        shoot.y += shoot.vy * dt;
        const len = 90 * dpr;
        const ang = Math.atan2(shoot.vy, shoot.vx);
        const grad = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - Math.cos(ang) * len, shoot.y - Math.sin(ang) * len);
        grad.addColorStop(0, `rgba(244,241,255,${Math.max(0, shoot.life)})`);
        grad.addColorStop(1, "rgba(244,241,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(shoot.x - Math.cos(ang) * len, shoot.y - Math.sin(ang) * len);
        ctx.stroke();
        if (shoot.life <= 0 || shoot.x > w || shoot.y > h) shoot = null;
      }

      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", (e) => {
      mouse.tx = (e.clientX / innerWidth - 0.5);
      mouse.ty = (e.clientY / innerHeight - 0.5);
    }, { passive: true });

    resize();
    requestAnimationFrame(frame);
  }

  /* ---------------- Scroll reveals ---------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-up");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------------- Nav stuck state + scroll progress ---------------- */
  const nav = document.querySelector(".nav");
  const bar = document.getElementById("scrollProgress");
  const onScroll = () => {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 40);
    if (bar) {
      const docH = document.documentElement.scrollHeight - innerHeight;
      const p = docH > 0 ? window.scrollY / docH : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p)).toFixed(4)})`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- "Back to top" / brand links ----------------
     #top sits on the fixed <header>, which is always in view, so the
     browser won't scroll to it. Scroll to the document top instead. */
  document.querySelectorAll('a[href="#top"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------------- Parallax + cinematic zoom (scenic imagery) ---------------- */
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = innerHeight;
      for (const el of parallaxEls) {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const center = rect.top + rect.height / 2 - vh / 2;
        const ty = (-center * speed).toFixed(1);
        // subtle scroll-driven zoom on the scenic backgrounds (not the hero nebula)
        if (el.classList.contains("hero__img")) {
          el.style.transform = `translate3d(0, ${ty}px, 0)`;
        } else {
          const prog = Math.min(1, Math.max(0, 1 - (rect.top + rect.height / 2) / (vh + rect.height)));
          const scale = (1.03 + 0.09 * prog).toFixed(3);
          el.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
        }
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ============================================================
     Flight mode → COSMIC SKIRMISH — drive a rocket with WASD /
     arrows (flying past the comfort band scrolls the page), shoot
     with click or Space, and survive waves of alien saucers that
     chase and fire back. Track survival time, kills, distance and
     unlock achievements along the way.
     ============================================================ */
  (function flight() {
    const btn = document.getElementById("flyBtn");
    const rocket = document.getElementById("rocket");
    const flame = rocket && rocket.querySelector(".rocket__flame");
    const dpad = document.getElementById("dpad");
    if (!btn || !rocket || !flame) return;

    // game DOM
    const gcanvas = document.getElementById("gameLayer");
    const gctx = gcanvas ? gcanvas.getContext("2d") : null;
    const hud = document.getElementById("hud");
    const healthFill = document.getElementById("healthFill");
    const hudTime = document.getElementById("hudTime");
    const hudKills = document.getElementById("hudKills");
    const toasts = document.getElementById("toasts");
    const flash = document.getElementById("hitFlash");
    const gameover = document.getElementById("gameover");
    const goSub = document.getElementById("goSub");
    const goStats = document.getElementById("goStats");
    const goAch = document.getElementById("goAch");
    const goAgain = document.getElementById("goAgain");
    const goClose = document.getElementById("goClose");

    // flight physics
    const ACCEL = 2200;     // px/s^2 of thrust
    const DAMP = 2.6;       // velocity damping per second
    const MAXV = 1100;      // px/s speed cap
    const MARGIN = 70;      // how close the rocket gets to viewport edges
    const BOOST_ACCEL = 2;  // thrust multiplier while Shift is held
    const BOOST_MAXV = 2100; // raised speed cap while boosting

    // combat tuning
    const MAXHP = 100;
    const FIRE_CD = 0.16;      // seconds between player shots
    const BULLET_V = 980;      // player bullet speed
    const FOE_BULLET_V = 360;  // alien bullet speed
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let active = false;
    let raf = 0, last = 0, sp = 0;
    let px = 0, py = 0, vx = 0, vy = 0, rot = 0, thrust = 0;
    let gdpr = 1, gw = 0, gh = 0;
    const keys = { up: false, down: false, left: false, right: false, boost: false, fire: false };

    // run state
    let hp, alive, dead;
    let gTime, dist, kills, shots, hits, grazes, noHit, topSpeed, dmgTaken;
    let reachedBottom, lowHpFlag, newBestTime, newBestKills;
    let foes = [], pBullets = [], fBullets = [], parts = [];
    let spawnT = 0, fireT = 0, shake = 0, shakeX = 0, shakeY = 0;
    const unlocked = new Set();
    const earned = [];

    const KEYMAP = {
      ArrowUp: "up", KeyW: "up",
      ArrowDown: "down", KeyS: "down",
      ArrowLeft: "left", KeyA: "left",
      ArrowRight: "right", KeyD: "right",
    };

    // achievements — checked every frame against a stats snapshot
    const ACHS = [
      { id: "firstblood",   icon: "💥", name: "First Blood",     desc: "Destroy your first alien",        test: s => s.kills >= 1 },
      { id: "ace",          icon: "🎯", name: "Ace",             desc: "5 aliens down",                   test: s => s.kills >= 5 },
      { id: "wipeout",      icon: "🛸", name: "Squadron Wiped",  desc: "15 aliens down",                  test: s => s.kills >= 15 },
      { id: "annihilator",  icon: "☄️", name: "Annihilator",     desc: "30 aliens down",                  test: s => s.kills >= 30 },
      { id: "survivor",     icon: "⏱️", name: "Survivor",        desc: "Stay alive for 30 seconds",       test: s => s.time >= 30 },
      { id: "veteran",      icon: "🎖️", name: "Veteran",         desc: "Stay alive for 60 seconds",       test: s => s.time >= 60 },
      { id: "untouchable",  icon: "✨", name: "Untouchable",     desc: "30 seconds without a scratch",    test: s => s.noHit >= 30 },
      { id: "lightspeed",   icon: "⚡", name: "Ludicrous Speed", desc: "Hit afterburner top speed",       test: s => s.maxSpeed >= 2000 },
      { id: "deepspace",    icon: "🌌", name: "Deep Space",      desc: "Fly 20,000 px",                   test: s => s.distance >= 20000 },
      { id: "sharpshooter", icon: "🔭", name: "Sharpshooter",    desc: "70% accuracy (10+ shots)",        test: s => s.shotsFired >= 10 && s.shotsHit / s.shotsFired >= 0.7 },
      { id: "graze",        icon: "🪡", name: "Close Shave",     desc: "Graze an enemy shot",             test: s => s.grazes >= 1 },
      { id: "triggerhappy", icon: "🔫", name: "Trigger Happy",   desc: "Fire 100 shots",                  test: s => s.shotsFired >= 100 },
      { id: "tothemoon",    icon: "🌕", name: "To The Moon",     desc: "Fly to the bottom of the page",   test: s => s.reachedBottom },
      { id: "glasscannon",  icon: "🔥", name: "Glass Cannon",    desc: "Survive a hit under 15 hull",     test: s => s.lowHealthSurvived },
    ];

    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    function lerpAngle(a, b, t) {
      let d = ((b - a + 540) % 360) - 180;
      return a + d * t;
    }

    /* ---- tiny WebAudio blips (created on first gesture) ---- */
    let actx = null;
    function audio() {
      if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
      return actx;
    }
    function beep(freq, dur, type, vol, slideTo) {
      const a = audio();
      if (!a) return;
      try {
        const o = a.createOscillator(), g = a.createGain();
        o.type = type || "square";
        o.frequency.setValueAtTime(freq, a.currentTime);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), a.currentTime + dur);
        g.gain.setValueAtTime(vol || 0.04, a.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
        o.connect(g).connect(a.destination);
        o.start();
        o.stop(a.currentTime + dur);
      } catch (e) { /* ignore */ }
    }

    /* ---- particles / explosions ---- */
    const HUES = { gold: "233,201,135", rose: "224,138,168", cyan: "127,214,232", white: "244,241,255" };
    function explode(x, y, hue, n) {
      const rgb = HUES[hue] || HUES.white;
      for (let k = 0; k < n; k++) {
        const a = Math.random() * 6.2832, s = 40 + Math.random() * 260;
        const life = 0.4 + Math.random() * 0.6;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1 + Math.random() * 2.6, life, max: life, color: `rgba(${rgb},1)` });
      }
    }

    function flashHit(intensity) {
      if (!flash || reduceMotion) return;
      flash.style.opacity = String(Math.min(0.55, intensity));
      requestAnimationFrame(() => { flash.style.opacity = "0"; });
    }

    /* ---- spawning & firing ---- */
    function spawnFoe() {
      const m = 60, edge = Math.floor(Math.random() * 4), sc = window.scrollY;
      let x, y;
      // y is stored in world (page) space, so spawn around the current view
      if (edge === 0) { x = Math.random() * gw; y = sc - m; }
      else if (edge === 1) { x = gw + m; y = sc + Math.random() * gh; }
      else if (edge === 2) { x = Math.random() * gw; y = sc + gh + m; }
      else { x = -m; y = sc + Math.random() * gh; }
      const tough = Math.random() < Math.min(0.4, gTime * 0.006);
      foes.push({ x, y, vx: 0, vy: 0, r: tough ? 21 : 15, hp: tough ? 3 : 1, hue: tough ? "gold" : "rose", shoot: 0.8 + Math.random() * 1.4, wob: Math.random() * 6.2832 });
    }

    function tryShoot() {
      if (!alive || fireT > 0) return;
      fireT = FIRE_CD;
      shots++;
      const rad = rot * Math.PI / 180;
      const dx = Math.sin(rad), dy = -Math.cos(rad);
      pBullets.push({ x: px + dx * 28, y: (py + window.scrollY) + dy * 28, vx: dx * BULLET_V + vx * 0.3, vy: dy * BULLET_V + vy * 0.3, life: 1.1 });
      vx -= dx * 26; vy -= dy * 26;            // gentle recoil
      beep(660, 0.07, "square", 0.025, 240);
    }

    /* ---- damage / death ---- */
    function hitPlayer(dmg) {
      if (!alive) return;
      hp -= dmg; dmgTaken += dmg; noHit = 0;
      shake = Math.max(shake, dmg * 0.4 + 5);
      flashHit(dmg / 40);
      beep(120, 0.18, "sawtooth", 0.05, 40);
      if (hp <= 0) { hp = 0; die(); }
      else if (hp <= 15) { lowHpFlag = true; }
    }

    function die() {
      if (dead) return;
      dead = true; alive = false;
      const wy = py + window.scrollY;
      explode(px, wy, "gold", 40); explode(px, wy, "rose", 26); explode(px, wy, "white", 16);
      shake = 18;
      rocket.hidden = true;
      keys.up = keys.down = keys.left = keys.right = keys.boost = keys.fire = false;
      beep(90, 0.6, "sawtooth", 0.09, 30);
      saveBest();
      setTimeout(() => { if (active && dead) showOverlay(); }, 850);
    }

    /* ---- high scores ---- */
    function saveBest() {
      try {
        const bt = parseFloat(localStorage.getItem("tm_bestTime") || "0");
        const bk = parseInt(localStorage.getItem("tm_bestKills") || "0", 10);
        if (gTime > bt) { localStorage.setItem("tm_bestTime", gTime.toFixed(1)); newBestTime = true; }
        if (kills > bk) { localStorage.setItem("tm_bestKills", String(kills)); newBestKills = true; }
      } catch (e) { /* ignore */ }
    }

    /* ---- achievements ---- */
    function checkAch() {
      const snap = {
        kills, time: gTime, noHit, maxSpeed: topSpeed, distance: dist,
        shotsFired: shots, shotsHit: hits, grazes, reachedBottom, lowHealthSurvived: lowHpFlag,
      };
      for (const a of ACHS) {
        if (!unlocked.has(a.id) && a.test(snap)) {
          unlocked.add(a.id);
          earned.push(a);
          toast(a);
          beep(740, 0.1, "sine", 0.04, 1180);
        }
      }
    }

    function toast(a) {
      if (!toasts) return;
      const el = document.createElement("div");
      el.className = "toast";
      el.innerHTML = `<span class="toast__ico">${a.icon}</span><span class="toast__txt"><b>${a.name}</b><span>${a.desc}</span></span>`;
      toasts.appendChild(el);
      requestAnimationFrame(() => el.classList.add("in"));
      setTimeout(() => { el.classList.remove("in"); setTimeout(() => el.remove(), 450); }, 3400);
    }

    /* ---- HUD ---- */
    function updateHud() {
      if (healthFill) {
        healthFill.style.width = Math.max(0, hp) + "%";
        healthFill.setAttribute("data-lvl", hp > 50 ? "ok" : hp > 22 ? "warn" : "low");
      }
      if (hudTime) hudTime.textContent = gTime.toFixed(1) + "s";
      if (hudKills) hudKills.textContent = String(kills);
    }

    /* ---- game-over overlay ---- */
    function statCard(label, val, best) {
      return `<div class="gostat${best ? " is-best" : ""}"><b>${val}</b><span>${label}${best ? " <em>NEW BEST</em>" : ""}</span></div>`;
    }
    function showOverlay() {
      if (!gameover) return;
      const acc = shots > 0 ? Math.round(hits / shots * 100) : 0;
      if (goSub) {
        const tier = gTime < 10
          ? ["Barely cleared the launch pad.", "Space is unforgiving."]
          : gTime < 30
            ? ["A respectable run.", "You held your own out there."]
            : gTime < 60
              ? ["Now that’s some flying.", "The aliens will remember you."]
              : ["Absolute legend of the void.", "They’re writing songs about this run."];
        goSub.textContent = tier[Math.floor(Math.random() * tier.length)];
      }
      if (goStats) {
        goStats.innerHTML =
          statCard("Survived", gTime.toFixed(1) + "s", newBestTime) +
          statCard("Aliens destroyed", String(kills), newBestKills) +
          statCard("Accuracy", acc + "%", false) +
          statCard("Distance", Math.round(dist).toLocaleString() + " px", false);
      }
      if (goAch) {
        if (earned.length) {
          goAch.innerHTML =
            `<div class="gameover__ach-title">Medals earned (${earned.length}/${ACHS.length})</div>` +
            `<div class="gameover__chips">${earned.map(a => `<span class="chip" title="${a.desc}">${a.icon} ${a.name}</span>`).join("")}</div>`;
        } else {
          goAch.innerHTML = `<div class="gameover__ach-title">No medals this run — get back out there.</div>`;
        }
      }
      gameover.hidden = false;
      requestAnimationFrame(() => gameover.classList.add("in"));
    }

    /* ---- main game update ---- */
    function updateGame(dt) {
      if (alive) {
        gTime += dt;
        dist += sp * dt;
        noHit += dt;
        if (sp > topSpeed) topSpeed = sp;
        if (!reachedBottom && window.scrollY + innerHeight >= document.documentElement.scrollHeight - 3) reachedBottom = true;
        if (keys.fire || isTouch) tryShoot();

        spawnT -= dt;
        const maxFoes = Math.min(11, 3 + Math.floor(gTime / 11));
        const interval = Math.max(0.55, 2.1 - gTime * 0.028);
        if (foes.length < maxFoes && spawnT <= 0) { spawnFoe(); spawnT = interval; }
      }
      fireT -= dt;

      // player position in world (page) space — foes/bullets live in world space
      const sc = window.scrollY;
      const pwx = px, pwy = py + sc;

      const foeSpeed = Math.min(330, 150 + gTime * 2.4);
      for (let i = foes.length - 1; i >= 0; i--) {
        const f = foes[i];
        f.wob += dt * 2.2;
        const dx = pwx - f.x, dy = pwy - f.y, d = Math.hypot(dx, dy) || 1;
        f.vx += (dx / d) * 620 * dt + Math.cos(f.wob) * 40 * dt;
        f.vy += (dy / d) * 620 * dt + Math.sin(f.wob) * 40 * dt;
        const fs = Math.hypot(f.vx, f.vy);
        if (fs > foeSpeed) { f.vx = f.vx / fs * foeSpeed; f.vy = f.vy / fs * foeSpeed; }
        f.x += f.vx * dt; f.y += f.vy * dt;

        f.shoot -= dt;
        if (alive && d < 1100 && f.shoot <= 0) {
          f.shoot = 1.3 + Math.random() * 1.6;
          const a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.25;
          fBullets.push({ x: f.x, y: f.y, vx: Math.cos(a) * FOE_BULLET_V, vy: Math.sin(a) * FOE_BULLET_V, life: 3.4 });
          beep(170, 0.12, "sawtooth", 0.016, 90);
        }

        if (alive && d < f.r + 14) {              // rammed the player
          explode(f.x, f.y, f.hue, 18);
          foes.splice(i, 1); kills++;
          hitPlayer(22);
          beep(300, 0.22, "triangle", 0.04, 60);
        }
      }

      // player bullets
      for (let i = pBullets.length - 1; i >= 0; i--) {
        const b = pBullets[i];
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        const by = b.y - sc;
        let gone = b.life <= 0 || b.x < -30 || b.x > gw + 30 || by < -30 || by > gh + 30;
        for (let j = foes.length - 1; j >= 0 && !gone; j--) {
          const f = foes[j];
          if (Math.hypot(b.x - f.x, b.y - f.y) < f.r + 5) {
            f.hp--; hits++; gone = true;
            explode(b.x, b.y, "cyan", 5);
            if (f.hp <= 0) {
              explode(f.x, f.y, f.hue, 20);
              foes.splice(j, 1); kills++;
              beep(300, 0.22, "triangle", 0.045, 70);
            } else {
              beep(520, 0.05, "square", 0.02, 380);
            }
          }
        }
        if (gone) pBullets.splice(i, 1);
      }

      // alien bullets
      for (let i = fBullets.length - 1; i >= 0; i--) {
        const b = fBullets[i];
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        const d = Math.hypot(b.x - pwx, b.y - pwy);
        if (alive && d < 14) { fBullets.splice(i, 1); hitPlayer(10); continue; }
        if (alive && !b.grazed && d < 34) { b.grazed = true; grazes++; }
        const by2 = b.y - sc;
        if (b.life <= 0 || b.x < -40 || b.x > gw + 40 || by2 < -40 || by2 > gh + 40) fBullets.splice(i, 1);
      }

      // particles
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.life -= dt;
        if (p.life <= 0) parts.splice(i, 1);
      }

      // screen shake decay
      if (shake > 0) { shake = Math.max(0, shake - dt * 36); shakeX = (Math.random() - 0.5) * shake; shakeY = (Math.random() - 0.5) * shake; }
      else { shakeX = 0; shakeY = 0; }
    }

    /* ---- rendering ---- */
    function drawFoe(f) {
      const rgb = HUES[f.hue] || HUES.rose, R = f.r;
      gctx.save();
      gctx.translate(f.x, f.y);
      gctx.rotate(Math.sin(f.wob) * 0.18);
      const gl = gctx.createRadialGradient(0, 0, 0, 0, 0, R * 2.4);
      gl.addColorStop(0, `rgba(${rgb},0.32)`);
      gl.addColorStop(1, `rgba(${rgb},0)`);
      gctx.fillStyle = gl;
      gctx.beginPath(); gctx.arc(0, 0, R * 2.4, 0, 6.2832); gctx.fill();
      // saucer
      gctx.beginPath();
      gctx.ellipse(0, R * 0.18, R * 1.5, R * 0.55, 0, 0, 6.2832);
      gctx.fillStyle = `rgb(${rgb})`; gctx.fill();
      gctx.lineWidth = 1.4; gctx.strokeStyle = "rgba(11,15,32,0.5)"; gctx.stroke();
      // dome
      gctx.beginPath();
      gctx.ellipse(0, -R * 0.12, R * 0.7, R * 0.62, 0, Math.PI, 0);
      const dg = gctx.createLinearGradient(0, -R * 0.8, 0, 0);
      dg.addColorStop(0, "rgba(214,246,255,0.95)");
      dg.addColorStop(1, "rgba(127,214,232,0.6)");
      gctx.fillStyle = dg; gctx.fill();
      gctx.strokeStyle = "rgba(11,15,32,0.45)"; gctx.stroke();
      // eye
      gctx.fillStyle = "rgba(11,15,32,0.85)";
      gctx.beginPath(); gctx.ellipse(0, -R * 0.2, R * 0.18, R * 0.26, 0, 0, 6.2832); gctx.fill();
      // belly lights
      for (let i = -1; i <= 1; i++) {
        const blink = Math.sin(f.wob * 3 + i) * 0.5 + 0.5;
        gctx.beginPath(); gctx.arc(i * R * 0.7, R * 0.32, R * 0.13, 0, 6.2832);
        gctx.fillStyle = `rgba(255,246,216,${0.35 + blink * 0.6})`; gctx.fill();
      }
      gctx.restore();
    }

    function drawGame() {
      if (!gctx) return;
      gctx.setTransform(gdpr, 0, 0, gdpr, 0, 0);
      gctx.clearRect(0, 0, gw, gh);
      gctx.save();
      // entities are stored in world (page) space; shift up by the scroll so
      // they stay pinned to the background and can scroll out of view
      gctx.translate(shakeX, shakeY - window.scrollY);

      for (const b of fBullets) {
        const g = gctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 9);
        g.addColorStop(0, "rgba(255,210,230,0.95)");
        g.addColorStop(0.4, "rgba(224,138,168,0.9)");
        g.addColorStop(1, "rgba(224,138,168,0)");
        gctx.fillStyle = g;
        gctx.beginPath(); gctx.arc(b.x, b.y, 9, 0, 6.2832); gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.beginPath(); gctx.arc(b.x, b.y, 2.2, 0, 6.2832); gctx.fill();
      }

      gctx.lineWidth = 3.2; gctx.lineCap = "round";
      for (const b of pBullets) {
        const ang = Math.atan2(b.vy, b.vx), len = 16;
        const tx = b.x - Math.cos(ang) * len, ty = b.y - Math.sin(ang) * len;
        const g = gctx.createLinearGradient(b.x, b.y, tx, ty);
        g.addColorStop(0, "rgba(255,246,216,1)");
        g.addColorStop(0.5, "rgba(127,214,232,0.9)");
        g.addColorStop(1, "rgba(127,214,232,0)");
        gctx.strokeStyle = g;
        gctx.beginPath(); gctx.moveTo(b.x, b.y); gctx.lineTo(tx, ty); gctx.stroke();
      }

      for (const f of foes) drawFoe(f);

      for (const p of parts) {
        gctx.globalAlpha = Math.max(0, p.life / p.max);
        gctx.fillStyle = p.color;
        gctx.beginPath(); gctx.arc(p.x, p.y, p.r, 0, 6.2832); gctx.fill();
      }
      gctx.globalAlpha = 1;
      gctx.restore();
    }

    function render() {
      const sx = px + shakeX, sy = py + shakeY;
      rocket.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      flame.style.setProperty("--thrust", thrust.toFixed(3));
    }

    function step(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (alive) {
        const ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        const ay = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
        const boosting = keys.boost && (ax !== 0 || ay !== 0);

        const accel = ACCEL * (keys.boost ? BOOST_ACCEL : 1);
        vx += ax * accel * dt;
        vy += ay * accel * dt;

        const damp = Math.exp(-DAMP * dt);
        vx *= damp; vy *= damp;

        const maxv = keys.boost ? BOOST_MAXV : MAXV;
        sp = Math.hypot(vx, vy);
        if (sp > maxv) { vx = vx / sp * maxv; vy = vy / sp * maxv; sp = maxv; }
        rocket.classList.toggle("is-boosting", boosting);

        // horizontal: move within the viewport, soft-bounce off the sides
        px += vx * dt;
        const xMin = MARGIN, xMax = innerWidth - MARGIN;
        if (px < xMin) { px = xMin; vx = Math.abs(vx) * 0.4; }
        else if (px > xMax) { px = xMax; vx = -Math.abs(vx) * 0.4; }

        // vertical: stay inside the band; overflow drives the page scroll.
        py += vy * dt;
        const yMin = MARGIN, yMax = innerHeight - MARGIN;
        if (py > yMax) {
          const over = py - yMax;
          const before = window.scrollY;
          window.scrollBy(0, over);
          const moved = window.scrollY - before;
          py = yMax + (over - moved);
          if (moved < over - 0.5) vy *= 0.6;
        } else if (py < yMin) {
          const over = yMin - py;
          const before = window.scrollY;
          window.scrollBy(0, -over);
          const moved = before - window.scrollY;
          py = yMin - (over - moved);
          if (moved < over - 0.5) vy *= 0.6;
        }
        py = clamp(py, 6, innerHeight - 6);

        if (sp > 40) {
          const targetRot = Math.atan2(vx, -vy) * 180 / Math.PI;
          rot = lerpAngle(rot, targetRot, 0.2);
        }
        let wantThrust = clamp((Math.abs(ax) + Math.abs(ay)) * 0.7 + sp / MAXV * 0.6, 0, 1);
        if (boosting) wantThrust = 1.4;
        thrust += (wantThrust - thrust) * 0.25;
      } else {
        sp = Math.hypot(vx, vy);
        thrust += (0 - thrust) * 0.1;
      }

      updateGame(dt);
      checkAch();
      updateHud();
      if (alive) render();
      drawGame();
      raf = requestAnimationFrame(step);
    }

    function sizeGame() {
      if (!gcanvas) return;
      gdpr = Math.min(window.devicePixelRatio || 1, 2);
      gw = innerWidth; gh = innerHeight;
      gcanvas.width = Math.floor(gw * gdpr);
      gcanvas.height = Math.floor(gh * gdpr);
      gcanvas.style.width = gw + "px";
      gcanvas.style.height = gh + "px";
    }

    function resetGame() {
      px = innerWidth / 2; py = innerHeight - MARGIN;
      vx = 0; vy = -MAXV * 0.5; rot = 0; thrust = 1;
      hp = MAXHP; alive = true; dead = false;
      gTime = 0; dist = 0; kills = 0; shots = 0; hits = 0; grazes = 0;
      noHit = 0; topSpeed = 0; dmgTaken = 0;
      reachedBottom = false; lowHpFlag = false; newBestTime = false; newBestKills = false;
      foes = []; pBullets = []; fBullets = []; parts = [];
      spawnT = 0.6; fireT = 0; shake = 0; shakeX = 0; shakeY = 0;
      unlocked.clear(); earned.length = 0;
      keys.up = keys.down = keys.left = keys.right = keys.boost = keys.fire = false;
      rocket.hidden = false;
      if (gameover) { gameover.hidden = true; gameover.classList.remove("in"); }
      if (toasts) toasts.innerHTML = "";
      if (flash) flash.style.opacity = "0";
    }

    function start() {
      if (active) return;
      active = true;
      sizeGame();
      resetGame();
      try { audio(); if (actx && actx.state === "suspended") actx.resume(); } catch (e) { /* ignore */ }
      if (gcanvas) gcanvas.hidden = false;
      if (hud) hud.hidden = false;
      if (dpad) { dpad.hidden = false; dpad.classList.add("is-on"); }
      document.documentElement.classList.add("flying");
      btn.setAttribute("aria-pressed", "true");
      updateHud(); render(); drawGame();
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    function stop() {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      keys.up = keys.down = keys.left = keys.right = keys.boost = keys.fire = false;
      rocket.classList.remove("is-boosting");
      rocket.hidden = true;
      if (dpad) { dpad.hidden = true; dpad.classList.remove("is-on"); }
      if (gcanvas) { gcanvas.hidden = true; if (gctx) { gctx.setTransform(1, 0, 0, 1, 0, 0); gctx.clearRect(0, 0, gcanvas.width, gcanvas.height); } }
      if (hud) hud.hidden = true;
      if (gameover) { gameover.hidden = true; gameover.classList.remove("in"); }
      if (toasts) toasts.innerHTML = "";
      if (flash) flash.style.opacity = "0";
      document.documentElement.classList.remove("flying");
      btn.setAttribute("aria-pressed", "false");
    }

    function again() {
      if (!active) { start(); return; }
      resetGame();
      updateHud();
    }

    function toggle() { active ? stop() : start(); }

    btn.addEventListener("click", toggle);
    if (goAgain) goAgain.addEventListener("click", again);
    if (goClose) goClose.addEventListener("click", stop);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && active) { stop(); return; }
      if (!active) return;
      if (e.code === "Space") { keys.fire = true; e.preventDefault(); return; }
      if (e.key === "Shift") { keys.boost = true; return; }
      const dir = KEYMAP[e.code];
      if (!dir) return;
      keys[dir] = true;
      e.preventDefault();                // stop arrows from scrolling on their own
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") { keys.fire = false; return; }
      if (e.key === "Shift") keys.boost = false;
      const dir = KEYMAP[e.code];
      if (dir) keys[dir] = false;
    });

    // click / tap to shoot (ignore clicks on UI chrome)
    window.addEventListener("mousedown", (e) => {
      if (!active || dead) return;
      if (e.target.closest(".nav, .dpad, .gameover, button, a")) return;
      tryShoot();
    });

    // on-screen d-pad for touch
    if (dpad) {
      dpad.querySelectorAll(".dpad__btn").forEach((b) => {
        const dir = b.getAttribute("data-dir");
        const on = (e) => { e.preventDefault(); keys[dir] = true; };
        const off = (e) => { e.preventDefault(); keys[dir] = false; };
        b.addEventListener("pointerdown", on);
        b.addEventListener("pointerup", off);
        b.addEventListener("pointerleave", off);
        b.addEventListener("pointercancel", off);
      });
    }

    // keep things on screen / sized when the window changes
    window.addEventListener("resize", () => {
      if (!active) return;
      sizeGame();
      px = clamp(px, MARGIN, innerWidth - MARGIN);
      py = clamp(py, MARGIN, innerHeight - MARGIN);
    }, { passive: true });
  })();

  /* ============================================================
     PIXEL WORLD SCENE — a single procedural retro descent rendered
     behind the whole page. Scroll fraction 0→1 drives a continuous
     journey: deep space + stars/nebula → a growing pixel Earth →
     aurora → daytime sky with sun + clouds → parallax mountains →
     the sea surface → underwater (light rays, fish, bubbles, kelp)
     fading into the deep. Drawn into a tiny low-res buffer and
     scaled up with smoothing off, for genuine chunky pixels.
     ============================================================ */
  (function worldScene() {
    const cv = document.getElementById("worldScene");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const buf = document.createElement("canvas");
    const bx = buf.getContext("2d");

    // ---- helpers ----
    const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
    const lerp = (a, b, t) => a + (b - a) * t;
    // trapezoid window with feathered edges → smooth appear/disappear
    function band(t, lo, hi, fIn, fOut) {
      if (t < lo - fIn || t > hi + fOut) return 0;
      if (t < lo) return (t - (lo - fIn)) / fIn;
      if (t > hi) return 1 - (t - hi) / fOut;
      return 1;
    }
    function rgb(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

    // ---- sky palette across the descent (fraction → colour) ----
    const SKY = [
      [0.00, [4, 5, 11]],     // the void
      [0.20, [6, 9, 22]],
      [0.30, [11, 17, 44]],   // edge of space
      [0.40, [18, 33, 78]],
      [0.50, [33, 64, 126]],  // upper atmosphere
      [0.58, [60, 112, 178]],
      [0.66, [120, 178, 220]],// bright day sky
      [0.78, [158, 202, 228]],// haze held through the mountain band
      [0.84, [120, 176, 196]],// hazy horizon just above the water
      [0.88, [40, 126, 146]], // sea surface
      [0.92, [16, 88, 108]],
      [0.96, [8, 52, 70]],
      [1.00, [3, 18, 27]],    // the deep
    ];
    function skyColor(f) {
      f = clamp01(f);
      for (let i = 1; i < SKY.length; i++) {
        if (f <= SKY[i][0]) {
          const a = SKY[i - 1], b = SKY[i];
          const t = (f - a[0]) / (b[0] - a[0]);
          return [
            Math.round(lerp(a[1][0], b[1][0], t)),
            Math.round(lerp(a[1][1], b[1][1], t)),
            Math.round(lerp(a[1][2], b[1][2], t)),
          ];
        }
      }
      return SKY[SKY.length - 1][1];
    }

    // pixel-art celestial bodies (supplied assets, drawn flat with no zoom)
    const rand = (a, b) => a + Math.random() * (b - a);
    const ready = (img) => img && img.complete && img.naturalWidth > 0;
    // in reduced-motion mode the loop only redraws on scroll/resize, so an
    // image that loads after the first draw would never paint — kick a redraw.
    const onAssetLoad = () => { if (reduceMotion) requestAnimationFrame(draw); };
    const load = (src) => { const im = new Image(); im.onload = onAssetLoad; im.src = src; return im; };
    const planetImg = load("assets/img/planet.png");
    const moonImg = load("assets/img/moon.png");
    const cloudImgs = [1, 2, 3, 4, 5, 6, 7].map((n) => load("assets/img/cloud" + n + ".png"));
    const fishImgs = [1, 2].map((n) => load("assets/img/fish" + n + ".png")); // sprites face right
    const sharkImg = load("assets/img/shark.png"); // faces right
    const planeImg = load("assets/img/plane.png"); // faces right
    const boatImg = load("assets/img/boat.png");   // faces right
    const whaleImg = load("assets/img/whale.png"); // faces right

    // parallax mountain ridges (far → near). Pointy peaks built from
    // irregular peak/valley nodes; far ridges get snow, near ridge is forested.
    const RIDGES = [
      { frac: 0.73, travel: 2.8, amp: 0.22, base: 0.14, col: [104, 128, 164], snow: true },
      { frac: 0.76, travel: 4.0, amp: 0.28, base: 0.28, col: [62, 86, 122], snow: true },
      { frac: 0.79, travel: 5.4, amp: 0.18, base: 0.46, col: [28, 52, 44], trees: true },
    ];
    // irregular ridgeline: alternating peaks (tall) and valleys (low) at random
    // spacing/height → jagged, non-repeating mountains. Normalised t in [-0.05,1.05].
    function makeNodes() {
      const nodes = []; let t = -0.05, up = true;
      while (t < 1.08) {
        nodes.push({ t: t, h: up ? rand(0.5, 1.0) : rand(0.0, 0.3) });
        t += up ? rand(0.05, 0.13) : rand(0.03, 0.09);
        up = !up;
      }
      return nodes;
    }
    RIDGES.forEach((rg) => { rg.nodes = makeNodes(); });
    // sample a ridge's normalised height (0..1) across every buffer column
    function sampleRidge(nodes) {
      const arr = new Float32Array(BW + 1);
      let i = 0;
      for (let x = 0; x <= BW; x++) {
        const u = x / BW;
        while (i < nodes.length - 2 && nodes[i + 1].t < u) i++;
        const a = nodes[i], b = nodes[i + 1];
        const f = Math.max(0, Math.min(1, (u - a.t) / (b.t - a.t)));
        arr[x] = a.h + (b.h - a.h) * f;
      }
      return arr;
    }

    // ---- state ----
    const SCALE = (() => Math.max(3, Math.round(innerWidth / 520)))();
    let scale = SCALE;
    let W, H, BW, BH;
    let stars = [], nebulae = [], clouds = [], fish = [], bubbles = [], birds = [], sharks = [], gore = [], planes = [], flora = [], boats = [], whales = [];
    let lastWidth = 0;
    let p = 0;                 // eased scroll fraction
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let t0 = performance.now();
    let lastMs = t0;

    function seed() {
      // stars (buffer space, wrap-scrolled in the space band)
      stars = [];
      const sn = Math.floor((BW * BH) / 850);
      for (let i = 0; i < sn; i++) {
        stars.push({
          x: rand(0, BW), y: rand(0, BH),
          z: rand(0.25, 1), ph: rand(0, 6.28), tw: rand(0.4, 2),
          hue: Math.random() < 0.16 ? "warm" : (Math.random() < 0.2 ? "cool" : "white"),
        });
      }
      // nebula clouds
      nebulae = [];
      const NEB = [[60, 30, 120], [120, 40, 90], [22, 70, 96], [40, 30, 110]];
      for (let i = 0; i < 5; i++) {
        nebulae.push({ x: rand(0, BW), y: rand(0, BH * 1.2), r: rand(BH * 0.25, BH * 0.6), c: NEB[i % NEB.length], a: rand(0.05, 0.12) });
      }
      // drifting sky clouds (frac = where in the descent they live)
      clouds = [];
      for (let i = 0; i < 16; i++) {
        clouds.push({ frac: rand(0.5, 0.72), x: rand(-0.1, 1.1), w: rand(0.16, 0.34), spd: rand(0.004, 0.018) * (Math.random() < 0.5 ? -1 : 1), depth: rand(0.4, 1), img: (Math.random() * cloudImgs.length) | 0 });
      }
      // fish (underwater)
      fish = [];
      for (let i = 0; i < 28; i++) {
        fish.push({ frac: rand(0.88, 0.99), x: rand(0, 1), dir: Math.random() < 0.5 ? 1 : -1, spd: rand(0.02, 0.06), s: rand(0.7, 1.5), img: (Math.random() * fishImgs.length) | 0, wob: rand(0, 6.28) });
      }
      // shark — a single roaming predator
      sharks = [{ frac: rand(0.89, 0.96), x: rand(0, 1), dir: Math.random() < 0.5 ? 1 : -1, spd: rand(0.05, 0.08), s: rand(1.0, 1.25), wob: rand(0, 6.28) }];
      gore = [];
      // boat — drifts along the sea surface
      boats = [{ x: rand(0, 1), dir: Math.random() < 0.5 ? 1 : -1, spd: rand(0.006, 0.012), ph: rand(0, 6.28) }];
      // whale — a lone giant gliding through the deep
      whales = [{ frac: rand(0.91, 0.96), x: rand(0, 1), dir: Math.random() < 0.5 ? 1 : -1, spd: rand(0.012, 0.022), s: rand(1.0, 1.3), wob: rand(0, 6.28) }];
      // bubbles
      bubbles = [];
      for (let i = 0; i < 40; i++) {
        bubbles.push({ x: rand(0, BW), y: rand(0, BH), r: rand(0.6, 2.4) * (scale / 4 + 0.5), spd: rand(6, 22) });
      }
      // birds
      birds = [];
      for (let i = 0; i < 6; i++) {
        birds.push({ frac: rand(0.6, 0.76), x: rand(0, 1), spd: rand(0.01, 0.03), s: rand(0.8, 1.6), ph: rand(0, 6.28) });
      }
      // airplanes — high altitude, between space and the clouds
      planes = [];
      for (let i = 0; i < 3; i++) {
        planes.push({ frac: rand(0.36, 0.52), x: rand(0, 1), dir: Math.random() < 0.5 ? 1 : -1, spd: rand(0.02, 0.045), s: rand(0.7, 1.1), wob: rand(0, 6.28) });
      }
      // sea-floor flora — kelp + coral on the ocean bed
      flora = [];
      const KELP = [[28, 92, 62], [38, 112, 74], [22, 78, 56]];
      const CORAL = [[224, 108, 120], [232, 142, 84], [156, 100, 188], [212, 96, 152], [110, 176, 184]];
      for (let i = 0; i < 6; i++) {
        flora.push({ kind: "kelp", x: rand(0.04, 0.96), h: rand(0.20, 0.34), col: KELP[(Math.random() * KELP.length) | 0], ph: rand(0, 6.28) });
      }
      const kinds = ["branch", "fan", "blob"];
      for (let i = 0; i < 7; i++) {
        flora.push({ kind: kinds[(Math.random() * kinds.length) | 0], x: rand(0.03, 0.97), h: rand(0.07, 0.15), col: CORAL[(Math.random() * CORAL.length) | 0], ph: rand(0, 6.28) });
      }
    }

    function resize() {
      scale = Math.max(3, Math.round(innerWidth / 520));
      W = cv.width = Math.floor(innerWidth);
      H = cv.height = Math.floor(innerHeight);
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      BW = buf.width = Math.max(2, Math.ceil(innerWidth / scale));
      BH = buf.height = Math.max(2, Math.ceil(innerHeight / scale));
      ctx.imageSmoothingEnabled = false;
      bx.imageSmoothingEnabled = false;
      // mobile browsers fire "resize" while scrolling as the URL bar hides/shows,
      // changing only innerHeight — re-seeding then would make every cloud, fish,
      // star etc. jump to a new random spot mid-scroll. Only reseed on real
      // width changes (e.g. orientation change or a real layout resize).
      if (innerWidth === lastWidth) return;
      lastWidth = innerWidth;
      seed();
    }

    function metrics() {
      const sh = document.documentElement.scrollHeight;
      const sy = window.scrollY || window.pageYOffset || 0;
      return { sh: sh, sy: sy, docH: Math.max(1, sh - innerHeight) };
    }

    // vertical screen position (buffer space) for a feature centred at
    // scroll fraction `frac`; `travel` controls parallax speed.
    function fy(frac, travel) { return BH * 0.5 + (frac - p) * BH * travel; }

    function ellipse(cx, cy, rx, ry) {
      bx.beginPath(); bx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, 6.2832); bx.fill();
    }

    const shade = (c, d) => [Math.max(0, Math.min(255, c[0] + d)), Math.max(0, Math.min(255, c[1] + d)), Math.max(0, Math.min(255, c[2] + d))];

    // a swaying kelp plant: a few tapered, leafy fronds rooted at (x, baseY)
    function drawKelp(x, baseY, h, col, ph, a, t) {
      for (let st = 0; st < 3; st++) {
        const sx = x + (st - 1) * h * 0.12;
        const fh = h * (1 - Math.abs(st - 1) * 0.2);
        const seg = 8, amp = fh * 0.26;
        const px = [], py = [];
        for (let i = 0; i <= seg; i++) {
          const tt2 = i / seg;
          px.push(sx + Math.sin(t * 1.1 + ph + st + tt2 * 2.6) * amp * tt2);
          py.push(baseY - tt2 * fh);
        }
        const wB = Math.max(1.2, fh * 0.06);
        bx.fillStyle = rgb(col, a);
        bx.beginPath();
        for (let i = 0; i <= seg; i++) bx.lineTo(px[i] - wB * (1 - i / seg * 0.75), py[i]);
        for (let i = seg; i >= 0; i--) bx.lineTo(px[i] + wB * (1 - i / seg * 0.75), py[i]);
        bx.closePath(); bx.fill();
        bx.fillStyle = rgb(shade(col, 24), a);     // leaf blades
        for (let i = 1; i < seg; i++) {
          const side = i % 2 ? 1 : -1;
          ellipse(px[i] + side * fh * 0.07, py[i], fh * 0.08, fh * 0.035);
        }
      }
    }

    // one coral: branching, fan, or rounded "brain" blob, rooted at (x, baseY)
    function coralBranch(x, y, ang, len, thick, depth) {
      const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
      const steps = Math.max(2, Math.ceil(len));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        bx.beginPath(); bx.arc(x + (ex - x) * t, y + (ey - y) * t, Math.max(0.8, thick * (1 - t * 0.35)), 0, 6.2832); bx.fill();
      }
      if (depth < 2) {
        coralBranch(ex, ey, ang - 0.5 - depth * 0.1, len * 0.72, thick * 0.72, depth + 1);
        coralBranch(ex, ey, ang + 0.5 + depth * 0.1, len * 0.72, thick * 0.72, depth + 1);
        if (depth === 0) coralBranch(ex, ey, ang + 0.06, len * 0.74, thick * 0.72, 1);
      }
    }
    function drawCoral(x, baseY, h, col, a, kind) {
      if (kind === "branch") {
        bx.fillStyle = rgb(col, a);
        coralBranch(x, baseY, -Math.PI / 2, h * 0.5, h * 0.16, 0);
        bx.fillStyle = rgb(shade(col, 30), a);
        coralBranch(x, baseY - h * 0.05, -Math.PI / 2 - 0.15, h * 0.34, h * 0.1, 1);
      } else if (kind === "fan") {
        const top = baseY - h;
        bx.fillStyle = rgb(shade(col, -30), a);      // stem
        bx.fillRect(x - Math.max(1, h * 0.04), baseY - h * 0.35, Math.max(1, h * 0.08), h * 0.35);
        bx.fillStyle = rgb(col, a);
        bx.beginPath();
        bx.moveTo(x, baseY - h * 0.2);
        bx.quadraticCurveTo(x - h * 0.7, top + h * 0.1, x - h * 0.45, top);
        bx.quadraticCurveTo(x, top - h * 0.18, x + h * 0.45, top);
        bx.quadraticCurveTo(x + h * 0.7, top + h * 0.1, x, baseY - h * 0.2);
        bx.closePath(); bx.fill();
        bx.strokeStyle = rgb(shade(col, -34), a * 0.8); bx.lineWidth = 1;
        for (let k = -2; k <= 2; k++) { bx.beginPath(); bx.moveTo(x, baseY - h * 0.2); bx.lineTo(x + k * h * 0.2, top + h * 0.05); bx.stroke(); }
      } else { // blob (brain coral)
        bx.fillStyle = rgb(col, a);
        ellipse(x, baseY - h * 0.32, h * 0.52, h * 0.4);
        ellipse(x - h * 0.34, baseY - h * 0.14, h * 0.3, h * 0.24);
        ellipse(x + h * 0.36, baseY - h * 0.15, h * 0.28, h * 0.22);
        bx.fillStyle = rgb(shade(col, 34), a * 0.9);
        ellipse(x - h * 0.1, baseY - h * 0.42, h * 0.2, h * 0.13);
      }
    }

    // burst of blood-mist particles where a fish was eaten
    const GORE_COLS = [[150, 18, 18], [120, 10, 10], [184, 38, 38], [92, 6, 6]];
    function spawnGore(x, y, sz) {
      const n = 12 + (Math.random() * 8 | 0);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.2832, sp = rand(0.3, 1) * sz * 1.4;
        gore.push({
          x: x, y: y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - sz * 0.2,
          r: rand(0.15, 0.4) * sz, grow: rand(0.4, 1) * sz,
          life: rand(0.7, 1), c: GORE_COLS[(Math.random() * GORE_COLS.length) | 0],
        });
      }
    }

    // little evergreen (stacked triangles + trunk) sitting on (x, baseY)
    function tree(x, baseY, h) {
      const tw = Math.max(1, h * 0.14);
      bx.fillStyle = "rgb(40,28,18)";
      bx.fillRect(x - tw / 2, baseY - h * 0.16, tw, h * 0.16);
      bx.fillStyle = "rgb(20,42,30)";
      for (let k = 0; k < 3; k++) {
        const ty = baseY - h * 0.16 - k * h * 0.24;
        const w = h * (0.46 - k * 0.12);
        bx.beginPath();
        bx.moveTo(x, ty - h * 0.34);
        bx.lineTo(x - w, ty);
        bx.lineTo(x + w, ty);
        bx.closePath(); bx.fill();
      }
    }

    function draw(now) {
      const ts = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - lastMs) / 1000); lastMs = now;
      const m = metrics();
      const fTop = m.sy / m.sh;                 // true world fraction (top of viewport)
      const target = m.sy / m.docH;
      p += (target - p) * (reduceMotion ? 1 : 0.12);
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const tt = reduceMotion ? 0 : ts;
      const mx = mouse.x;

      // ---- 1. sky gradient (per buffer row, tied to true scroll) ----
      for (let y = 0; y < BH; y++) {
        const f = fTop + (y * scale) / m.sh;
        const c = skyColor(f);
        bx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        bx.fillRect(0, y, BW, 1);
      }

      // ---- 2. nebulae (space) ----
      const spaceA = clamp01(1 - (p - 0.20) / 0.12);
      if (spaceA > 0.01) {
        for (const n of nebulae) {
          const ny = ((n.y - m.sy * 0.03) % (BH * 1.4) + BH * 1.4) % (BH * 1.4) - BH * 0.2;
          const g = bx.createRadialGradient(n.x + mx * 6, ny, 0, n.x + mx * 6, ny, n.r);
          g.addColorStop(0, rgb(n.c, n.a * spaceA));
          g.addColorStop(1, rgb(n.c, 0));
          bx.fillStyle = g;
          bx.fillRect(n.x + mx * 6 - n.r, ny - n.r, n.r * 2, n.r * 2);
        }
      }

      // ---- 3. stars (space) ----
      const starA = clamp01(1 - (p - 0.22) / 0.11);
      if (starA > 0.01) {
        for (const s of stars) {
          const sy2 = ((s.y - m.sy * 0.05 * s.z) % BH + BH) % BH;
          const sx = s.x + mx * 5 * s.z;
          const tw = 0.4 + Math.sin(tt * s.tw + s.ph) * 0.35 + s.z * 0.25;
          const a = clamp01(tw) * starA;
          const col = s.hue === "warm" ? [233, 201, 135] : s.hue === "cool" ? [127, 214, 232] : [244, 241, 255];
          bx.fillStyle = rgb(col, a);
          const r = s.z > 0.8 ? 2 : 1;
          bx.fillRect(sx | 0, sy2 | 0, r, r);
        }
      }

      // ---- 4. flat celestial bodies (supplied pixel art, drift by) ----
      // distant ringed planet, high up
      const planA = band(p, 0.0, 0.22, 0.0, 0.06);
      if (planA > 0.01 && ready(planetImg)) {
        const s = BH * 0.26;
        const pxp = BW * 0.2 + mx * 4;
        const pyp = fy(0.06, 2.2);
        bx.globalAlpha = planA;
        bx.save();
        bx.translate(pxp, pyp);
        bx.rotate(-0.35); // tilt the planet
        bx.drawImage(planetImg, -s / 2, -s / 2, s, s);
        bx.restore();
        bx.globalAlpha = 1;
      }
      // the moon — smaller than the planet
      const moonA = band(p, 0.0, 0.30, 0.0, 0.06);
      if (moonA > 0.01 && ready(moonImg)) {
        const s = BH * 0.14;
        const cxm = BW * 0.74 + mx * 6;
        const cym = fy(0.15, 3.0);
        bx.globalAlpha = moonA;
        bx.drawImage(moonImg, cxm - s / 2, cym - s / 2, s, s);
        bx.globalAlpha = 1;
      }

      // ---- 6. sun ----
      const sunA = band(p, 0.5, 0.74, 0.06, 0.05);
      if (sunA > 0.01) {
        const sxp = BW * 0.74 + mx * 4;
        const syp = fy(0.6, 2.4) - BH * 0.1;
        const sg = bx.createRadialGradient(sxp, syp, 0, sxp, syp, BH * 0.5);
        sg.addColorStop(0, rgb([255, 244, 214], 0.9 * sunA));
        sg.addColorStop(0.18, rgb([255, 232, 180], 0.5 * sunA));
        sg.addColorStop(1, rgb([255, 220, 160], 0));
        bx.fillStyle = sg;
        bx.fillRect(sxp - BH * 0.5, syp - BH * 0.5, BH, BH);
        bx.fillStyle = rgb([255, 248, 226], 0.95 * sunA);
        bx.beginPath(); bx.arc(sxp, syp, BH * 0.05, 0, 6.2832); bx.fill();
      }

      // ---- 6.5 airplanes (drawn before clouds so they fly among them) ----
      if (ready(planeImg)) {
        for (const pl of planes) {
          const pa = band(p, 0.30, 0.56, 0.06, 0.06);
          if (pa < 0.01) continue;
          let plx = (((pl.x + (reduceMotion ? 0 : tt * pl.spd * pl.dir)) % 1.3) + 1.3) % 1.3;
          plx = plx * BW - BW * 0.15;
          const ply = fy(pl.frac, 4) + Math.sin(tt * 0.8 + pl.wob) * BH * 0.015;
          const psz = BH * 0.12 * pl.s;
          bx.globalAlpha = pa;
          bx.save();
          bx.translate(plx, ply);
          if (pl.dir < 0) bx.scale(-1, 1); // moving left → mirror the right-facing art
          bx.drawImage(planeImg, -psz / 2, -psz / 2, psz, psz);
          bx.restore();
          bx.globalAlpha = 1;
        }
      }

      // ---- 7. clouds (supplied pixel sprites) ----
      for (const c of clouds) {
        const ca = band(p, c.frac - 0.12, c.frac + 0.12, 0.06, 0.06);
        if (ca < 0.01) continue;
        const img = cloudImgs[c.img];
        if (!ready(img)) continue;
        const cw = c.w * BW;
        let cxp = (((c.x + (reduceMotion ? 0 : tt * c.spd)) % 1.4) + 1.4) % 1.4;
        cxp = cxp * BW - BW * 0.2 + mx * 10 * c.depth;
        const cyp = fy(c.frac, 4.5);
        bx.globalAlpha = ca * (0.55 + c.depth * 0.45); // distant clouds fainter
        bx.drawImage(img, cxp - cw / 2, cyp - cw / 2, cw, cw);
        bx.globalAlpha = 1;
      }

      // ---- 8. birds ----
      for (const b of birds) {
        const ba = band(p, b.frac - 0.06, b.frac + 0.06, 0.03, 0.03);
        if (ba < 0.01) continue;
        const bxp = ((((b.x + (reduceMotion ? 0 : tt * b.spd)) % 1.2) + 1.2) % 1.2) * BW - BW * 0.1;
        const byp = fy(b.frac, 4) + Math.sin(tt + b.ph) * BH * 0.02;
        const s = b.s * (scale / 4 + 0.6);
        const flap = Math.sin(tt * 6 + b.ph) * s;
        bx.strokeStyle = rgb([20, 26, 40], 0.5 * ba);
        bx.lineWidth = 1;
        bx.beginPath();
        bx.moveTo(bxp - 2 * s, byp + flap); bx.lineTo(bxp, byp);
        bx.lineTo(bxp + 2 * s, byp + flap); bx.stroke();
      }

      // ---- 9. parallax mountain ridges (pointy, snow caps, trees) ----
      const ra = band(p, 0.60, 0.82, 0.06, 0.03);
      if (ra > 0.01) {
        for (let ri = 0; ri < RIDGES.length; ri++) {
          const rg = RIDGES[ri];
          const yb = fy(rg.frac, rg.travel) + BH * rg.base;
          const ah = rg.amp * BH;
          const H = sampleRidge(rg.nodes);

          // silhouette path (reused for fill + snow clip)
          const peak = new Path2D();
          peak.moveTo(0, BH + 2);
          for (let x = 0; x <= BW; x += 1) peak.lineTo(x, yb - H[x] * ah);
          peak.lineTo(BW, BH + 2); peak.closePath();
          bx.fillStyle = rgb(rg.col, ra);
          bx.fill(peak);

          // snow caps — white fill clipped to the peaks, above a wavy snow line
          if (rg.snow) {
            const snowY = yb - ah * 0.46;
            bx.save();
            bx.clip(peak);
            bx.beginPath();
            bx.moveTo(0, yb - ah * 1.2); bx.lineTo(BW, yb - ah * 1.2);
            for (let x = BW; x >= 0; x -= 2) bx.lineTo(x, snowY + Math.sin(x * 0.25 + ri) * (ah * 0.05));
            bx.closePath();
            bx.fillStyle = rgb([236, 242, 252], ra);
            bx.fill();
            bx.restore();
          }

          // evergreens along the near (forested) ridge
          if (rg.trees) {
            const step = Math.max(6, BW / 30);
            const th = BH * 0.032;
            bx.globalAlpha = ra;
            for (let x = step * 0.5; x < BW; x += step) {
              const jx = x + Math.sin(x * 1.7) * step * 0.3;
              const topY = yb - H[Math.max(0, Math.min(BW, Math.round(jx)))] * ah;
              tree(jx, topY + 1, th * (0.8 + (Math.sin(x * 3.1) * 0.5 + 0.5) * 0.5));
            }
            bx.globalAlpha = 1;
          }
        }
      }

      // ---- 10. sea surface line + glints ----
      const surfA = band(p, 0.84, 0.90, 0.02, 0.03);
      if (surfA > 0.01) {
        const sl = fy(0.87, 6);
        bx.fillStyle = rgb([180, 224, 232], 0.5 * surfA);
        for (let x = 0; x < BW; x += 2) {
          const yy = sl + Math.sin(x * 0.2 + tt * 2) * 1.5;
          bx.fillRect(x, yy | 0, 2, 1);
        }
        // sun glitter column
        const gxp = BW * 0.74;
        bx.fillStyle = rgb([255, 244, 214], 0.4 * surfA);
        for (let x = gxp - BW * 0.06; x < gxp + BW * 0.06; x += 2) {
          if (Math.random() < 0.5) bx.fillRect(x, (sl + Math.sin(x + tt * 3) * 2) | 0, 2, 1);
        }

        // boat — rides the waterline, rocking with the swell
        if (ready(boatImg)) {
          for (const bt of boats) {
            let btx = (((bt.x + (reduceMotion ? 0 : tt * bt.spd * bt.dir)) % 1.2) + 1.2) % 1.2;
            btx = btx * BW - BW * 0.1;
            const bsz = BH * 0.13;
            const rock = Math.sin(tt * 1.1 + bt.ph);
            bx.globalAlpha = surfA;
            bx.save();
            bx.translate(btx, sl - bsz * 0.26 + rock * BH * 0.006); // hull dips below the line
            if (bt.dir > 0) bx.scale(-1, 1); // boat art faces left → mirror when sailing right
            bx.rotate(rock * 0.05);
            bx.drawImage(boatImg, -bsz / 2, -bsz / 2, bsz, bsz);
            bx.restore();
            bx.globalAlpha = 1;
          }
        }
      }

      // ---- 11. underwater ----
      const waterA = band(p, 0.86, 1.0, 0.03, 0.0);
      if (waterA > 0.01) {
        // god rays
        const rayTop = fy(0.87, 6);
        bx.save();
        bx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 4; i++) {
          const rx = BW * (0.2 + i * 0.2) + Math.sin(tt * 0.3 + i) * BW * 0.04;
          const w = BW * 0.05;
          const rg2 = bx.createLinearGradient(rx, rayTop, rx + BW * 0.12, BH);
          rg2.addColorStop(0, rgb([150, 220, 230], 0.10 * waterA));
          rg2.addColorStop(1, rgb([150, 220, 230], 0));
          bx.fillStyle = rg2;
          bx.beginPath();
          bx.moveTo(rx, rayTop); bx.lineTo(rx + w, rayTop);
          bx.lineTo(rx + BW * 0.16 + w, BH); bx.lineTo(rx + BW * 0.16, BH);
          bx.closePath(); bx.fill();
        }
        bx.restore();

        // whale — a lone giant gliding through the deep (behind the fish)
        for (const wh of whales) {
          const wa = band(p, wh.frac - 0.14, wh.frac + 0.14, 0.05, 0.05) * waterA;
          if (wa < 0.01 || !ready(whaleImg)) continue;
          let wx = (((wh.x + (reduceMotion ? 0 : tt * wh.spd * wh.dir)) % 1.4) + 1.4) % 1.4;
          wx = wx * BW - BW * 0.2;
          const wyp = fy(wh.frac, 7) + Math.sin(tt * 0.8 + wh.wob) * BH * 0.03;
          const wsz = BH * 0.32 * wh.s;
          bx.globalAlpha = 0.88 * wa;
          bx.save();
          bx.translate(wx, wyp);
          if (wh.dir < 0) bx.scale(-1, 1);
          bx.drawImage(whaleImg, -wsz / 2, -wsz / 2, wsz, wsz);
          bx.restore();
          bx.globalAlpha = 1;
        }

        // fish (supplied pixel sprites — art faces right, flip when going left)
        for (const f of fish) {
          const fa = band(p, f.frac - 0.1, f.frac + 0.1, 0.05, 0.05) * waterA;
          f._fa = fa;
          if (fa < 0.01) continue;
          const img = fishImgs[f.img];
          if (!ready(img)) continue;
          let fx = (((f.x + (reduceMotion ? 0 : tt * f.spd * f.dir)) % 1.2) + 1.2) % 1.2;
          fx = fx * BW - BW * 0.1;
          const fyp = fy(f.frac, 7) + Math.sin(tt * 2 + f.wob) * BH * 0.02;
          const sz = BH * 0.07 * f.s;
          f._x = fx; f._y = fyp; f._sz = sz; // remembered for shark collision
          bx.globalAlpha = 0.92 * fa;
          bx.save();
          bx.translate(fx, fyp);
          if (f.dir < 0) bx.scale(-1, 1); // moving left → mirror the right-facing art
          bx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
          bx.restore();
          bx.globalAlpha = 1;
        }

        // shark — predator; its mouth (front-centre) can eat passing fish
        for (const sh of sharks) {
          const sa = band(p, sh.frac - 0.12, sh.frac + 0.12, 0.05, 0.05) * waterA;
          if (sa < 0.01 || !ready(sharkImg)) continue;
          let sx = (((sh.x + (reduceMotion ? 0 : tt * sh.spd * sh.dir)) % 1.3) + 1.3) % 1.3;
          sx = sx * BW - BW * 0.15;
          const syp = fy(sh.frac, 7) + Math.sin(tt * 1.3 + sh.wob) * BH * 0.02;
          const ssz = BH * 0.18 * sh.s;
          // mouth point sits at the front, slightly low (where the teeth are)
          const mouthX = sx + sh.dir * ssz * 0.40;
          const mouthY = syp + ssz * 0.10;
          const bite = ssz * 0.16;
          for (const f of fish) {
            if (f._fa < 0.01) continue;
            const dx = f._x - mouthX, dy = f._y - mouthY;
            const reach = bite + f._sz * 0.4;
            if (dx * dx + dy * dy < reach * reach) {
              // mouth contact → always eat
              spawnGore(f._x, f._y, f._sz);
              // respawn the fish elsewhere
              f.frac = rand(0.88, 0.99);
              f.x = Math.random();
              f.dir = Math.random() < 0.5 ? 1 : -1;
              f.img = (Math.random() * fishImgs.length) | 0;
              f._fa = 0;
            }
          }
          bx.globalAlpha = 0.95 * sa;
          bx.save();
          bx.translate(sx, syp);
          if (sh.dir < 0) bx.scale(-1, 1);
          bx.drawImage(sharkImg, -ssz / 2, -ssz / 2, ssz, ssz);
          bx.restore();
          bx.globalAlpha = 1;
        }

        // blood mist — expanding, fading red puffs from a kill
        for (let i = gore.length - 1; i >= 0; i--) {
          const g = gore[i];
          if (!reduceMotion) {
            g.x += g.vx * dt; g.y += g.vy * dt;
            g.vy -= g.vy * 0.6 * dt;     // drag
            g.vx -= g.vx * 0.6 * dt;
            g.r += g.grow * dt;
            g.life -= dt / 1.1;
          }
          if (g.life <= 0) { gore.splice(i, 1); continue; }
          bx.fillStyle = rgb(g.c, Math.max(0, g.life) * 0.6 * waterA);
          ellipse(g.x, g.y, g.r, g.r);
        }

        // bubbles
        bx.fillStyle = rgb([200, 234, 240], 0.4 * waterA);
        for (const b of bubbles) {
          if (!reduceMotion) b.y -= b.spd * 0.016;
          if (b.y < -4) { b.y = BH + rand(0, 20); b.x = rand(0, BW); }
          const bxp = b.x + Math.sin((b.y + tt * 20) * 0.05) * 3;
          bx.fillRect(bxp | 0, b.y | 0, Math.max(1, b.r | 0), Math.max(1, b.r | 0));
        }

        // sea floor + kelp + coral (very bottom)
        const floorA = band(p, 0.93, 1.0, 0.04, 0.0);
        if (floorA > 0.01) {
          const fl = fy(0.99, 7);
          const floorY = (fx) => fl + Math.sin(fx * 0.05) * BH * 0.03;
          bx.fillStyle = rgb([10, 30, 36], floorA);
          bx.beginPath(); bx.moveTo(0, BH);
          for (let x = 0; x <= BW; x += 3) bx.lineTo(x, floorY(x));
          bx.lineTo(BW, BH); bx.closePath(); bx.fill();
          // kelp first (taller, behind), then coral nestled in front
          for (const o of flora) {
            if (o.kind !== "kelp") continue;
            const fx = o.x * BW;
            drawKelp(fx, floorY(fx) + 1, o.h * BH, o.col, o.ph, floorA, tt);
          }
          for (const o of flora) {
            if (o.kind === "kelp") continue;
            const fx = o.x * BW;
            drawCoral(fx, floorY(fx) + 1, o.h * BH, o.col, floorA, o.kind);
          }
        }
      }

      // ---- 12. subtle vignette ----
      const vg = bx.createRadialGradient(BW / 2, BH / 2, BH * 0.4, BW / 2, BH / 2, BH * 0.85);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.28)");
      bx.fillStyle = vg; bx.fillRect(0, 0, BW, BH);

      // ---- blit low-res buffer → screen (pixelated) ----
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(buf, 0, 0, BW, BH, 0, 0, W, H);

      if (reduceMotion) return;
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", () => { resize(); if (reduceMotion) requestAnimationFrame(draw); }, { passive: true });
    window.addEventListener("mousemove", (e) => {
      mouse.tx = (e.clientX / innerWidth - 0.5);
      mouse.ty = (e.clientY / innerHeight - 0.5);
    }, { passive: true });
    if (reduceMotion) window.addEventListener("scroll", () => requestAnimationFrame(draw), { passive: true });

    resize();
    p = (function () { const m = metrics(); return m.sy / m.docH; })();
    requestAnimationFrame(draw);
  })();
})();
