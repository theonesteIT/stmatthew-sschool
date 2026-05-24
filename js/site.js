/* Static site interactions */
(function () {
  const nav = document.querySelector("nav");
  const isHome = /index\.html$/.test(location.pathname) || /\/$/.test(location.pathname);

  function setNavSolid() {
    if (!nav) return;
    const solid = !isHome || window.scrollY > 80;
    nav.dataset.solid = solid ? "1" : "0";
    if (solid) {
      nav.classList.add("bg-[#0A2A66]", "shadow-2xl", "shadow-[#0A2A66]/40", "py-2");
      nav.classList.remove("bg-gradient-to-b", "from-black/50", "to-transparent", "py-5");
    } else {
      nav.classList.remove("bg-[#0A2A66]", "shadow-2xl", "shadow-[#0A2A66]/40", "py-2");
      nav.classList.add("bg-gradient-to-b", "from-black/50", "to-transparent", "py-5");
    }
  }
  setNavSolid();
  window.addEventListener("scroll", setNavSolid, { passive: true });

  const menuBtn = nav && nav.querySelector('[aria-label="Open menu"], [aria-label="Close menu"]');
  const mobilePanel = document.getElementById("mobile-nav-panel");
  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", () => {
      const open = mobilePanel.classList.toggle("hidden") === false;
      document.body.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    if (!mobilePanel.classList.contains("hidden")) mobilePanel.classList.add("hidden");
  }

  document.querySelectorAll("[data-apply-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("apply-modal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const applyModal = document.getElementById("apply-modal");
  if (applyModal) {
    const backdrop = applyModal.querySelector("[aria-hidden=\"true\"]");
    const closeBtn = applyModal.querySelector('[aria-label="Close application form"]');
    const close = () => {
      applyModal.classList.add("hidden");
      applyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    if (backdrop) backdrop.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !applyModal.classList.contains("hidden")) close();
    });
  }

  const hero = document.getElementById("home");
  if (hero) {
    const slides = hero.querySelectorAll("[data-hero-slide]");
    const headline = hero.querySelector("[data-hero-headline]");
    const sub = hero.querySelector("[data-hero-sub]");
    const dots = hero.querySelectorAll("[data-hero-dot]");
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;

    const show = (i) => {
      if (!slides.length) return;
      current = (i + slides.length) % slides.length;
      slides.forEach((s, j) => { s.style.opacity = j === current ? "1" : "0"; });
      const active = slides[current];
      if (headline && active) headline.textContent = active.getAttribute("data-headline") || "";
      if (sub && active) sub.textContent = active.getAttribute("data-sub") || "";
      dots.forEach((d, j) => {
        d.className = j === current
          ? "rounded-full transition-all w-8 h-2 bg-[#D62828]"
          : "rounded-full transition-all w-2 h-2 bg-white/30 hover:bg-white/60";
      });
    };

    if (slides.length > 0) show(0);
    dots.forEach((d) => {
      const idx = Number(d.getAttribute("data-hero-dot"));
      d.addEventListener("click", () => show(idx));
    });
    if (prev) prev.addEventListener("click", () => show(current - 1));
    if (next) next.addEventListener("click", () => show(current + 1));
    if (slides.length > 1) setInterval(() => show(current + 1), 6000);
  }

  const mottoSection = document.getElementById("about");
  const mottoBg = document.getElementById("motto-parallax-bg");
  if (mottoSection && mottoBg) {
    const onMottoScroll = () => {
      const rect = mottoSection.getBoundingClientRect();
      mottoBg.style.transform = "translateY(" + (-rect.top * 0.3) + "px)";
    };
    onMottoScroll();
    window.addEventListener("scroll", onMottoScroll, { passive: true });
  }

  const lightbox = document.getElementById("gallery-lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("[data-lightbox-img]");
    const lbTitle = lightbox.querySelector("[data-lightbox-title]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");
    const close = () => {
      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const open = (src, label) => {
      if (lbImg) lbImg.src = src;
      if (lbImg) lbImg.alt = label;
      if (lbTitle) lbTitle.textContent = label;
      lightbox.classList.remove("hidden");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    document.querySelectorAll("[data-gallery-item]").forEach((item) => {
      const handler = () => {
        open(item.getAttribute("data-gallery-src"), item.getAttribute("data-gallery-label"));
      };
      item.addEventListener("click", handler);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) close();
    });
  }

  document.querySelectorAll("[data-faq]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      if (panel) panel.classList.toggle("hidden");
    });
  });

  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      document.querySelectorAll("[data-tab]").forEach((b) => b.classList.remove("border-[#D62828]", "text-[#0A2A66]"));
      btn.classList.add("border-[#D62828]", "text-[#0A2A66]");
      document.querySelectorAll("[data-tab-panel]").forEach((p) => {
        p.classList.toggle("hidden", p.getAttribute("data-tab-panel") !== tab);
      });
    });
  });

  const aboutPanels = document.querySelectorAll("[data-about-tab-panel]");
  if (aboutPanels.length) {
    const tabBtns = document.querySelectorAll("[data-about-tab]");
    const stickyTabs = document.querySelector(".sticky.top-16");

    function showAboutTab(id) {
      aboutPanels.forEach((p) => {
        p.classList.toggle("hidden", p.getAttribute("data-about-tab-panel") !== id);
      });
      tabBtns.forEach((btn) => {
        const on = btn.getAttribute("data-about-tab") === id;
        btn.classList.toggle("text-[#0A2A66]", on);
        btn.classList.toggle("border-[#D62828]", on);
        btn.classList.toggle("text-gray-400", !on);
        btn.classList.toggle("border-transparent", !on);
        btn.classList.toggle("hover:text-gray-700", !on);
        btn.classList.toggle("hover:border-gray-200", !on);
      });
      if (stickyTabs) stickyTabs.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showAboutTab(btn.getAttribute("data-about-tab"));
      });
    });

    function setTimelineOpen(card, open) {
      const row = card.closest(".flex.items-start");
      const desc = row?.querySelector("[data-timeline-desc]");
      const hint = row?.querySelector("[data-timeline-hint]");
      card.classList.toggle("timeline-open", open);
      card.classList.toggle("shadow-xl", open);
      card.classList.toggle("-translate-y-0.5", open);
      card.style.border = open ? "2px solid #f59e0b" : "2px solid transparent";
      if (desc) {
        desc.classList.toggle("max-h-32", open);
        desc.classList.toggle("opacity-100", open);
        desc.classList.toggle("max-h-0", !open);
        desc.classList.toggle("opacity-0", !open);
      }
      if (hint) hint.classList.toggle("hidden", open);
    }

    document.querySelectorAll("[data-timeline-toggle]").forEach((el) => {
      const handler = (e) => {
        e.preventDefault();
        const row = el.closest(".flex.items-start");
        const card = row?.querySelector("[data-timeline-card]");
        if (!card) return;
        const willOpen = !card.classList.contains("timeline-open");
        document.querySelectorAll("[data-timeline-card].timeline-open").forEach((c) => setTimelineOpen(c, false));
        setTimelineOpen(card, willOpen);
      };
      el.addEventListener("click", handler);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") handler(e);
      });
    });

    function showBranch(i) {
      const idx = String(i);
      const colors = ["#0A2A66", "#047857", "#7c3aed", "#0e7490"];
      document.querySelectorAll("[data-branch-panel]").forEach((p) => {
        p.classList.toggle("hidden", p.getAttribute("data-branch-panel") !== idx);
      });
      document.querySelectorAll("[data-branch-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-branch-tab") === idx;
        const ci = Number(i);
        if (btn.classList.contains("branches-pill")) {
          btn.classList.toggle("is-active", on);
          btn.style.background = on ? colors[ci] : "";
          btn.style.color = on ? "#ffffff" : "";
        }
        if (btn.classList.contains("branches-grid-card")) {
          btn.classList.toggle("is-active", on);
        }
      });
    }

    document.querySelectorAll("[data-branch-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showBranch(btn.getAttribute("data-branch-tab")));
    });

    document.querySelectorAll(".opacity-0.translate-y-4, .opacity-0.translate-y-8, .opacity-0.translate-y-6").forEach((el) => {
      el.classList.remove("opacity-0", "translate-y-4", "translate-y-8", "translate-y-6");
      el.classList.add("opacity-100", "translate-y-0");
    });
  }
})();
