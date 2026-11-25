// The Archive — recap page
//
// Motion borrows from the homepage: the dashed path that draws itself as
// you scroll (with each step popping in once the line reaches it), the
// bouncy polaroid drop-in, the spinning shapes and the looping photo reel.
// Everything here is progressive: without JS, or with reduced motion on,
// the page is fully visible and static.
(function () {
  window.__rcReady = true;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // ---- One-shot reveals --------------------------------------------
  // Anything marked [data-reveal] gets .is-in the first time it scrolls
  // into view. CSS decides what "in" looks like per element.
  var revealEls = document.querySelectorAll("[data-reveal]");
  var counters = document.querySelectorAll("[data-count]");

  function reveal(el) {
    el.classList.add("is-in");
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(reveal);
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Count-up numbers --------------------------------------------
  function formatNumber(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var duration = 1600;
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 4);
      el.textContent = prefix + formatNumber(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!reduceMotion && "IntersectionObserver" in window && counters.length) {
    // Start from zero only once JS is sure it can animate them back up.
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + "0";
    });
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          countIO.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIO.observe(el); });
  }

  // ---- Dashed path: draw on scroll, pop each moment in -------------
  // Reversible, like the homepage: scrolling back up un-draws the line
  // and tucks the moments away again.
  var path = document.querySelector("[data-rc-path]");
  if (path && !reduceMotion) {
    var moments = path.querySelectorAll(".rc-moment");
    var ticking = false;

    function update() {
      ticking = false;
      var rect = path.getBoundingClientRect();
      var vh = window.innerHeight || root.clientHeight;
      var drawTo = vh * 0.62 - rect.top; // px of the path that is "drawn"
      var progress = Math.max(0, Math.min(1, drawTo / rect.height));
      path.style.setProperty("--draw", (progress * 100).toFixed(2) + "%");

      moments.forEach(function (m) {
        var dot = m.querySelector(".rc-moment-dot");
        var d = dot.getBoundingClientRect();
        var dotY = d.top + d.height / 2 - rect.top;
        m.classList.toggle("is-reached", dotY <= drawTo);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  } else if (path) {
    path.querySelectorAll(".rc-moment").forEach(function (m) {
      m.classList.add("is-reached");
    });
  }

  // ---- Highlight videos: load YouTube only when asked --------------
  // A thumbnail + play button stands in for each player, so the page
  // doesn't pull in two YouTube players (and their scripts) up front.
  document.querySelectorAll("[data-yt]").forEach(function (btn) {
    var id = btn.getAttribute("data-yt");
    var thumb = btn.querySelector("img");
    // maxresdefault isn't made for every video; YouTube then serves a
    // 120px grey placeholder rather than an error, so check the size.
    thumb.addEventListener("load", function () {
      if (thumb.naturalWidth <= 120 && thumb.src.indexOf("hqdefault") === -1) {
        thumb.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      }
    });
    thumb.addEventListener("error", function () {
      if (thumb.src.indexOf("hqdefault") === -1) {
        thumb.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      }
    });

    // Without JS the link simply opens the video on YouTube.
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("data-title") || "Video";
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });

  // ---- Photo viewer ------------------------------------------------
  // Tap any photo to open it large, then step through all of them with
  // the arrows, arrow keys or a swipe. Esc or a tap outside closes it.
  var viewer = document.querySelector(".rc-viewer");
  var photos = Array.prototype.slice.call(document.querySelectorAll(".rc-photo"));
  if (viewer && photos.length && typeof viewer.showModal === "function") {
    var img = viewer.querySelector(".rc-viewer-img");
    var count = viewer.querySelector(".rc-viewer-count");
    var caption = viewer.querySelector(".rc-viewer-caption");
    var index = 0;

    function show(i) {
      index = (i + photos.length) % photos.length;
      var btn = photos[index];
      var thumb = btn.querySelector("img");
      viewer.classList.remove("is-swapping");
      void viewer.offsetWidth; // restart the fade
      viewer.classList.add("is-swapping");
      img.src = btn.getAttribute("data-full");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = btn.getAttribute("data-caption") || "";
      count.textContent = index + 1 + " / " + photos.length;
      // warm the next one so stepping forward feels instant
      var next = photos[(index + 1) % photos.length];
      if (next) new Image().src = next.getAttribute("data-full");
    }

    photos.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        show(i);
        viewer.showModal();
      });
    });

    viewer.querySelector(".rc-viewer-close").addEventListener("click", function () { viewer.close(); });
    viewer.querySelector(".rc-viewer-prev").addEventListener("click", function () { show(index - 1); });
    viewer.querySelector(".rc-viewer-next").addEventListener("click", function () { show(index + 1); });
    viewer.addEventListener("click", function (e) {
      if (e.target === viewer) viewer.close();
    });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    });

    var touchX = null;
    viewer.addEventListener("touchstart", function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    viewer.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 40) return;
      show(dx < 0 ? index + 1 : index - 1);
    });
  }
})();
