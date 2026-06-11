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
     Flight mode — drive a rocket with WASD / arrows; flying past
     the top or bottom of the comfort band scrolls the page.
     ============================================================ */
  (function flight() {
    const btn = document.getElementById("flyBtn");
    const rocket = document.getElementById("rocket");
    const flame = rocket && rocket.querySelector(".rocket__flame");
    const dpad = document.getElementById("dpad");
    if (!btn || !rocket || !flame) return;

    const ACCEL = 2200;     // px/s^2 of thrust
    const DAMP = 2.6;       // velocity damping per second
    const MAXV = 1100;      // px/s speed cap
    const MARGIN = 70;      // how close the rocket gets to viewport edges
    const BOOST_ACCEL = 2;  // thrust multiplier while Shift is held
    const BOOST_MAXV = 2100; // raised speed cap while boosting

    let active = false;
    let raf = 0, last = 0;
    let px = 0, py = 0, vx = 0, vy = 0, rot = 0, thrust = 0;
    const keys = { up: false, down: false, left: false, right: false, boost: false };

    const KEYMAP = {
      ArrowUp: "up", KeyW: "up",
      ArrowDown: "down", KeyS: "down",
      ArrowLeft: "left", KeyA: "left",
      ArrowRight: "right", KeyD: "right",
    };

    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    function lerpAngle(a, b, t) {
      let d = ((b - a + 540) % 360) - 180;
      return a + d * t;
    }

    function render() {
      rocket.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      flame.style.setProperty("--thrust", thrust.toFixed(3));
    }

    function step(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      const ay = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
      const boosting = keys.boost && (ax !== 0 || ay !== 0);

      const accel = ACCEL * (keys.boost ? BOOST_ACCEL : 1);
      vx += ax * accel * dt;
      vy += ay * accel * dt;

      // exponential damping toward rest
      const damp = Math.exp(-DAMP * dt);
      vx *= damp; vy *= damp;

      // speed cap (raised while boosting)
      const maxv = keys.boost ? BOOST_MAXV : MAXV;
      const sp = Math.hypot(vx, vy);
      if (sp > maxv) { vx = vx / sp * maxv; vy = vy / sp * maxv; }
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
        py = yMax + (over - moved);           // leftover (page bottom) pushes rocket to the edge
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

      // point the nose along the direction of travel (nose-up = 0deg);
      // hold the last heading when nearly stopped to avoid jitter.
      if (sp > 40) {
        const targetRot = Math.atan2(vx, -vy) * 180 / Math.PI;
        rot = lerpAngle(rot, targetRot, 0.2);
      }
      let wantThrust = clamp((Math.abs(ax) + Math.abs(ay)) * 0.7 + sp / MAXV * 0.6, 0, 1);
      if (boosting) wantThrust = 1.4;          // afterburner flare
      thrust += (wantThrust - thrust) * 0.25;

      render();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (active) return;
      active = true;
      px = innerWidth / 2;
      py = innerHeight - MARGIN;        // launch from near the bottom
      vx = 0; vy = -MAXV * 0.5; rot = 0; thrust = 1;
      rocket.hidden = false;
      if (dpad) { dpad.hidden = false; dpad.classList.add("is-on"); }
      document.documentElement.classList.add("flying");
      btn.setAttribute("aria-pressed", "true");
      render();
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    function stop() {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      keys.up = keys.down = keys.left = keys.right = keys.boost = false;
      rocket.classList.remove("is-boosting");
      rocket.hidden = true;
      if (dpad) { dpad.hidden = true; dpad.classList.remove("is-on"); }
      document.documentElement.classList.remove("flying");
      btn.setAttribute("aria-pressed", "false");
    }

    function toggle() { active ? stop() : start(); }

    btn.addEventListener("click", toggle);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && active) { stop(); return; }
      if (!active) return;
      if (e.key === "Shift") { keys.boost = true; return; }
      const dir = KEYMAP[e.code];
      if (!dir) return;
      keys[dir] = true;
      e.preventDefault();                // stop arrows/space from scrolling on their own
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Shift") keys.boost = false;
      const dir = KEYMAP[e.code];
      if (dir) keys[dir] = false;
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

    // if the window shrinks, keep the rocket on screen
    window.addEventListener("resize", () => {
      if (!active) return;
      px = clamp(px, MARGIN, innerWidth - MARGIN);
      py = clamp(py, MARGIN, innerHeight - MARGIN);
    }, { passive: true });
  })();
})();
