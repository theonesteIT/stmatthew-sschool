/* Static site interactions */
(async function () {
  async function loadIncludes() {
    /* Header/footer are loaded by js/includes.js script tags on each page */
    applyActiveNav(document.body.dataset.page || "");
  }

  function applyActiveNav(page) {
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const on = link.getAttribute("data-nav-link") === page;
      const bar = link.querySelector(".nav-main-link__bar");
      link.classList.remove("text-white", "text-white/70", "hover:text-white", "hover:bg-white/10");
      if (on) {
        link.classList.add("text-white");
        bar?.classList.remove("hidden");
      } else {
        link.classList.add("text-white/70", "hover:text-white", "hover:bg-white/10");
        bar?.classList.add("hidden");
      }
    });

    document.querySelectorAll("[data-nav-link-mobile]").forEach((link) => {
      const on = link.getAttribute("data-nav-link-mobile") === page;
      link.classList.remove("text-white", "bg-white/10", "text-white/80", "hover:text-white", "hover:bg-white/10");
      if (on) link.classList.add("text-white", "bg-white/10");
      else link.classList.add("text-white/80", "hover:text-white", "hover:bg-white/10");
    });

    const aboutGroup = document.querySelector("[data-mobile-about-group]");
    const aboutTrigger = aboutGroup?.querySelector(".mobile-nav-group__trigger");
    if (aboutGroup && aboutTrigger) {
      if (page === "about") {
        aboutGroup.classList.add("is-open");
        aboutTrigger.setAttribute("aria-expanded", "true");
        aboutTrigger.classList.add("text-white", "bg-white/10");
        aboutTrigger.classList.remove("text-white/80");
      } else {
        aboutGroup.classList.remove("is-open");
        aboutTrigger.setAttribute("aria-expanded", "false");
        aboutTrigger.classList.remove("text-white", "bg-white/10");
        aboutTrigger.classList.add("text-white/80");
      }
    }
  }

  await loadIncludes();

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

  document.querySelectorAll("[data-mobile-nav-group]").forEach((group) => {
    const trigger = group.querySelector(".mobile-nav-group__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const open = group.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const applyModal = document.getElementById("apply-modal");
  if (applyModal) {
    const form = applyModal.querySelector("[data-apply-form]");
    const stepLabel = applyModal.querySelector("[data-apply-step-label]");
    const statusEl = applyModal.querySelector("[data-apply-status]");
    const summaryEl = applyModal.querySelector("[data-apply-summary]");
    const backBtn = applyModal.querySelector("[data-apply-back]");
    const nextBtn = applyModal.querySelector("[data-apply-next]");
    const submitBtn = applyModal.querySelector("[data-apply-submit]");
    const backdrop = applyModal.querySelector("[data-apply-backdrop]");
    const closeBtn = applyModal.querySelector('[aria-label="Close application form"]');
    const panels = applyModal.querySelectorAll("[data-apply-panel]");
    const dots = applyModal.querySelectorAll("[data-apply-dot]");
    const bars = applyModal.querySelectorAll("[data-apply-bar]");
    let currentStep = 1;
    const totalSteps = 3;

    const stepFields = {
      1: ["studentName", "grade", "dob"],
      2: ["parentName", "parentPhone", "parentEmail", "campus"],
      3: ["consent"],
    };

    const setStatus = (message, ok) => {
      if (!statusEl) return;
      if (!message) {
        statusEl.classList.add("hidden");
        statusEl.textContent = "";
        return;
      }
      statusEl.textContent = message;
      statusEl.className =
        "text-sm font-semibold rounded-xl px-4 py-3 mt-4 " +
        (ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700");
      statusEl.classList.remove("hidden");
    };

    const getField = (name) => (form ? form.elements.namedItem(name) : null);

    const fieldValue = (name) => {
      const el = getField(name);
      if (!el) return "";
      if (el instanceof RadioNodeList) return String(el.value || "").trim();
      if (el.type === "checkbox") return el.checked ? "yes" : "";
      return String(el.value || "").trim();
    };

    const validateStep = (step) => {
      const names = stepFields[step] || [];
      for (const name of names) {
        const el = getField(name);
        if (!el) continue;
        if (el.type === "checkbox") {
          if (!el.checked) {
            setStatus("Please confirm the consent checkbox to continue.", false);
            el.focus();
            return false;
          }
          continue;
        }
        const value = String(el.value || "").trim();
        if (!value) {
          setStatus("Please fill in all required fields.", false);
          el.focus();
          return false;
        }
        if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setStatus("Please enter a valid email address.", false);
          el.focus();
          return false;
        }
      }
      setStatus("", false);
      return true;
    };

    const updateSummary = () => {
      if (!summaryEl) return;
      const rows = [
        ["Student", fieldValue("studentName")],
        ["Grade", fieldValue("grade")],
        ["Date of Birth", fieldValue("dob")],
        ["Parent / Guardian", fieldValue("parentName")],
        ["Phone", fieldValue("parentPhone")],
        ["Email", fieldValue("parentEmail")],
        ["Campus", fieldValue("campus")],
      ];
      summaryEl.innerHTML = rows
        .map(
          ([label, value]) =>
            '<div class="flex justify-between gap-3">' +
            '<dt class="text-gray-400 font-medium shrink-0">' +
            label +
            "</dt>" +
            '<dd class="text-[#0A2A66] font-semibold text-right">' +
            (value || "—") +
            "</dd></div>"
        )
        .join("");
    };

    const showStep = (step) => {
      currentStep = Math.max(1, Math.min(totalSteps, step));
      panels.forEach((panel) => {
        const n = Number(panel.getAttribute("data-apply-panel"));
        panel.classList.toggle("hidden", n !== currentStep);
      });
      dots.forEach((dot) => {
        const n = Number(dot.getAttribute("data-apply-dot"));
        const active = n === currentStep;
        const done = n < currentStep;
        dot.className =
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 " +
          (active
            ? "bg-[#D62828] text-white ring-2 ring-white/30"
            : done
              ? "bg-white text-[#0A2A66]"
              : "bg-white/15 text-white/40");
      });
      bars.forEach((bar) => {
        const n = Number(bar.getAttribute("data-apply-bar"));
        bar.className =
          "h-0.5 flex-1 rounded-full transition-all " +
          (n < currentStep ? "bg-white/70" : "bg-white/15");
      });
      if (stepLabel) {
        stepLabel.textContent = "Admissions 2026/27 · Step " + currentStep + " of " + totalSteps;
      }
      if (backBtn) backBtn.classList.toggle("hidden", currentStep === 1);
      if (nextBtn) nextBtn.classList.toggle("hidden", currentStep === totalSteps);
      if (submitBtn) {
        submitBtn.classList.toggle("hidden", currentStep !== totalSteps);
        if (currentStep === totalSteps) submitBtn.classList.add("flex");
        else submitBtn.classList.remove("flex");
      }
      if (currentStep === totalSteps) updateSummary();
    };

    const open = () => {
      if (form) form.reset();
      setStatus("", false);
      showStep(1);
      applyModal.classList.remove("hidden");
      applyModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      getField("studentName")?.focus();
    };

    const close = () => {
      applyModal.classList.add("hidden");
      applyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-apply-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        open();
      });
    });

    if (backdrop) backdrop.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !applyModal.classList.contains("hidden")) close();
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        setStatus("", false);
        showStep(currentStep - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (!validateStep(currentStep)) return;
        showStep(currentStep + 1);
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateStep(1)) {
          showStep(1);
          return;
        }
        if (!validateStep(2)) {
          showStep(2);
          return;
        }
        if (!validateStep(3)) {
          showStep(3);
          return;
        }
        const studentName = fieldValue("studentName");
        const grade = fieldValue("grade");
        const dob = fieldValue("dob");
        const parentName = fieldValue("parentName");
        const parentPhone = fieldValue("parentPhone");
        const parentEmail = fieldValue("parentEmail");
        const campus = fieldValue("campus");
        const mailSubject = encodeURIComponent(
          "[ST Matthew's] Online Application — " + studentName + " (" + grade + ")"
        );
        const body = encodeURIComponent(
          "ONLINE APPLICATION — Admissions 2026/27\n\n" +
            "STUDENT\n" +
            "Full Name: " + studentName + "\n" +
            "Grade Applying For: " + grade + "\n" +
            "Date of Birth: " + dob + "\n\n" +
            "PARENT / GUARDIAN\n" +
            "Name: " + parentName + "\n" +
            "Phone: " + parentPhone + "\n" +
            "Email: " + parentEmail + "\n" +
            "Preferred Campus: " + campus + "\n\n" +
            "Consent: Confirmed"
        );
        window.location.href =
          "mailto:collegestmatthews@gmail.com?subject=" + mailSubject + "&body=" + body;
        setStatus("Opening your email app — send the message to complete your application.", true);
      });
    }

    showStep(1);
  } else {
    document.querySelectorAll("[data-apply-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }

  const levelModal = document.getElementById("level-modal");
  if (levelModal) {
    const panels = levelModal.querySelectorAll("[data-level-panel]");
    const openLevel = (key) => {
      const id = String(key || "").toLowerCase();
      if (!["nursery", "primary", "secondary"].includes(id)) return;
      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.getAttribute("data-level-panel") !== id);
      });
      levelModal.classList.remove("hidden");
      levelModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeLevel = () => {
      levelModal.classList.add("hidden");
      levelModal.setAttribute("aria-hidden", "true");
      if (!document.getElementById("apply-modal") || document.getElementById("apply-modal").classList.contains("hidden")) {
        document.body.style.overflow = "";
      }
    };

    document.querySelectorAll("[data-level-open]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLevel(el.getAttribute("data-level-open"));
      });
    });

    levelModal.querySelectorAll("[data-level-close]").forEach((el) => {
      el.addEventListener("click", () => closeLevel());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !levelModal.classList.contains("hidden")) closeLevel();
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

  function initPageHero(hero) {
    const slides = hero.querySelectorAll("[data-hero-slide]");
    const captions = hero.querySelectorAll("[data-hero-caption]");
    const dots = hero.querySelectorAll("[data-hero-dot]");
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    const pauseBtn = hero.querySelector("[data-hero-pause]");
    const pauseLabel = hero.querySelector("[data-hero-pause-label]");
    const pauseIcon = pauseBtn?.querySelector("i");
    let current = 0;
    let timer = null;
    let paused = false;

    const show = (i) => {
      if (!slides.length) return;
      current = (i + slides.length) % slides.length;
      slides.forEach((s, j) => {
        const on = j === current;
        s.style.opacity = on ? "1" : "0";
        s.style.transform = on ? "scale(1)" : "scale(1.05)";
      });
      captions.forEach((c, j) => {
        c.classList.toggle("opacity-100", j === current);
        c.classList.toggle("translate-x-0", j === current);
        c.classList.toggle("opacity-0", j !== current);
        c.classList.toggle("translate-x-4", j !== current);
        c.classList.toggle("pointer-events-none", j !== current);
        c.classList.toggle("absolute", j !== current);
      });
      dots.forEach((d, j) => {
        d.className = j === current
          ? "transition-all rounded-full w-8 h-2.5 bg-amber-400"
          : "transition-all rounded-full w-2.5 h-2.5 bg-white/30 hover:bg-white/60";
      });
    };

    const startTimer = () => {
      if (timer) clearInterval(timer);
      if (slides.length <= 1 || paused) return;
      timer = setInterval(() => show(current + 1), 6000);
    };

    if (slides.length) show(0);
    dots.forEach((d) => {
      d.addEventListener("click", () => {
        show(Number(d.getAttribute("data-hero-dot")));
        startTimer();
      });
    });
    if (prev) prev.addEventListener("click", () => { show(current - 1); startTimer(); });
    if (next) next.addEventListener("click", () => { show(current + 1); startTimer(); });
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        paused = !paused;
        if (pauseIcon) pauseIcon.className = paused ? "fa-solid fa-play" : "fa-solid fa-pause";
        if (pauseLabel) pauseLabel.textContent = paused ? "Play" : "Pause";
        startTimer();
      });
    }
    startTimer();

    hero.querySelectorAll(".opacity-0.translate-y-8").forEach((el) => {
      el.classList.remove("opacity-0", "translate-y-8");
      el.classList.add("opacity-100", "translate-y-0");
    });
  }

  document.querySelectorAll("#gallery-hero, #events-hero, #contact-hero").forEach(initPageHero);

  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) {
    const cards = galleryGrid.querySelectorAll(".gallery-masonry-card");
    const searchInput = document.querySelector("[data-gallery-search]");
    const filterBtns = document.querySelectorAll("[data-gallery-filter]");
    const countEl = document.querySelector("[data-gallery-count]");
    let activeFilter = "all";

    const setFilterActive = (filter) => {
      filterBtns.forEach((btn) => {
        const on = btn.getAttribute("data-gallery-filter") === filter;
        btn.classList.toggle("bg-[#0A2A66]", on);
        btn.classList.toggle("text-white", on);
        btn.classList.toggle("border-[#0A2A66]", on);
        btn.classList.toggle("shadow-lg", on);
        btn.classList.toggle("shadow-blue-900/20", on);
        btn.classList.toggle("bg-white", !on);
        btn.classList.toggle("text-gray-500", !on);
        btn.classList.toggle("border-gray-200", !on);
      });
    };

    const applyGalleryFilter = () => {
      const q = (searchInput?.value || "").trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const cats = (card.getAttribute("data-gallery-category") || "").toLowerCase().split(/\s+/);
        const text = card.textContent.toLowerCase();
        const matchFilter = activeFilter === "all" || cats.includes(activeFilter);
        const matchSearch = !q || text.includes(q);
        const show = matchFilter && matchSearch;
        card.classList.toggle("is-filtered-out", !show);
        if (show) visible += 1;
      });
      if (countEl) countEl.textContent = visible + " photo" + (visible === 1 ? "" : "s");
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-gallery-filter") || "all";
        setFilterActive(activeFilter);
        applyGalleryFilter();
      });
    });
    if (searchInput) searchInput.addEventListener("input", applyGalleryFilter);
    applyGalleryFilter();
  }

  document.querySelectorAll(".gallery-masonry-card").forEach((card) => {
    const img = card.querySelector("img");
    const title = card.querySelector(".gallery-masonry-card__title");
    const desc = card.querySelector(".gallery-masonry-card__desc");
    if (!img || card.hasAttribute("data-gallery-item")) return;
    card.setAttribute("data-gallery-item", "true");
    card.setAttribute("data-gallery-src", img.getAttribute("src") || "");
    card.setAttribute("data-gallery-label", (title?.textContent || img.getAttribute("alt") || "").trim());
    card.setAttribute("data-gallery-desc", (desc?.textContent || "").trim());
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "View larger: " + (title?.textContent || "photo"));
  });

  document.querySelectorAll("[data-copy-text]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy-text") || "";
      try {
        await navigator.clipboard.writeText(text);
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = "fa-solid fa-check";
          setTimeout(() => { icon.className = "fa-solid fa-copy"; }, 1500);
        }
      } catch (_) {
        window.prompt("Copy:", text);
      }
    });
  });

  document.querySelectorAll("[data-scroll-to-form]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("contact-name")?.focus();
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const status = document.getElementById("contact-form-status");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const subject = String(fd.get("subject") || "").trim();
      const message = String(fd.get("message") || "").trim();
      if (!name || !email || !subject || !message) {
        if (status) {
          status.textContent = "Please fill in all required fields.";
          status.className = "text-sm font-semibold rounded-xl px-4 py-3 bg-red-50 text-red-700";
          status.classList.remove("hidden");
        }
        return;
      }
      const mailSubject = encodeURIComponent("[ST Matthew's] " + subject);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + (phone ? "\nPhone: " + phone : "") + "\n\n" + message
      );
      window.location.href = "mailto:collegestmatthews@gmail.com?subject=" + mailSubject + "&body=" + body;
      if (status) {
        status.textContent = "Opening your email app — send the message to reach us.";
        status.className = "text-sm font-semibold rounded-xl px-4 py-3 bg-green-50 text-green-800";
        status.classList.remove("hidden");
      }
    });
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
    const lbDesc = lightbox.querySelector("[data-lightbox-desc]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");
    const close = () => {
      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const open = (src, label, desc) => {
      if (lbImg) lbImg.src = src;
      if (lbImg) lbImg.alt = label;
      if (lbTitle) lbTitle.textContent = label;
      if (lbDesc) lbDesc.textContent = desc || "ST MATTHEW'S SCHOOLS";
      lightbox.classList.remove("hidden");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    document.querySelectorAll("[data-gallery-item]").forEach((item) => {
      const handler = () => {
        open(
          item.getAttribute("data-gallery-src"),
          item.getAttribute("data-gallery-label"),
          item.getAttribute("data-gallery-desc")
        );
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
    const aboutTabIds = ["background", "mission", "leadership", "branches"];

    function readAboutHash() {
      const id = location.hash.replace("#", "");
      return aboutTabIds.includes(id) ? id : null;
    }

    function showAboutTab(id, updateHash = true) {
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
      if (updateHash && aboutTabIds.includes(id) && location.hash !== "#" + id) {
        history.replaceState(null, "", "#" + id);
      }
      if (stickyTabs) stickyTabs.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showAboutTab(btn.getAttribute("data-about-tab"));
      });
    });

    const fromHash = readAboutHash();
    if (fromHash) showAboutTab(fromHash, false);

    window.addEventListener("hashchange", () => {
      const id = readAboutHash();
      if (id) showAboutTab(id, false);
    });

    function setTimelineOpen(card, open) {
      const row = card.closest(".flex.items-start");
      const desc = row?.querySelector("[data-timeline-desc]");
      const hintLabel = row?.querySelector("[data-timeline-hint-label]");
      const toggle = row?.querySelector("[data-timeline-toggle]");
      card.classList.toggle("timeline-open", open);
      card.setAttribute("aria-expanded", open ? "true" : "false");
      if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (desc) {
        if (open) {
          requestAnimationFrame(() => {
            desc.style.maxHeight = `${desc.scrollHeight}px`;
          });
        } else {
          desc.style.maxHeight = "0";
        }
      }
      if (hintLabel) hintLabel.textContent = open ? "Show less" : "Read more";
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
      const colors = ["#0A2A66", "#0A2A66", "#0A2A66", "#0A2A66"];
      document.querySelectorAll("[data-branch-panel]").forEach((p) => {
        p.classList.toggle("hidden", p.getAttribute("data-branch-panel") !== idx);
      });
      document.querySelectorAll("[data-branch-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-branch-tab") === idx;
        const ci = Number(i);
        if (btn.getAttribute("role") === "tab") {
          btn.setAttribute("aria-selected", on ? "true" : "false");
        }
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

  const policyNavLinks = document.querySelectorAll("[data-policy-nav]");
  const policySections = document.querySelectorAll("[data-policy-section]");
  if (policyNavLinks.length && policySections.length) {
    const setActivePolicy = (id) => {
      policyNavLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("data-policy-nav") === id);
      });
    };
    const onPolicyScroll = () => {
      let current = policySections[0]?.getAttribute("data-policy-section") || "";
      policySections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= 160) current = section.getAttribute("data-policy-section") || current;
      });
      if (current) setActivePolicy(current);
    };
    window.addEventListener("scroll", onPolicyScroll, { passive: true });
    onPolicyScroll();
  }
})();
