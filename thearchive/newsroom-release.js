// The ARCHIVE — newsroom release template
//
// Every release shares this one page; the URL picks the article:
//   newsroom-release.html?slug=annual-report-launch
//
// PUBLISHING A NEW RELEASE = add one entry to NEWSROOM_ARTICLES below,
// drop its cover image in images/newsroom/, and add a card for it on
// newsroom.html. Nothing else to touch.
//
// Body paragraphs are plain strings; inline HTML (links, <strong>) is
// allowed since this registry is authored by us, not user input.

var NEWSROOM_ARTICLES = {
  "archive-x-bloom-fund": {
    kicker: "Media Release · 12 August 2026",
    title: "Youths Preserving Seniors’ Legacy Through Art and AI",
    cover: "images/newsroom/archive-x-bloom-fund.png",
    previewImage: "images/newsroom/archive-x-bloom-fund-og.jpg",
    coverAlt:
      "The Archive x The Bloom Fund media release — youths preserving seniors’ legacy through art and AI.",
    body: [
      "<strong>Singapore, 12 August 2026</strong> — Over two Sundays this September, 400 Singapore seniors will be seated across youth artists, sharing their life stories with an AI tool tuned for multiple languages, and leaving with hand-drawn portraits of themselves. A third event day has been planned for early 2027. The collaboration, captured as precious stories and portraits, live on as a publicly accessible digital archive for Singaporeans.",
      "For full media release, please see attached."
    ],
    cta: {
      label: "Read the full media release",
      url: "https://www.impactcolliders.com/thearchive/images/newsroom/media-release-archive-x-bloom-fund.pdf"
    }
  },

  "annual-report-launch": {
    kicker: "Media Release · 28 May 2026",
    title: "Launch of Our First Annual Report",
    cover: "images/newsroom/annual-report-launch.jpg",
    coverAlt:
      "Cover of the Impact Colliders first anniversary annual report — photos from events arranged in the shape of a number one, titled Anniversary Edition: Empowering seniors through play.",
    body: [
      "Impact Colliders marks its first anniversary with the launch of our first annual report — <em>Anniversary Edition: Empowering seniors through play</em>.",
      "The report looks back at our opening chapter: the community sessions and roadshows that brought <strong>Eh, How Ah?</strong> to seniors across Singapore, the partners and volunteers who made them happen, and the intergenerational moments in between — games played, stories swapped, and friendships formed across decades.",
      "It also looks forward: to The Archive, our community storytelling exhibition pairing seniors and youths through portraiture, conversation, and a digital archive of lived experiences — and to the year ahead of empowering seniors through play.",
      "Thank you to every senior, volunteer, and partner who shaped our first year. This report is yours as much as ours."
    ],
    cta: {
      label: "Read the Annual Report",
      url: "https://www.impactcolliders.com/assets/docs/Impact-Colliders-Annual-Report-FY25-26_compressed.pdf"
    }
  }

  // , "next-release-slug": { kicker, title, cover, previewImage, coverAlt, body: [...], cta: { label, url } }
  //
  // previewImage is optional (1200x630 link-preview image). Because most
  // social scrapers don't run JS, also update the static og:image /
  // twitter:image in newsroom-release.html when a new release goes out.
};

(function () {
  var main = document.querySelector(".nrr-main");
  var mobileHeader = document.querySelector(
    ".newsroom-page .mobile-view-wrapper .mobile-header"
  );

  // Keep the release masthead below the fixed mobile header. Its height can
  // change with viewport width, font loading, and browser safe-area handling,
  // so a hard-coded content offset is only a fallback.
  function syncHeaderOffset() {
    if (!main || !mobileHeader) return;

    var headerStyle = window.getComputedStyle(mobileHeader);
    if (headerStyle.display === "none") {
      main.style.removeProperty("--nrr-header-offset");
      return;
    }

    var headerBottom = Math.ceil(mobileHeader.getBoundingClientRect().bottom);
    main.style.setProperty("--nrr-header-offset", headerBottom + "px");
  }

  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset);
  window.addEventListener("orientationchange", syncHeaderOffset);
  window.addEventListener("load", syncHeaderOffset);

  if ("ResizeObserver" in window && mobileHeader) {
    new ResizeObserver(syncHeaderOffset).observe(mobileHeader);
  }

  var shell = document.querySelector("[data-nrr-article]");
  var missing = document.querySelector("[data-nrr-missing]");
  if (!shell || !missing) return;

  var slug = new URLSearchParams(window.location.search).get("slug");
  var article = slug ? NEWSROOM_ARTICLES[slug] : null;

  if (!article) {
    missing.hidden = false;
    document.title = "Release not found — The ARCHIVE";
    return;
  }

  document.title = article.title + " — The ARCHIVE";

  // ---- SEO / link-preview: refine meta tags and add NewsArticle data ----
  (function () {
    var BASE = "https://www.impactcolliders.com/thearchive/";
    var LOGO = "https://www.impactcolliders.com/assets/images/logo.jpg";
    var pageUrl = BASE + "newsroom-release?slug=" + encodeURIComponent(slug);
    // previewImage (1200x630) wins for link previews; falls back to the
    // article cover, then the Impact Colliders logo.
    var imageSrc = article.previewImage || article.cover;
    var imageUrl = imageSrc ? BASE + imageSrc : LOGO;

    // Plain-text description from the first body paragraph (~160 chars).
    var tmp = document.createElement("div");
    tmp.innerHTML = (article.body && article.body[0]) || "";
    var desc = (tmp.textContent || "").replace(/\s+/g, " ").trim();
    if (desc.length > 160) desc = desc.slice(0, 157).replace(/\s+\S*$/, "") + "…";

    function set(sel, attr, val) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    }
    set("[data-nrr-canonical]", "href", pageUrl);
    set("[data-nrr-og-title]", "content", article.title);
    set("[data-nrr-og-desc]", "content", desc);
    set("[data-nrr-og-url]", "content", pageUrl);
    set("[data-nrr-og-image]", "content", imageUrl);
    set("[data-nrr-tw-title]", "content", article.title);
    set("[data-nrr-tw-desc]", "content", desc);
    set("[data-nrr-tw-image]", "content", imageUrl);

    // datePublished parsed from the kicker (e.g. "Media Release · 28 May 2026").
    var datePublished = null;
    if (article.kicker && article.kicker.indexOf("·") !== -1) {
      var raw = article.kicker.split("·").pop().trim();
      var d = new Date(raw);
      if (!isNaN(d.getTime())) datePublished = d.toISOString().slice(0, 10);
    }

    var jsonld = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: desc,
      image: [imageUrl],
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      author: { "@type": "Organization", name: "Impact Colliders" },
      publisher: {
        "@type": "Organization",
        name: "Impact Colliders",
        logo: { "@type": "ImageObject", url: LOGO }
      }
    };
    if (datePublished) jsonld.datePublished = datePublished;

    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(jsonld);
    document.head.appendChild(s);
  })();

  document.querySelector("[data-nrr-kicker]").textContent = article.kicker;
  document.querySelector("[data-nrr-title]").textContent = article.title;

  var cover = document.querySelector("[data-nrr-cover]");
  if (article.cover) {
    cover.src = article.cover;
    cover.alt = article.coverAlt || "";
  } else {
    cover.closest(".nrr-cover").hidden = true;
  }

  var body = document.querySelector("[data-nrr-body]");
  article.body.forEach(function (paragraph) {
    var p = document.createElement("p");
    p.innerHTML = paragraph;
    body.appendChild(p);
  });

  // the hyperlink button — hidden until the article defines a real URL
  var ctaRow = document.querySelector("[data-nrr-cta-row]");
  var cta = article.cta;
  if (cta && cta.url && cta.url.indexOf("http") === 0) {
    document.querySelector("[data-nrr-cta]").href = cta.url;
    document.querySelector("[data-nrr-cta-label]").textContent = cta.label;
    ctaRow.hidden = false;
  }

  shell.hidden = false;
})();
