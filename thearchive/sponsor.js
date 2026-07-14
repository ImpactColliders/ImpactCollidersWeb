// The ARCHIVE — sponsor page
//
// Loaded after script.js (which now handles all cross-page navigation
// and the mobile menu). This file only wires the contact form: the
// message character counter, validation, and building the mailto:
// draft on submit — matching the card's promise: "we'll open a draft
// email ready to send".

(function () {
  var form = document.querySelector("[data-sponsor-form]");
  if (!form) return;

  var nameInput = form.querySelector("#sp-name");
  var emailInput = form.querySelector("#sp-email");
  var subjectInput = form.querySelector("#sp-subject");
  var messageInput = form.querySelector("#sp-message");
  var counter = form.querySelector("[data-char-counter]");
  var errorEl = form.querySelector("[data-form-error]");

  var MAX = 2000;

  // ---- Character counter ----------------------------------------
  function updateCounter() {
    if (messageInput.value.length > MAX) {
      messageInput.value = messageInput.value.slice(0, MAX);
    }
    counter.textContent = messageInput.value.length + "/" + MAX;
  }
  messageInput.addEventListener("input", updateCounter);
  updateCounter();

  // ---- Validation + mailto draft ---------------------------------
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add("sp-show");
  }

  function clearErrors() {
    errorEl.classList.remove("sp-show");
    nameInput.classList.remove("sp-invalid");
    emailInput.classList.remove("sp-invalid");
  }

  [nameInput, emailInput].forEach(function (el) {
    el.addEventListener("input", clearErrors);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var subject = subjectInput.value.trim() || "The Archive: Sponsor Enquiry";
    var message = messageInput.value.trim();

    var missing = [];
    if (!name) {
      nameInput.classList.add("sp-invalid");
      missing.push("your full name");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add("sp-invalid");
      missing.push("a valid email address");
    }
    if (missing.length) {
      showError("Please enter " + missing.join(" and ") + ".");
      return;
    }

    var bodyLines = [
      "Hi The Archive team,",
      "",
      message || "(Tell us about your intended donation, nomination, or sponsor-benefit questions here.)",
      "",
      "—",
      "Name: " + name,
      "Email: " + email
    ];

    var mailto =
      "mailto:info@impactcolliders.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\n"));

    window.location.href = mailto;
  });
})();

// ---- "Join as a Partner!" -> smoothly reveal the contact form ------
(function () {
  var joinButton = document.querySelector(".sp-join-btn");
  var card = document.getElementById("contact-form");
  if (!joinButton || !card) return;

  joinButton.addEventListener("click", function (e) {
    e.preventDefault();

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center"
    });

    // Keep the anchor URL useful without triggering the browser's jump.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#contact-form");
    }
  });
})();

// Arriving from the Pay-it-Forward donate button: bring the contact
// form into view (its subject line is already prefilled for a
// Pay-it-Forward donation).
(function () {
  if (window.location.hash !== "#contact-form") return;
  window.addEventListener("load", function () {
    var card = document.getElementById("contact-form");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

// ---- Partner logo marquee ----------------------------------------
// Auto-scrolls leftward forever; no hover pause. Grab it and it follows
// the pointer 1:1, fling it and it keeps that speed, then friction
// bleeds the extra velocity off until it settles back to cruise.
(function () {
  var marquee = document.querySelector("[data-marquee]");
  if (!marquee) return;
  var track = marquee.querySelector(".sp-marquee-track");
  var group = marquee.querySelector(".sp-marquee-group");
  if (!track || !group) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CRUISE = reduceMotion ? 0 : 34; // px/s baseline drift
  var FRICTION = 1.4;                 // how fast a fling decays back to cruise
  var MAX_FLING = 2800;               // px/s cap so a hard flick stays sane

  var offset = 0;          // current track translateX
  var velocity = -CRUISE;  // px/s, negative = leftward
  var loopWidth = 0;       // width of one logo group = one full loop

  function measure() {
    loopWidth = group.getBoundingClientRect().width;
  }
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure); // logos finishing load changes the width

  // keep offset in (-loopWidth, 0] so the duplicated group always covers
  // the viewport; works in both drag directions
  function wrap() {
    if (!loopWidth) return;
    offset = (((offset % loopWidth) + loopWidth) % loopWidth) - loopWidth;
  }

  // ---- dragging ----
  var dragging = false;
  var lastX = 0;
  var lastT = 0;
  var dragVelocity = 0;

  marquee.addEventListener("pointerdown", function (e) {
    dragging = true;
    marquee.classList.add("sp-dragging");
    marquee.setPointerCapture(e.pointerId);
    lastX = e.clientX;
    lastT = performance.now();
    dragVelocity = 0;
    velocity = 0; // catching it stops it, like grabbing a spinning wheel
  });

  marquee.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var now = performance.now();
    var dx = e.clientX - lastX;
    var dt = (now - lastT) / 1000;
    offset += dx;
    wrap();
    // smooth the sampled velocity so one jittery event doesn't decide the fling
    if (dt > 0) dragVelocity = dragVelocity * 0.6 + (dx / dt) * 0.4;
    lastX = e.clientX;
    lastT = now;
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove("sp-dragging");
    velocity = Math.max(-MAX_FLING, Math.min(MAX_FLING, dragVelocity));
    // a plain click (no fling) just resumes the drift
    if (Math.abs(velocity) < CRUISE) velocity = -CRUISE;
  }
  marquee.addEventListener("pointerup", release);
  marquee.addEventListener("pointercancel", release);

  // ---- animation loop ----
  var prev = performance.now();
  function frame(now) {
    var dt = Math.min((now - prev) / 1000, 0.05); // clamp tab-switch jumps
    prev = now;
    if (!dragging) {
      // ease the velocity back toward cruise — this is the "physics"
      velocity += (-CRUISE - velocity) * Math.min(1, FRICTION * dt);
      offset += velocity * dt;
      wrap();
    }
    track.style.transform = "translateX(" + offset + "px)";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
