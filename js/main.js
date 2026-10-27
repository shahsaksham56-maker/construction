/**
 * SHRI RADHA RANI CONSTRUCTION — INTERACTIVE SCRIPTS & CONTROLS
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Site Loader
  initLoader();

  // 2. Custom Cursor
  initCursor();

  // 3. Navigation Header & Scroll Progress
  initNavigation();

  // 4. Mobile Menu Drawer
  initMobileMenu();

  // 5. Disciplines Accordion
  initDisciplines();

  // 6. Interactive 3D Wall Anatomy
  initWallAnatomy();

  // 7. Portfolio Work Filtering
  initPortfolioFilters();

  // 8. 3D Room Panorama Viewer ("Drag the room")
  initRoomViewer();

  // 9. Rotating Process Dial
  initProcessDial();

  // 10. Stat Number Counters
  initNumberCounters();

  // 11. Consultation Modal
  initModal();
});

/* ==========================================================================
   1. Site Loader
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById("site-loader");
  if (!loader) return;

  const progressFill = loader.querySelector(".loader-progress-fill");
  const progressText = loader.querySelector(".loader-progress-text");

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress > 100) progress = 100;

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("loader-hidden");
      }, 350);
    }
  }, 45);
}

/* ==========================================================================
   2. Custom Cursor
   ========================================================================== */
function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Add hover effects for interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .discipline-header, .filter-chip, .layer-tab-btn, .anatomy-layer, .process-step-item, .material-card"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

/* ==========================================================================
   3. Navigation Header & Scroll Progress
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector(".site-header");
  const progressLine = document.querySelector(".scroll-progress-line");
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Update progress line
    if (progressLine && maxScroll > 0) {
      const pct = (currentScrollY / maxScroll) * 100;
      progressLine.style.width = `${pct}%`;
    }

    // Toggle header scrolled style
    if (currentScrollY > 60) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }

    // Auto-hide on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;
  });
}

/* ==========================================================================
   4. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("drawer-open");
    if (isOpen) {
      drawer.classList.remove("drawer-open");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      drawer.classList.add("drawer-open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      drawer.classList.remove("drawer-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   5. Disciplines Accordion
   ========================================================================== */
function initDisciplines() {
  const items = document.querySelectorAll(".discipline-item");
  items.forEach((item) => {
    const header = item.querySelector(".discipline-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close other disciplines if accordion single-open is desired
      items.forEach((other) => other.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* ==========================================================================
   6. Interactive 3D Wall Anatomy
   ========================================================================== */
function initWallAnatomy() {
  const tabs = document.querySelectorAll(".layer-tab-btn");
  const layers = document.querySelectorAll(".anatomy-layer");
  const titleEl = document.getElementById("anatomy-title");
  const descEl = document.getElementById("anatomy-desc");
  const specU = document.getElementById("spec-u-value");
  const specR = document.getElementById("spec-r-value");
  const specCost = document.getElementById("spec-cost");
  const specLife = document.getElementById("spec-lifespan");

  const anatomyData = {
    roof: {
      title: "Extruded Roof Buildup & Zinc Membrane",
      desc: "Warm-roof construction with dual cross-laminated timber decks, 180mm continuous polyisocyanurate insulation, and standing-seam patinated titanium zinc. Eliminates all thermal bridges over structural bays.",
      uValue: "0.11 W/m²K",
      rValue: "R-9.1",
      cost: "€140 / m²",
      lifespan: "65+ Years",
      highlightClass: "layer-roof",
    },
    slab: {
      title: "Post-Tensioned Concrete Slab & Thermal Mass",
      desc: "Engineered post-tensioned voided concrete slab that doubles as passive diurnal thermal store. Night-flush ventilation draws sea breeze through soffits, cutting summer chiller loads by 41%.",
      uValue: "0.22 W/m²K",
      rValue: "R-4.5",
      cost: "€210 / m²",
      lifespan: "100+ Years",
      highlightClass: "layer-slab",
    },
    wall: {
      title: "Board-Formed Structural Envelope & Limestone Cavity",
      desc: "Self-consolidating architectural concrete cast against rough-sawn Nordic pine formwork. Sandwiched 120mm aerogel cavity with honed 40mm Alicante limestone rainscreen, detailed with zero exposed sealants.",
      uValue: "0.14 W/m²K",
      rValue: "R-7.2",
      cost: "€320 / m²",
      lifespan: "80+ Years",
      highlightClass: "layer-wall",
    },
    foundation: {
      title: "Geotechnical Rock Anchors & Ground Plinth",
      desc: "Deep grouted micropiles drilled directly into coastal granite bedrock. High-sulfate-resistant concrete with crystalline waterproofing additives, immune to saltwater hydrostatic pressure.",
      uValue: "0.18 W/m²K",
      rValue: "R-5.6",
      cost: "€180 / m²",
      lifespan: "120+ Years",
      highlightClass: "layer-found",
    },
  };

  function selectLayer(layerKey) {
    const data = anatomyData[layerKey];
    if (!data) return;

    // Update tabs
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.layer === layerKey);
    });

    // Update 3D layers
    layers.forEach((layer) => {
      const isTarget = layer.classList.contains(data.highlightClass);
      layer.classList.toggle("active", isTarget);
    });

    // Update text
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (specU) specU.textContent = data.uValue;
    if (specR) specR.textContent = data.rValue;
    if (specCost) specCost.textContent = data.cost;
    if (specLife) specLife.textContent = data.lifespan;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectLayer(tab.dataset.layer);
    });
  });

  layers.forEach((layer) => {
    layer.addEventListener("click", () => {
      if (layer.classList.contains("layer-roof")) selectLayer("roof");
      if (layer.classList.contains("layer-slab")) selectLayer("slab");
      if (layer.classList.contains("layer-wall")) selectLayer("wall");
      if (layer.classList.contains("layer-found")) selectLayer("foundation");
    });
  });
}

/* ==========================================================================
   7. Portfolio Work Filtering
   ========================================================================== */
function initPortfolioFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".project-card");
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.dataset.filter;

      cards.forEach((card) => {
        const cardCategory = card.dataset.category || "";
        if (category === "all" || cardCategory.includes(category)) {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.96)";
          setTimeout(() => {
            if (card.style.opacity === "0") {
              card.style.display = "none";
            }
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   8. 3D Room Panorama Viewer ("Drag the room")
   ========================================================================== */
function initRoomViewer() {
  const viewerWrap = document.querySelector(".room-canvas-wrap");
  const strip = document.querySelector(".room-panorama-strip");
  const prevBtn = document.getElementById("room-prev-btn");
  const nextBtn = document.getElementById("room-next-btn");
  if (!viewerWrap || !strip) return;

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function setSliderPosition() {
    const maxTranslate = 0;
    const minTranslate = -(strip.scrollWidth - viewerWrap.clientWidth);
    if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
    if (currentTranslate < minTranslate) currentTranslate = minTranslate;

    strip.style.transform = `translateX(${currentTranslate}px)`;
  }

  viewerWrap.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    strip.style.transition = "none";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    setSliderPosition();
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    prevTranslate = currentTranslate;
    strip.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  // Touch Support
  viewerWrap.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    strip.style.transition = "none";
  });

  viewerWrap.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    setSliderPosition();
  });

  viewerWrap.addEventListener("touchend", () => {
    isDragging = false;
    prevTranslate = currentTranslate;
    strip.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  // Next / Prev buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentTranslate += 400;
      strip.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      setSliderPosition();
      prevTranslate = currentTranslate;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentTranslate -= 400;
      strip.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      setSliderPosition();
      prevTranslate = currentTranslate;
    });
  }
}

/* ==========================================================================
   9. Rotating Process Dial
   ========================================================================== */
function initProcessDial() {
  const steps = document.querySelectorAll(".process-step-item");
  const dialArc = document.querySelector(".dial-active-arc");
  const stageNum = document.querySelector(".dial-stage-num");
  const stageDur = document.querySelector(".dial-stage-duration");
  if (!steps.length) return;

  const totalCircumference = 880;
  const offsets = [
    704, // Stage 1 (1/5)
    528, // Stage 2 (2/5)
    352, // Stage 3 (3/5)
    176, // Stage 4 (4/5)
    0,   // Stage 5 (5/5)
  ];

  const durations = [
    "2–6 Weeks",
    "3–6 Months",
    "4–6 Weeks",
    "12–24 Months",
    "24 Months",
  ];

  steps.forEach((step, idx) => {
    step.addEventListener("click", () => {
      steps.forEach((s) => s.classList.remove("active"));
      step.classList.add("active");

      if (dialArc) dialArc.style.strokeDashoffset = offsets[idx];
      if (stageNum) stageNum.textContent = `0${idx + 1}`;
      if (stageDur) stageDur.textContent = durations[idx];
    });
  });
}

/* ==========================================================================
   10. Stat Number Counters
   ========================================================================== */
function initNumberCounters() {
  const stats = document.querySelectorAll("[data-target-num]");
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.targetNum);
          const duration = 1500;
          const start = 0;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);

            el.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(updateCount);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

/* ==========================================================================
   11. Consultation Modal
   ========================================================================== */
function initModal() {
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const modal = document.getElementById("consultation-modal");
  if (!modal) return;

  const closeButton = modal.querySelector(".modal-close-btn");
  const form = modal.querySelector(".consultation-form");
  const successState = modal.querySelector(".modal-success-state");

  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("modal-active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("modal-active");
    document.body.style.overflow = "";
    if (form) form.reset();
    if (successState) successState.style.display = "none";
    if (form) form.style.display = "flex";
  }

  if (closeButton) closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.style.display = "none";
      if (successState) successState.style.display = "flex";
    });
  }
}
