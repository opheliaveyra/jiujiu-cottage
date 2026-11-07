/* Jiujiu's Little Corner · 2D interaction layer.
 * No external dependencies, no canvas render loop, no tracking.
 */
(() => {
  "use strict";
  const body = document.body;
  const themeButton = document.getElementById("themeToggle");
  const menuButton = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const ideaButton = document.getElementById("ideaButton");
  const quote = document.getElementById("noteQuote");
  const hint = document.getElementById("noteHint");
  const noteNumber = document.getElementById("noteNumber");
  const progressBar = document.getElementById("progressBar");
  const hero = document.getElementById("heroScene");
  const reducesMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasFinePointer = window.matchMedia("(pointer: fine)");
  let lastIdea = 0;

  const ideas = [
    ["有些星星，适合慢慢点亮。", "把今天喜欢的事留在这里。"],
    ["给平凡的一天，加一点想象。", "试着用一个颜色记录今天的心情。"],
    ["让一个小按钮，藏一份小惊喜。", "下一次点击，也许有点不一样。"],
    ["不是所有作品，都需要有终点。", "慢慢生长也是很好的故事。"],
    ["把喜欢的世界，画在地图之外。", "今天可以新添一个小小的地点。"],
    ["写下一句，还没想好结尾的话。", "灵感通常从不完整开始。"],
    ["在一个普通的角落，养一朵月亮。", "给作品留一点温柔的光。"],
    ["让每个小角色，都有自己的日常。", "从一顿晚饭或一张便签开始。"],
    ["认真做好一件很小很小的事。", "精致也许就藏在这些细节里。"]
  ];

  function readTheme() {
    try { return window.localStorage.getItem("jiujiu-illustrated-theme"); }
    catch (_) { return null; }
  }
  function saveTheme(value) {
    try { window.localStorage.setItem("jiujiu-illustrated-theme", value); }
    catch (_) { /* private browsing, storage disabled */ }
  }
  function applyTheme(next) {
    const theme = next === "dark" ? "dark" : "light";
    body.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
    themeButton.setAttribute("aria-label", theme === "dark" ? "切换到白天模式" : "切换到夜间模式");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#231f2c" : "#f8f1ec");
    saveTheme(theme);
  }
  applyTheme(readTheme() || "light");
  themeButton.addEventListener("click", () => applyTheme(body.dataset.theme === "light" ? "dark" : "light"));

  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "展开菜单");
  }
  function openMenu() {
    mobileNav.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "收起菜单");
  }
  menuButton.addEventListener("click", () => mobileNav.hidden ? openMenu() : closeMenu());
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && !mobileNav.hidden) closeMenu();
  }, {passive:true});

  let scrollTick = false;
  function updateScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.max(0, Math.min(100, window.scrollY / scrollable * 100)) : 0;
    progressBar.style.width = percent.toFixed(2) + "%";
    scrollTick = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(updateScroll);
    }
  }, {passive:true});
  updateScroll();

  const revealNodes = document.querySelectorAll(".project-feature,.section-heading,.play-card,.journal-left,.note-art");
  if ("IntersectionObserver" in window && !reducesMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.07,rootMargin:"0px 0px 50px 0px"});
    revealNodes.forEach(node => {
      node.setAttribute("data-reveal", "");
      observer.observe(node);
    });
  }

  if (hero && hasFinePointer.matches && !reducesMotion.matches) {
    let moving = false;
    let mx = 0, my = 0;
    hero.addEventListener("pointermove", event => {
      if (event.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      mx = ((event.clientX - r.left) / r.width - .5) * 12;
      my = ((event.clientY - r.top) / r.height - .5) * 9;
      if (!moving) {
        moving = true;
        requestAnimationFrame(() => {
          hero.style.setProperty("--mx", mx.toFixed(2) + "px");
          hero.style.setProperty("--my", my.toFixed(2) + "px");
          moving = false;
        });
      }
    }, {passive:true});
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--mx", "0px");
      hero.style.setProperty("--my", "0px");
    });
  }

  ideaButton.addEventListener("click", () => {
    const next = (lastIdea + 1 + Math.floor(Math.random() * (ideas.length - 1))) % ideas.length;
    lastIdea = next;
    quote.style.opacity = "0";
    window.setTimeout(() => {
      quote.textContent = ideas[next][0];
      hint.textContent = ideas[next][1];
      noteNumber.textContent = String(next + 1).padStart(2,"0");
      quote.style.opacity = "1";
    }, reducesMotion.matches ? 0 : 120);
  });
})();
