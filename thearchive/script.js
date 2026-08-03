// The ARCHIVE — homepage
//
// The original design has no interactive behavior wired up yet (the mobile
// menu icon in the header, for example, is currently decorative). This file
// is here so you have somewhere to add JavaScript as the site grows —
// e.g. toggling the mobile nav, wiring up the signup form, etc.

// "What to Expect" — a center line that draws itself in (and un-draws
// itself) as you scroll, plus a fade-in for each step.
(function () {
  var timelines = document.querySelectorAll("[data-wte-timeline]");
  if (!timelines.length) return;

  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // ---- Content pop-in (per step) — synced to the line's draw progress,
  // toggled in updateDraw() below rather than by a separate observer, so
  // "reached" and "not reached yet" both drive the same reversible state.
  document.documentElement.classList.add("wte-js");

  // ---- Center line: build the path, then draw/undraw on scroll -------
  var instances = [];

  // The single drawn path is rendered twice: an orange copy clipped to
  // everything ABOVE the archive band's top edge, and a white copy
  // clipped to everything BELOW it. Identical geometry + identical dash
  // pattern = a perfectly continuous line whose colour flips exactly on
  // the boundary. The same clip rectangles double as the scroll-draw
  // reveal (their heights grow with scroll progress).
  var dualUid = 0;
  function ensureDualPaths(svg, path) {
    if (svg.__dualParts) return svg.__dualParts;
    var NS = "http://www.w3.org/2000/svg";
    var uid = "wte-clip-" + (++dualUid);

    var defs = document.createElementNS(NS, "defs");
    function makeClip(id) {
      var cp = document.createElementNS(NS, "clipPath");
      cp.setAttribute("id", id);
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", "-200");
      rect.setAttribute("y", "0");
      rect.setAttribute("width", "0");
      rect.setAttribute("height", "0");
      cp.appendChild(rect);
      defs.appendChild(cp);
      return rect;
    }
    var orangeRect = makeClip(uid + "-o");
    var whiteRect = makeClip(uid + "-w");
    svg.insertBefore(defs, svg.firstChild);

    var white = path.cloneNode(false);
    white.classList.add("wte-line-path--white");
    white.removeAttribute("data-wte-line-path");
    svg.appendChild(white);

    path.setAttribute("clip-path", "url(#" + uid + "-o)");
    white.setAttribute("clip-path", "url(#" + uid + "-w)");

    svg.__dualParts = { white: white, orangeRect: orangeRect, whiteRect: whiteRect };
    return svg.__dualParts;
  }

  function buildPath(timeline) {
    var svg = timeline.querySelector("[data-wte-line]");
    var path = timeline.querySelector("[data-wte-line-path]");
    var dots = timeline.querySelectorAll("[data-wte-dot]");
    var tail = timeline.querySelector(".wte-tail");
    if (!svg || !path || !dots.length) return null;

    var timelineRect = timeline.getBoundingClientRect();
    var width = timelineRect.width;
    var height = timelineRect.height;
    if (!width || !height) return null;

    svg.setAttribute("viewBox", "0 0 " + width + " " + height);

    var bulge = Math.max(20, Math.min(50, width * 0.06));

    // The stroke has round caps, and half the stroke's width sticks out
    // past the path's endpoints. Starting the path at exactly y = 0 puts
    // that cap above the SVG's top edge, where the scroll-draw clip-path
    // (inset from the top at 0) slices it off — the "cropped" first dash.
    // Nudge both endpoints inward by half the stroke width instead.
    var strokeW = parseFloat(window.getComputedStyle(path).strokeWidth) || 6;
    var capPad = strokeW / 2 + 1;

    // Measure each dot's real rendered center — x included, not just y.
    // On desktop the row's `1fr auto 1fr` grid can't always keep the dot
    // column perfectly centered: the fixed-width media block wins the
    // space fight at many viewport widths, nudging the dot column
    // sideways (alternating left/right per row). Drawing the line
    // through an assumed width/2 center then misses those dots. Passing
    // the curve through the measured (x, y) of every dot keeps line and
    // dots connected no matter what the layout does.
    var points = [];
    var thresholds = [];
    dots.forEach(function (dot) {
      var r = dot.getBoundingClientRect();
      var x = r.left - timelineRect.left + r.width / 2;
      var y = r.top - timelineRect.top + r.height / 2;
      points.push({ x: x, y: y });
      thresholds.push({ step: dot.closest(".wte-step"), y: y });
    });

    var endY = height;
    if (tail) {
      var tr = tail.getBoundingClientRect();
      endY = tr.bottom - timelineRect.top;
    }

    // Where the orange Personal Archive band begins, in this SVG's
    // coordinates. The line continues past it — the stretch above stays
    // orange, the stretch below is painted white (see the dual clipped
    // paths below), so the colour flips exactly on the band's edge.
    var bandTopY = null;
    var extBelow = 55; // how far the white tail runs into the band
    var bands = document.querySelectorAll("[data-pa-section] .pa-band");
    for (var bi = 0; bi < bands.length; bi++) {
      if (bands[bi].getClientRects().length > 0) {
        var bandEl = bands[bi];
        bandTopY = bandEl.getBoundingClientRect().top - timelineRect.top;
        // Never run into the section's title (its top padding differs
        // between desktop and mobile) — stop a little above it.
        var title = bandEl.querySelector(".pa-title");
        if (title) {
          var titleTopY = title.getBoundingClientRect().top - timelineRect.top;
          extBelow = Math.max(18, Math.min(extBelow, titleTopY - bandTopY - 9));
        }
        break;
      }
    }

    var totalLen = (bandTopY !== null ? bandTopY : endY) + extBelow;

    // Start the line directly above the first dot so the top run drops
    // straight into it.
    var startX = points.length ? points[0].x : width / 2;
    var d = "M " + startX + " " + capPad;
    var prevX = startX;
    var prevY = capPad;
    points.forEach(function (p, i) {
      var sign = i % 2 === 0 ? -1 : 1; // alternate bulge direction = big waves
      var c1y = prevY + (p.y - prevY) * 0.33;
      var c2y = prevY + (p.y - prevY) * 0.66;
      d +=
        " C " +
        (prevX + sign * bulge) +
        " " +
        c1y +
        ", " +
        (p.x + sign * bulge) +
        " " +
        c2y +
        ", " +
        p.x +
        " " +
        p.y;
      prevX = p.x;
      prevY = p.y;
    });
    // Exit with one more wave — built with exactly the same bulge
    // construction as the dot-to-dot segments so the line keeps its
    // rhythm — landing on the horizontal center, past the band's edge.
    // It's ONE continuous path across the boundary: dash spacing and
    // curvature can't ever mismatch there, at any zoom or width.
    var exitX = width / 2;
    var exitSign = points.length % 2 === 0 ? -1 : 1; // continue alternating
    d +=
      " C " + (prevX + exitSign * bulge) + " " + (prevY + (totalLen - prevY) * 0.33) +
      ", " + (exitX + exitSign * bulge) + " " + (prevY + (totalLen - prevY) * 0.66) +
      ", " + exitX + " " + totalLen;

    path.setAttribute("d", d);

    var parts = ensureDualPaths(svg, path);
    parts.white.setAttribute("d", d);

    thresholds.forEach(function (t) {
      t.ratio = totalLen > 0 ? t.y / totalLen : 0;
    });

    return {
      timeline: timeline,
      svg: svg,
      height: height,
      thresholds: thresholds,
      totalLen: totalLen,
      bandTopY: bandTopY !== null ? bandTopY : endY,
      width: width,
      orangeRect: parts.orangeRect,
      whiteRect: parts.whiteRect
    };
  }

  function rebuildAll() {
    instances = [];
    timelines.forEach(function (timeline) {
      // Skip timelines that aren't laid out (e.g. the hidden mobile/desktop
      // copy behind a display:none breakpoint) — nothing to measure yet.
      if (timeline.getClientRects().length === 0) return;
      var inst = buildPath(timeline);
      if (inst) instances.push(inst);
    });
    updateDraw();
  }

  function updateDraw() {
    var vh = window.innerHeight;
    instances.forEach(function (inst) {
      var rect = inst.timeline.getBoundingClientRect();
      // Start revealing once the top of the timeline is 80% down the
      // viewport; finish once its bottom has scrolled up to 35% from the
      // top. Recomputed on every scroll tick, so scrolling back up
      // un-draws it just as smoothly.
      var startAt = vh * 0.8;
      var endAt = vh * 0.65;
      var span = rect.height + (startAt - endAt);
      var scrolled = startAt - rect.top;
      var progress = span > 0 ? scrolled / span : 0;
      progress = Math.max(0, Math.min(1, progress));

      // The reveal is driven by the two clip rectangles: the orange
      // rect grows from the top down to (at most) the band's edge, the
      // white rect takes over from the band's edge for the remainder.
      // Together they sweep one continuous "drawn so far" window down
      // the single shared path.
      inst.svg.style.clipPath = "none";
      var drawnLen = (reduceMotion ? 1 : progress) * inst.totalLen;
      var wideX = -200;
      var wideW = inst.width + 400;

      inst.orangeRect.setAttribute("x", wideX);
      inst.orangeRect.setAttribute("width", wideW);
      inst.orangeRect.setAttribute("y", 0);
      inst.orangeRect.setAttribute("height", Math.max(0, Math.min(drawnLen, inst.bandTopY)));

      inst.whiteRect.setAttribute("x", wideX);
      inst.whiteRect.setAttribute("width", wideW);
      inst.whiteRect.setAttribute("y", inst.bandTopY);
      inst.whiteRect.setAttribute("height", Math.max(0, drawnLen - inst.bandTopY));

      // Each step pops in exactly when the drawn line reaches its dot,
      // and pops back out on the way back up — same progress value
      // driving both the line and the content, so they can't drift out
      // of sync with each other.
      inst.thresholds.forEach(function (t) {
        if (!t.step) return;
        var reached = reduceMotion || progress >= t.ratio;
        t.step.classList.toggle("wte-line-reached", reached);
      });
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateDraw();
      ticking = false;
    });
  }

  var resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildAll, 150);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  // Crossing the large-monitor zoom breakpoint (see styles.css) changes
  // the page's effective scale, but doesn't fire a window "resize" event
  // on its own — the browser window itself hasn't changed size, only
  // what's rendered inside it has. Without this, the line's measurements
  // stay stale from before zoom kicked in.
  if (window.matchMedia) {
    var zoomBreakpoint = window.matchMedia("(min-width: 1920px)");
    var onZoomChange = function () {
      rebuildAll();
      setTimeout(rebuildAll, 60);
    };
    if (zoomBreakpoint.addEventListener) {
      zoomBreakpoint.addEventListener("change", onZoomChange);
    } else if (zoomBreakpoint.addListener) {
      zoomBreakpoint.addListener(onZoomChange);
    }

    // Same issue at the breakpoint where the WTE section itself scales
    // up (photos, dots, line) for large screens — that's also a
    // CSS-only change with no resize event to hook into.
    var wteScaleBreakpoint = window.matchMedia("(min-width: 1280px)");
    if (wteScaleBreakpoint.addEventListener) {
      wteScaleBreakpoint.addEventListener("change", onZoomChange);
    } else if (wteScaleBreakpoint.addListener) {
      wteScaleBreakpoint.addListener(onZoomChange);
    }
  }

  // The line's shape is measured from the actual rendered positions of the
  // dots, so anything that reflows the page after our first pass (a web
  // font swapping in late, an image finishing its load, the browser's own
  // zoom, orientation changes) can leave it pointing at stale coordinates
  // until something else happens to trigger a rebuild. A ResizeObserver on
  // each timeline catches that directly — whenever its rendered size
  // actually changes, for any reason, we just recompute.
  if ("ResizeObserver" in window) {
    var roTimer = null;
    var ro = new ResizeObserver(function () {
      clearTimeout(roTimer);
      roTimer = setTimeout(rebuildAll, 60);
    });
    timelines.forEach(function (timeline) {
      ro.observe(timeline);
    });
  }

  // Fonts loading late can shift layout/heights — rebuild once they're
  // ready so the dots and the path line up exactly. Belt-and-braces on
  // top of the ResizeObserver above, and a couple of extra passes shortly
  // after load to catch anything that settles just after paint.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(rebuildAll);
  }
  window.addEventListener("load", function () {
    rebuildAll();
    setTimeout(rebuildAll, 300);
  });

  rebuildAll();
})();

// "Find out more" — smooth-scroll to the About section.
(function () {
  var triggers = document.querySelectorAll("[data-scroll-to-about]");
  if (!triggers.length) return;

  function getVisibleAboutSection() {
    var sections = document.querySelectorAll("[data-about-section]");
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getClientRects().length > 0) return sections[i];
    }
    return null;
  }

  triggers.forEach(function (trigger) {
    trigger.style.cursor = "pointer";
    trigger.addEventListener("click", function () {
      var target = getVisibleAboutSection();
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

// Back to top button — appears after scrolling down a bit, scrolls
// smoothly back to the top of the page when clicked.
(function () {
  var btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;

  var ticking = false;
  function updateVisibility() {
    ticking = false;
    if (window.scrollY > window.innerHeight * 0.6) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateVisibility);
    },
    { passive: true }
  );

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateVisibility();
})();

// Header navigation — shared across every page of the site.
//
// Nav labels that have a real page navigate to it; on the homepage,
// "About" and the sign-up button smooth-scroll to their sections and a
// scroll spy keeps the selection honest. On other pages, clicking the
// current page's own link scrolls back to the top.
(function () {
  var navLinks = document.querySelectorAll("[data-nav-link]");
  var signupButtons = document.querySelectorAll("[data-nav-signup]");
  if (!navLinks.length && !signupButtons.length) return;

  var PAGE_FOR_LABEL = {
    "About": "index",
    "Sponsor": "sponsors",
    "Pay it Forward": "payitforward",
    "Newsroom": "newsroom"
  };
  // Normalize to an extensionless page name so links work with clean URLs
  // (/thearchive/sponsors) and legacy ones (/thearchive/sponsors.html).
  var currentPage =
    (window.location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
  function hrefFor(name) { return name === "index" ? "./" : name; }
  var onHome = currentPage === "index";

  // The page keeps separate mobile/desktop copies of each section, so
  // resolve to whichever copy is actually laid out right now.
  function visibleOne(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      if (els[i].getClientRects().length > 0) return els[i];
    }
    return null;
  }

  var targets = {
    about: function () { return visibleOne("[data-about-section]"); },
    signup: function () { return visibleOne(".sign-up"); }
  };

  function clearActive() {
    navLinks.forEach(function (l) { l.classList.remove("is-active"); });
    signupButtons.forEach(function (b) { b.classList.remove("is-active"); });
  }

  function setActive(key) {
    clearActive();
    if (key === "signup") {
      signupButtons.forEach(function (b) { b.classList.add("is-active"); });
    } else if (key) {
      navLinks.forEach(function (l) {
        if (l.getAttribute("data-nav-target") === key) l.classList.add("is-active");
      });
    }
  }

  // Exposed for the mobile menu below.
  window.__archiveNav = {
    go: function (label) {
      var page = PAGE_FOR_LABEL[label];
      if (page && page !== currentPage) {
        window.location.href = hrefFor(page);
        return true;
      }
      if (page === currentPage) {
        if (onHome && label === "About") {
          var el = targets.about();
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return true;
      }
      return false; // no page for this label yet
    },
    signup: function () {
      // registration lives on its own page now
      if (currentPage === "signup") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.location.href = "signup";
    }
  };

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      var label = link.getAttribute("data-label");
      if (window.__archiveNav.go(label)) return;
      if (!onHome) return; // label without a page, nothing to scroll to here
      clearActive();
      link.classList.add("is-active");
      var key = link.getAttribute("data-nav-target");
      var getTarget = key && targets[key];
      var el = getTarget && getTarget();
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  signupButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.__archiveNav.signup();
    });
  });

  // Homepage "Sign Up Now!" CTA banner goes to the registration page too.
  document.querySelectorAll(".button-2").forEach(function (button) {
    button.style.cursor = "pointer";
    button.addEventListener("click", function () {
      window.__archiveNav.signup();
    });
  });

  // Arriving at index.html#signup from another page: jump to the form.
  if (onHome && window.location.hash === "#signup") {
    window.addEventListener("load", function () {
      var el = targets.signup();
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setActive("signup");
      }
    });
  }

  // Scroll spy (homepage only — other pages mark their own link active
  // in the markup and have no About/sign-up sections to track).
  if (!onHome) return;

  var ticking = false;
  function updateSpy() {
    ticking = false;
    var probe = window.innerHeight * 0.4;
    var current = null;
    Object.keys(targets).forEach(function (key) {
      var el = targets[key]();
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) current = key;
    });
    if (current) setActive(current);
    else if (!document.querySelector("[data-nav-link].is-active")) clearActive();
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateSpy);
    },
    { passive: true }
  );

  updateSpy();
})();

// The Archive wordmark always returns to the About landing page. The mobile
// wordmark can be enhanced directly; the desktop artwork sits under the full
// navigation row, so give it a real link above the visible logo.
(function () {
  var logos = document.querySelectorAll(".the-archive-logo");

  function goHome() {
    window.location.href = "/thearchive/";
  }

  logos.forEach(function (logo) {
    logo.setAttribute("role", "link");
    logo.setAttribute("tabindex", "0");
    logo.setAttribute("aria-label", "Go to The Archive About page");
    logo.addEventListener("click", goHome);
    logo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goHome();
      }
    });
  });

  document
    .querySelectorAll(".header-nav-row.desktop-header-overlay")
    .forEach(function (header) {
      if (header.querySelector(".archive-desktop-logo-link")) return;

      var link = document.createElement("a");
      link.className = "archive-desktop-logo-link";
      link.href = "/thearchive/";
      link.setAttribute("aria-label", "Go to The Archive About page");
      header.appendChild(link);
    });
})();

// Mobile hamburger menu — the icon in the mobile header opens a
// slide-down panel with the site's pages. The panel is built here so
// every page gets it without duplicating markup in the HTML files.
(function () {
  var hamburger = document.querySelector(
    ".mobile-view-wrapper .navigation-tab .lucidemenu"
  );
  if (!hamburger) return;

  var currentPage =
    (window.location.pathname.split("/").pop() || "index").replace(/\.html$/, "");

  var ITEMS = [
    { label: "About", page: "index" },
    { label: "Sponsor", page: "sponsor" },
    { label: "Pay it Forward", page: "payitforward" },
    { label: "Newsroom", page: "newsroom" },
    { label: "Sign Up Here", signup: true }
  ];

  // Build the panel
  var overlay = document.createElement("div");
  overlay.className = "mobile-menu-overlay";

  var panel = document.createElement("nav");
  panel.className = "mobile-menu";
  panel.setAttribute("aria-label", "Site menu");

  ITEMS.forEach(function (item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mobile-menu-link";
    btn.textContent = item.label;
    if (item.page === currentPage) btn.classList.add("is-current");
    if (!item.page && !item.signup) {
      btn.classList.add("is-disabled");
      btn.setAttribute("aria-disabled", "true");
    }
    if (item.signup) btn.classList.add("is-signup");
    btn.addEventListener("click", function () {
      if (item.signup) {
        closeMenu();
        if (window.__archiveNav) window.__archiveNav.signup();
        return;
      }
      if (!item.page) return; // no page yet
      closeMenu();
      if (window.__archiveNav) window.__archiveNav.go(item.label);
      else window.location.href = item.page;
    });
    panel.appendChild(btn);
  });

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  var open = false;
  function openMenu() {
    open = true;
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    open = false;
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("tabindex", "0");
  hamburger.setAttribute("aria-label", "Open menu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.style.cursor = "pointer";

  hamburger.addEventListener("click", function () {
    open ? closeMenu() : openMenu();
  });
  hamburger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open ? closeMenu() : openMenu();
    }
  });
  overlay.addEventListener("click", closeMenu);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) closeMenu();
  });
  // Leaving mobile layout closes the menu
  window.matchMedia("(min-width: 768px)").addEventListener("change", function (m) {
    if (m.matches) closeMenu();
  });
})();

// Your Personal Archive — stacked-card carousel + pop-out audio player.
//
// Three story cards sit clipped together under the paperclip; next/prev
// pulls the front card out from under the clip and tucks it at the back
// of the stack. Each card's red audio button pops out a player pill with
// a draggable seek slider, pause/play, and a time readout. Only one
// audio plays at a time across the whole page.
(function () {
  var sections = document.querySelectorAll("[data-pa-section]");
  if (!sections.length) return;

  function pauseOthers(current) {
    document.querySelectorAll("audio[data-pa-el]").forEach(function (a) {
      if (a !== current && !a.paused) a.pause();
    });
  }

  sections.forEach(function (section) {
    var cards = Array.prototype.slice.call(
      section.querySelectorAll("[data-pa-card]")
    );
    var dots = Array.prototype.slice.call(
      section.querySelectorAll("[data-pa-dot]")
    );
    if (!cards.length) return;

    // order[0] is the card currently at the front of the stack.
    var order = cards.map(function (_, i) { return i; });
    var animating = false;

    function applyPositions() {
      order.forEach(function (cardIdx, pos) {
        var c = cards[cardIdx];
        c.classList.remove("pa-pos-0", "pa-pos-1", "pa-pos-2");
        c.classList.add("pa-pos-" + Math.min(pos, 2));
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === order[0]);
      });
    }

    function stopAudioIn(card) {
      var a = card.querySelector("audio");
      if (a && !a.paused) a.pause();
    }

    // Shuffle = two beats: the front card springs UP out of the stack
    // (fast, ease-out), then drops back DOWN into its new slot with a
    // bouncy overshoot (cubic-bezier 0.34,1.56,0.64,1 on .pa-card).
    //
    // The reorder happens at the START of the lift — the .pa-lift class
    // pins the airborne card's pose and stacking with !important, so
    // the card underneath is already showing its content while the old
    // front is still in the air (no blank sheet during the animation).
    var LIFT_MS = 200;
    var SETTLE_MS = 340;

    // One lift-and-drop that lands `targetIdx` at the front — whether
    // that's the next card, the previous one, or a dot two steps away,
    // it's always a single shuffle.
    function shuffleTo(targetIdx) {
      if (animating || order[0] === targetIdx) return;
      animating = true;
      var front = cards[order[0]];
      stopAudioIn(front);
      front.classList.add("pa-lift"); // beat 1: up out of the stack
      // Reveal the target underneath immediately.
      while (order[0] !== targetIdx) order.push(order.shift());
      applyPositions();
      setTimeout(function () {
        // beat 2: spring down into whatever slot it now owns.
        front.classList.remove("pa-lift");
        setTimeout(function () { animating = false; }, SETTLE_MS);
      }, LIFT_MS);
    }

    function next() {
      shuffleTo(order[1]);
    }

    function prev() {
      if (animating) return;
      animating = true;
      stopAudioIn(cards[order[0]]);
      var incoming = cards[order[order.length - 1]];
      // Snap the back card straight to the lifted pose (no transition),
      // promote it to the front, then let it spring down into place.
      incoming.classList.add("pa-no-trans", "pa-lift");
      order.unshift(order.pop());
      applyPositions();
      void incoming.offsetWidth;
      incoming.classList.remove("pa-no-trans");
      incoming.classList.remove("pa-lift");
      setTimeout(function () { animating = false; }, SETTLE_MS + 60);
    }

    var prevBtn = section.querySelector("[data-pa-prev]");
    var nextBtn = section.querySelector("[data-pa-next]");
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        shuffleTo(i);
      });
    });

    // Touch swipe on the deck (mobile): swipe left = next, right = prev.
    // Ignored when the gesture starts on the seek slider or a button so
    // scrubbing the audio never accidentally flips the card.
    var deck = section.querySelector("[data-pa-deck]");
    if (deck) {
      var touchX = 0;
      var touchY = 0;
      var touching = false;
      deck.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches.length !== 1) return;
          if (e.target.closest("input, button, a")) return;
          touching = true;
          touchX = e.touches[0].clientX;
          touchY = e.touches[0].clientY;
        },
        { passive: true }
      );
      deck.addEventListener(
        "touchend",
        function (e) {
          if (!touching) return;
          touching = false;
          var t = e.changedTouches[0];
          var dx = t.clientX - touchX;
          var dy = t.clientY - touchY;
          // mostly-horizontal and far enough to be intentional
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            if (dx < 0) next();
            else prev();
          }
        },
        { passive: true }
      );
      deck.addEventListener(
        "touchcancel",
        function () { touching = false; },
        { passive: true }
      );
    }

    applyPositions();

    // ---- audio players (one per card) ----
    section.querySelectorAll("[data-pa-audio]").forEach(function (wrap) {
      var audio = wrap.querySelector("audio");
      var openBtn = wrap.querySelector("[data-pa-play]");
      var toggle = wrap.querySelector("[data-pa-toggle]");
      var seek = wrap.querySelector("[data-pa-seek]");
      var timeEl = wrap.querySelector("[data-pa-time]");
      if (!audio || !openBtn) return;

      var scrubbing = false;

      function fmt(s) {
        if (!isFinite(s) || s < 0) s = 0;
        var m = Math.floor(s / 60);
        var ss = Math.floor(s % 60);
        return m + ":" + (ss < 10 ? "0" : "") + ss;
      }

      function renderTime(current) {
        var t = typeof current === "number" ? current : audio.currentTime;
        timeEl.textContent = fmt(t) + " / " + fmt(audio.duration);
      }

      function playPause() {
        if (audio.paused) {
          pauseOthers(audio);
          audio.play();
        } else {
          audio.pause();
        }
      }

      // Big red button: first click pops the player out and starts
      // playback; afterwards it keeps working as play/pause.
      openBtn.addEventListener("click", function () {
        wrap.classList.add("is-open");
        playPause();
      });
      toggle.addEventListener("click", playPause);

      audio.addEventListener("play", function () {
        wrap.classList.add("is-playing");
      });
      audio.addEventListener("pause", function () {
        wrap.classList.remove("is-playing");
      });
      audio.addEventListener("ended", function () {
        wrap.classList.remove("is-playing");
        audio.currentTime = 0;
        seek.value = 0;
        renderTime(0);
      });

      audio.addEventListener("loadedmetadata", function () { renderTime(); });
      audio.addEventListener("timeupdate", function () {
        if (!scrubbing && audio.duration) {
          seek.value = Math.round((audio.currentTime / audio.duration) * 1000);
        }
        if (!scrubbing) renderTime();
      });

      // Dragging the slider previews the time; releasing seeks there.
      seek.addEventListener("input", function () {
        scrubbing = true;
        if (audio.duration) renderTime((seek.value / 1000) * audio.duration);
      });
      seek.addEventListener("change", function () {
        if (audio.duration) {
          audio.currentTime = (seek.value / 1000) * audio.duration;
        }
        scrubbing = false;
      });

      renderTime(0);
    });
  });

  // The white continuation of the What-to-Expect line is drawn by the
  // timeline itself now (dual clipped copies of one path — see
  // ensureDualPaths/buildPath/updateDraw above), so no separate
  // connector element or listeners are needed here.
})();

// ---- Footer newsletter signup -------------------------------------
// No mailing-list backend is wired up yet, so "Subscribe" opens a
// pre-filled mailto draft instead of silently doing nothing. Handles
// both the mobile and desktop footer instances (each has its own
// input/button pair).
(function () {
  var forms = document.querySelectorAll("[data-newsletter-submit]");
  if (!forms.length) return;

  forms.forEach(function (button) {
    var wrap = button.closest(".newsletter-form");
    var input = wrap ? wrap.querySelector("[data-newsletter-email]") : null;
    if (!input) return;

    button.addEventListener("click", function () {
      var email = input.value.trim();
      if (!email) {
        input.focus();
        return;
      }
      var subject = encodeURIComponent("Newsletter sign-up");
      var body = encodeURIComponent(
        "Please add " + email + " to the Impact Colliders mailing list."
      );
      window.location.href =
        "mailto:info@impactcolliders.com?subject=" + subject + "&body=" + body;
    });

    // Enter key in the field submits too, same as a normal form
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") button.click();
    });
  });
})();
