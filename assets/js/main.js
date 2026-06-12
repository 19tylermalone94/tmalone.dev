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

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
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
      const m = 60, edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * gw; y = -m; }
      else if (edge === 1) { x = gw + m; y = Math.random() * gh; }
      else if (edge === 2) { x = Math.random() * gw; y = gh + m; }
      else { x = -m; y = Math.random() * gh; }
      const tough = Math.random() < Math.min(0.4, gTime * 0.006);
      foes.push({ x, y, vx: 0, vy: 0, r: tough ? 21 : 15, hp: tough ? 3 : 1, hue: tough ? "gold" : "rose", shoot: 0.8 + Math.random() * 1.4, wob: Math.random() * 6.2832 });
    }

    function tryShoot() {
      if (!alive || fireT > 0) return;
      fireT = FIRE_CD;
      shots++;
      const rad = rot * Math.PI / 180;
      const dx = Math.sin(rad), dy = -Math.cos(rad);
      pBullets.push({ x: px + dx * 28, y: py + dy * 28, vx: dx * BULLET_V + vx * 0.3, vy: dy * BULLET_V + vy * 0.3, life: 1.1 });
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
      explode(px, py, "gold", 40); explode(px, py, "rose", 26); explode(px, py, "white", 16);
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

      const foeSpeed = Math.min(330, 150 + gTime * 2.4);
      for (let i = foes.length - 1; i >= 0; i--) {
        const f = foes[i];
        f.wob += dt * 2.2;
        const dx = px - f.x, dy = py - f.y, d = Math.hypot(dx, dy) || 1;
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
        let gone = b.life <= 0 || b.x < -30 || b.x > gw + 30 || b.y < -30 || b.y > gh + 30;
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
        const d = Math.hypot(b.x - px, b.y - py);
        if (alive && d < 14) { fBullets.splice(i, 1); hitPlayer(10); continue; }
        if (alive && !b.grazed && d < 34) { b.grazed = true; grazes++; }
        if (b.life <= 0 || b.x < -40 || b.x > gw + 40 || b.y < -40 || b.y > gh + 40) fBullets.splice(i, 1);
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
      gctx.translate(shakeX, shakeY);

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

  /* ---- Experience entry modals ---- */
  (function () {
    const timeline = document.querySelector(".timeline");
    const modal = document.getElementById("entryModal");
    if (!timeline || !modal) return;

    const panel = modal.querySelector(".entry-modal__panel");
    const closeBtn = document.getElementById("modalClose");
    const modalLayer = document.getElementById("modalLayer");
    const modalOrg = document.getElementById("modalOrg");
    const modalRole = document.getElementById("modalRole");
    const modalDate = document.getElementById("modalDate");
    const modalContent = document.getElementById("modalContent");

    let focusBefore = null;

    function openModal(entry) {
      const layer = entry.getAttribute("data-layer") || "";
      const alt = entry.getAttribute("data-alt") || "";
      const org = entry.querySelector(".entry__org");
      const role = entry.querySelector(".entry__role");
      const date = entry.querySelector(".entry__date");
      const detail = entry.querySelector(".entry__detail");

      if (modalLayer) modalLayer.textContent = layer + (alt ? " · " + alt : "");
      if (modalOrg && org) modalOrg.textContent = org.textContent;
      if (modalRole && role) modalRole.textContent = role.textContent;
      if (modalDate && date) modalDate.textContent = date.textContent;
      if (modalContent && detail) modalContent.innerHTML = detail.innerHTML;
      if (panel) panel.scrollTop = 0;

      focusBefore = document.activeElement;
      modal.hidden = false;
      modal.removeAttribute("aria-hidden");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        modal.classList.add("in");
        if (closeBtn) closeBtn.focus();
      });
    }

    function closeModal() {
      modal.classList.remove("in");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      const done = () => {
        modal.hidden = true;
        if (focusBefore) focusBefore.focus();
      };
      modal.addEventListener("transitionend", done, { once: true });
    }

    timeline.addEventListener("click", (e) => {
      if (document.documentElement.classList.contains("flying")) return;
      const card = e.target.closest(".entry__card");
      if (!card) return;
      const entry = card.closest(".entry");
      if (entry) openModal(entry);
    });

    timeline.addEventListener("keydown", (e) => {
      if (document.documentElement.classList.contains("flying")) return;
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest(".entry__card");
        if (card) {
          e.preventDefault();
          const entry = card.closest(".entry");
          if (entry) openModal(entry);
        }
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  })();
})();
