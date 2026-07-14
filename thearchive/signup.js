// The ARCHIVE — sign-up page
//
// Loaded after script.js (site chrome). Handles the payment-method
// radio group (swapping the Card / PayNow panels), rendering the
// Stripe buy button, and the UEN copy-to-clipboard button.

// ---- Stripe configuration ------------------------------------------
// Copy these two values from the <stripe-buy-button> tag in the live
// checkout page source (view-source on /thearchive/ticketing). Until
// they're set, the card panel shows a button that links there instead,
// so checkout keeps working either way.
var SU_STRIPE_BUY_BUTTON_ID = "buy_btn_1Tkejq1p2jiVX9CqENzmZJJZ";
var SU_STRIPE_PUBLISHABLE_KEY = "pk_live_51S0yj91p2jiVX9CqxbSv57lfwZkOAs6sbtk7xo3FjHwTmDCyStlQ0T3OVThc3BtCpPfAYcSOksD5qJo2ayWhUuWf006ZGKjJ6J";
var SU_STRIPE_FALLBACK_URL = "https://www.impactcolliders.com/thearchive/ticketing";

(function () {
  var wrap = document.querySelector("[data-su-stripe]");
  if (!wrap) return;

  var configured =
    SU_STRIPE_BUY_BUTTON_ID.indexOf("buy_btn_") === 0 &&
    SU_STRIPE_PUBLISHABLE_KEY.indexOf("pk_") === 0;

  if (!configured) {
    var link = document.createElement("a");
    link.className = "su-stripe-fallback";
    link.href = SU_STRIPE_FALLBACK_URL;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Pay by Card — Secure Stripe Checkout →";
    wrap.appendChild(link);
    return;
  }

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://js.stripe.com/v3/buy-button.js";
  document.head.appendChild(script);

  var button = document.createElement("stripe-buy-button");
  button.setAttribute("buy-button-id", SU_STRIPE_BUY_BUTTON_ID);
  button.setAttribute("publishable-key", SU_STRIPE_PUBLISHABLE_KEY);
  wrap.appendChild(button);
})();

// ---- Payment method panels ----------------------------------------
(function () {
  var inputs = document.querySelectorAll(".su-method-input");
  var panels = document.querySelectorAll("[data-su-panel]");
  if (!inputs.length || !panels.length) return;

  function showPanel(value) {
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-su-panel") !== value;
    });
  }

  inputs.forEach(function (input) {
    input.addEventListener("change", function () {
      if (input.checked && !input.disabled) showPanel(input.value);
    });
  });

  // reflect whatever the browser restored (back/forward cache keeps
  // radio state) rather than assuming the markup default
  var checked = document.querySelector(".su-method-input:checked");
  showPanel(checked ? checked.value : "card");
})();

// ---- Copy UEN ------------------------------------------------------
(function () {
  var buttons = document.querySelectorAll("[data-su-copy]");
  if (!buttons.length) return;

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  buttons.forEach(function (button) {
    var label = button.querySelector("[data-su-copy-label]");
    var original = label ? label.textContent : "";
    var resetTimer = null;

    function feedback(ok) {
      if (!label) return;
      button.classList.toggle("su-copied", ok);
      label.textContent = ok ? "Copied!" : "Copy failed";
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        button.classList.remove("su-copied");
        label.textContent = original;
      }, 1600);
    }

    button.addEventListener("click", function () {
      var text = button.getAttribute("data-su-copy");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { feedback(true); },
          function () { feedback(legacyCopy(text)); }
        );
      } else {
        feedback(legacyCopy(text));
      }
    });
  });
})();
