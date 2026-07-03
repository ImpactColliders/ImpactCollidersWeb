// The Archive — Newsroom data
// Kept SEPARATE from the main site's press-releases-data.js.
// To add a new newsroom item, append a new object to this array.
// The newest items should appear first.
//
// Required fields:
//   slug    - unique URL identifier (used as ?slug=... on newsroom-release.html)
//   title   - headline
//   date    - display date (e.g. "6 September 2026")
//   image   - path to the featured image (use absolute paths, e.g. "/assets/images/...")
//   body    - HTML string shown on the dedicated article page
//             (the first <p> is auto-used as the listing card preview)
// Optional fields:
//   cta      - { label, href, external } shown as a button at the end of the article
//   imageAlt - alt text override (defaults to title)
//   summary  - override for the listing card preview text (defaults to first paragraph of body)

window.ARCHIVE_NEWSROOM = [
  // Duplicated from the main site's press releases as placeholder content.
  {
    slug: "annual-report-launch",
    title: "Launch of Our First Annual Report",
    date: "28 May 2026",
    image: "/assets/images/Annual Report Cover Square.jpg",
    imageAlt: "Impact Colliders 1st Anniversary Edition Annual Report cover",
    body: `
      <p>
        <strong>Singapore, 28 May 2026</strong> — One year after its formal
        incorporation, Impact Colliders has released its first Annual Report,
        reflecting on a year of using games and community-led learning to help
        seniors build digital confidence.
      </p>
      <p>
        Over the past year, Impact Colliders reached 723 seniors across 37
        workshops, supported by 59 volunteers and partnerships with
        organisations including IMDA, Mapletree, and NTUC Health.
      </p>
      <p>
        The report highlights the organisation's continued mission to make
        technology more accessible, engaging, and inclusive for seniors
        through play-based learning.
      </p>
    `,
    cta: {
      label: "View Annual Report FY25/26 (PDF)",
      href: "/assets/docs/Impact-Colliders-Annual-Report-FY25-26_compressed.pdf",
      external: true,
    },
  },
];
