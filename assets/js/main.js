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
})();
