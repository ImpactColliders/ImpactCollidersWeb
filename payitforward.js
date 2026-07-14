// The ARCHIVE — Pay it Forward page
//
// Cross-page navigation and the mobile menu live in script.js.
// This file handles the page's own motion and buttons:
//   - scroll-reveal (.pf-reveal -> .is-in) with IntersectionObserver
//   - smooth scrolling for the hero's two path buttons
//   - "Register a senior" hands off to the homepage sign-up form

(function () {
  // ---- scroll reveal ----
  var revealables = document.querySelectorAll(".pf-reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target); // reveal once, stay revealed
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  }

  // ---- steps: line drawn top-to-bottom, dots drop in as it passes ----
  // The generic .pf-reveal observer above already adds .is-in to each
  // [data-pf-step-group] wrapper (it carries the pf-reveal class). This
  // block only measures the real dot positions — which shift with the
  // step text's wrapped height — and times each dot's drop-in to land
  // roughly when the drawn line reaches it.
  var stepGroups = document.querySelectorAll("[data-pf-step-group]");
  var LINE_DRAW_MS = 450; // keep in sync with .pf-steps-line's transition-duration

  // offsetTop/offsetLeft reflect an element's position in normal layout
  // flow and are NOT affected by CSS transforms — unlike
  // getBoundingClientRect(), which reports the painted position. That
  // matters here because dots sit under a `transform: translateY(-14px)`
  // hide-state until revealed, and this measurement often runs (on page
  // load) before the person has scrolled to reveal them. Walking the
  // offsetParent chain up to `ancestor` gives the dot's true resting
  // position regardless of whether it's been revealed yet.
  function offsetRelativeTo(el, ancestor) {
    var x = 0, y = 0, node = el;
    while (node && node !== ancestor) {
      x += node.offsetLeft || 0;
      y += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return { x: x, y: y };
  }

  function layoutStepGroup(group) {
    var line = group.querySelector("[data-pf-steps-line]");
    var dots = group.querySelectorAll(".pf-step-dot");
    if (!line || !dots.length) return;

    var centers = [];
    dots.forEach(function (dot) {
      var pos = offsetRelativeTo(dot, group);
      centers.push({
        x: pos.x + dot.offsetWidth / 2,
        y: pos.y + dot.offsetHeight / 2
      });
    });

    var first = centers[0];
    var last = centers[centers.length - 1];
    var span = Math.max(last.y - first.y, 0);

    line.style.left = first.x + "px";
    line.style.top = first.y + "px";
    line.style.height = span + "px";

    // stagger each dot's delay by how far along the line it sits, so a
    // dot near the bottom waits for the line to "reach" it rather than
    // dropping in at the same instant as the first one
    dots.forEach(function (dot, i) {
      var fraction = span > 0 ? (centers[i].y - first.y) / span : 0;
      var delay = Math.round(fraction * LINE_DRAW_MS);
      dot.style.transitionDelay = delay + "ms";
    });
  }

  function layoutAllStepGroups() {
    stepGroups.forEach(layoutStepGroup);
  }

  if (stepGroups.length) {
    layoutAllStepGroups();
    window.addEventListener("load", layoutAllStepGroups);
    window.addEventListener("resize", layoutAllStepGroups);
  }

  // ---- "Share event!" -> native share sheet, or copy the link ----
  var share = document.querySelector("[data-pf-share]");
  if (share) {
    var SHARE_URL = "https://www.impactcolliders.com/thearchive/";
    var shareLabel = share.textContent;
    var shareTimer = null;

    function shareFeedback(msg) {
      share.textContent = msg;
      clearTimeout(shareTimer);
      shareTimer = setTimeout(function () {
        share.textContent = shareLabel;
      }, 1800);
    }

    share.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({
          title: "The Archive",
          text: "Bring a senior you love to The Archive — art, stories, and a portrait to keep.",
          url: SHARE_URL
        }).catch(function () { /* user closed the sheet; nothing to do */ });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(
          function () { shareFeedback("Link copied!"); },
          function () { shareFeedback("Copy failed"); }
        );
      } else {
        window.prompt("Copy this link:", SHARE_URL);
      }
    });
  }

  // ---- "Register a senior" -> registration page ----
  var signup = document.querySelector("[data-pf-signup]");
  if (signup) {
    signup.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.__archiveNav) window.__archiveNav.signup();
      else window.location.href = "signup.html";
    });
  }
})();
