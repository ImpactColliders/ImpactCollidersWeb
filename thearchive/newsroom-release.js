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
      // TODO: point at the published report (PDF or viewer link)
      url: "REPLACE_WITH_REPORT_LINK"
    }
  }

  // , "next-release-slug": { kicker, title, cover, coverAlt, body: [...], cta: { label, url } }
};

(function () {
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
