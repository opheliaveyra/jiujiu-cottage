/* 玖玖の小屋 · pocket interactions and resilient day/night controls */
(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (selector) => document.querySelector(selector);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const note = document.createElement("div");
  note.className = "atelier-visit-toast";
  note.setAttribute("role","status");
  note.setAttribute("aria-live","polite");
  document.body.append(note);
  let toastTimer;
  function toast(message) {
    note.textContent = message;
    note.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => note.classList.remove("show"), 3000);
  }
  const stamp = $("#atelier-stamp");
  const stampKey = "jiujiu-atelier-visitor-stamp-v1";
  let stamped = false;
  try { stamped = localStorage.getItem(stampKey) === "yes"; } catch (err) {}
  function renderStamp() {
    if (!stamp) return;
    stamp.classList.toggle("is-stamped", stamped);
    stamp.setAttribute("aria-pressed", String(stamped));
    stamp.querySelector(".atelier-stamp-action").textContent = stamped ? "已经盖章 ✓" : "领取来访印章";
  }
  renderStamp();
  stamp?.addEventListener("click", () => {
    if (!stamped) {
      stamped = true;
      try { localStorage.setItem(stampKey, "yes"); } catch(err) {}
      renderStamp();
      toast("✦ 旅人印章已收好。欢迎来到玖玖的小屋！");
      if (!reduce && typeof stamp.animate === "function") {
        const bounds = stamp.getBoundingClientRect();
        for (let i = 0; i < 12; i++) {
          const bit = document.createElement("span");
          bit.className = "atelier-confetti";
          bit.textContent = ["✦","✿","♡","✧"][i % 4];
          bit.style.left = (bounds.left + bounds.width * .5) + "px";
          bit.style.top = (bounds.top + bounds.height * .5) + "px";
          document.body.append(bit);
          const angle = (i/12)*Math.PI*2;
          bit.animate([
            {transform:"translate(0,0) scale(.3)",opacity:1},
            {transform:"translate("+(Math.cos(angle)*(55+i%3*22))+"px,"+(Math.sin(angle)*(50+i%4*12)-30)+"px) rotate("+(i*31)+"deg) scale(1)",opacity:0}
          ],{duration:750+i*28,easing:"cubic-bezier(.15,.8,.15,1)"}).onfinish = () => bit.remove();
          window.setTimeout(()=>bit.remove(),1300);
        }
      }
    } else {
      toast("这枚来访印章已经属于你啦 ♡");
    }
  });
  // The original site script is primary. This only takes over when a toggle failed to change state.
  function syncTheme() {
    const night = root.dataset.tone === "night";
    const stage = $("#pc-theater");
    if (stage) stage.dataset.time = night ? "night" : "day";
    const scene = $("#map-scene");
    if (scene) scene.dataset.night = String(night);
    const headerToggle = $("#tone");
    if (headerToggle) {
      headerToggle.setAttribute("aria-pressed",String(night));
      headerToggle.setAttribute("aria-label",night?"切换日间模式":"切换夜间模式");
      headerToggle.textContent = night ? "☀" : "☾";
    }
    const stageToggle = $("#pc-daynight");
    if (stageToggle) {
      stageToggle.setAttribute("aria-pressed",String(night));
      stageToggle.textContent = night?"☼ 切到白天":"☾ 切到夜晚";
    }
  }
  function fallbackTheme() {
    root.dataset.tone = root.dataset.tone === "night" ? "day" : "night";
    try { localStorage.setItem("jiujiu-tone",root.dataset.tone); } catch(err) {}
    syncTheme();
  }
  ["#tone","#pc-daynight","#map-time"].forEach((selector) => {
    const button = $(selector);
    if (!button) return;
    button.addEventListener("click", () => {
      const before = root.dataset.tone || "day";
      window.setTimeout(() => {
        if ((root.dataset.tone || "day") === before) fallbackTheme();
      },0);
    },{capture:true});
  });
  const observer = new MutationObserver(syncTheme);
  observer.observe(root,{attributes:true,attributeFilter:["data-tone"]});
  window.addEventListener("pageshow",syncTheme);
  syncTheme();
  // Reveal tactile field-guide tiles after entering viewport.
  const guides = document.querySelectorAll(".atelier-wayfinder a");
  if (guides.length && !reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    },{threshold:.12});
    guides.forEach((tile,index) => {
      tile.style.setProperty("--tile-delay",(index*85)+"ms");
      io.observe(tile);
    });
  } else { guides.forEach(tile=>tile.classList.add("is-visible")); }
})();
