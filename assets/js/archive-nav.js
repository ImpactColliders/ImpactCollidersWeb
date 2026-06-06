/* ============================================================
   The Archive — global nav mobile enhancement.

   Adds a hamburger toggle for the shared .archive-nav on small
   screens (<= 820px) so the link list collapses into a menu
   instead of wrapping awkwardly. Self-contained: injects its own
   styles and button, so each page only needs:

     <script src="/assets/js/archive-nav.js"></script>

   placed at the end of <head>. No markup or CSS changes per page.

   On desktop (> 820px) nothing changes — the toggle stays hidden
   and the links render inline as before. If JavaScript is
   disabled, the links remain visible (graceful fallback).
   ============================================================ */
(function () {
  "use strict";

  var BREAKPOINT = 820;

  // 1) Inject styles immediately (runs during <head> parse, before
  //    first paint, so the mobile link list is hidden up front and
  //    there is no flash of the old wrapped row).
  var css =
    ".archive-nav-toggle{display:none;}" +
    "@media (max-width:" + BREAKPOINT + "px){" +
      ".archive-nav-toggle{" +
        "display:inline-flex;flex-direction:column;justify-content:center;" +
        "gap:5px;order:3;width:44px;height:38px;padding:8px 9px;" +
        "background:transparent;border:0;cursor:pointer;" +
      "}" +
      ".archive-nav-toggle span{" +
        "display:block;width:100%;height:2px;border-radius:2px;background:#fff;" +
        "transition:transform .2s ease,opacity .2s ease;" +
      "}" +
      ".archive-nav-inner.nav-open .archive-nav-toggle span:nth-child(1){transform:translateY(7px) rotate(45deg);}" +
      ".archive-nav-inner.nav-open .archive-nav-toggle span:nth-child(2){opacity:0;}" +
      ".archive-nav-inner.nav-open .archive-nav-toggle span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}" +
      /* Collapse the link list by default on mobile; reveal when open. */
      ".archive-nav-links{" +
        "display:none;order:4;width:100%;flex-direction:column;align-items:center;gap:4px;margin:6px 0 2px;" +
      "}" +
      ".archive-nav-inner.nav-open .archive-nav-links{display:flex;}" +
      ".archive-nav-links li{width:100%;text-align:center;}" +
      ".archive-nav-links a{display:inline-block;padding:10px 0;font-size:1rem;}" +
    "}";
  var style = document.createElement("style");
  style.setAttribute("data-archive-nav", "");
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // 2) Build the button + wire up toggling once the nav exists.
  function init() {
    var inner = document.querySelector(".archive-nav-inner");
    if (!inner || inner.querySelector(".archive-nav-toggle")) return;
    var links = inner.querySelector(".archive-nav-links");
    if (!links) return;

    if (!links.id) links.id = "archive-nav-links";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "archive-nav-toggle";
    btn.setAttribute("aria-label", "Toggle navigation menu");
    btn.setAttribute("aria-controls", links.id);
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = "<span></span><span></span><span></span>";

    var register = inner.querySelector(".nav-register");
    inner.insertBefore(btn, register || null);

    function setOpen(open) {
      inner.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    btn.addEventListener("click", function () {
      setOpen(!inner.classList.contains("nav-open"));
    });

    // Close after following a link.
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    // Close when tapping outside the nav.
    document.addEventListener("click", function (e) {
      if (inner.classList.contains("nav-open") && !inner.contains(e.target)) {
        setOpen(false);
      }
    });

    // Reset state if the viewport grows back to desktop.
    window.addEventListener("resize", function () {
      if (window.innerWidth > BREAKPOINT) setOpen(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
