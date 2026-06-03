/*
 * Digital name cards — shared data source.
 * ===============================================================
 *
 * ADD A NEW CARD  (e.g. make /namecards/jocelyn)
 * ---------------------------------------------------------------
 *   1. Add an entry to the NAMECARDS object below, keyed by the
 *      slug you want in the URL (use lowercase, no spaces).
 *      Copy the template block and fill in the details:
 *
 *        jocelyn: {
 *          name: "Jocelyn Tan",
 *          title: "Co-Founder",                       // optional
 *          org: "Impact Colliders",
 *          photo: "/assets/images/Jocelyn Namecard.jpg",
 *          phone: "+6591234567",
 *          email: "jocelyn@impactcolliders.com",
 *          linkedin: "https://www.linkedin.com/in/jocelyn/"
 *        },
 *
 *   2. Create the page folder so the URL works:
 *        - Copy the whole "avin" folder and rename it to the slug
 *          (e.g. namecards/jocelyn/  containing index.html).
 *        - Open that index.html and change the one line:
 *              window.NAMECARD_SLUG = "avin";
 *          to your slug, e.g.  window.NAMECARD_SLUG = "jocelyn";
 *
 *   That's it. Styling, buttons and "Save Contact" are shared, so
 *   you never edit the CSS or JS to add a card.
 *
 * UPDATE AN EXISTING CARD
 * ---------------------------------------------------------------
 *   Just edit that person's fields in the NAMECARDS object below.
 *   No need to touch their folder/index.html.
 *
 * FIELD REFERENCE
 * ---------------------------------------------------------------
 *   name      Full display name. Shown on the card.            (required)
 *   title     Role, e.g. "Founder". Also fills the Title field
 *             of the saved contact (.vcf).                      (optional)
 *   org       Organisation, e.g. "Impact Colliders". Also fills
 *             the Organisation field of the saved contact.      (optional)
 *             title + org show under the name as "Title | Org"
 *             (either part may be left "" to omit it).
 *   photo     Path to the profile image, absolute from the site
 *             root. Put the file in /assets/images/.            (required)
 *   phone     Phone number in international format, no spaces,
 *             e.g. "+6587783419". Powers the Call button and
 *             saved contact. Leave "" to hide the Call button.
 *   email     Email address. Powers the Email button. Leave ""
 *             to hide the Email button.
 *   linkedin  Full LinkedIn profile URL. Powers the LinkedIn
 *             button. Leave "" to hide the LinkedIn button.
 * ===============================================================
 */
window.NAMECARDS = {

  avin: {
    name: "Avin Teo",
    title: "Founder",
    org: "Impact Colliders",
    photo: "/assets/images/Avin Teo Namecard.jpg",
    phone: "+6587783419",
    email: "avinteo@impactcolliders.com",
    linkedin: "https://www.linkedin.com/in/avin-teo/"
  },

  jocelyn: {
    name: "Jocelyn Chng",
    title: "Lead",
    org: "The Archive",
    photo: "/assets/images/Jocelyn Chng Namecard-4jun26.jpg",
    phone: "+6589010684",
    email: "jocelynchng06@gmail.com",
    linkedin: "https://www.linkedin.com/in/jocelynchnghuipheng/"
  },

  shiying: {
    name: "Shi Ying Ng",
    title: "Program Lead",
    org: "The Archive",
    photo: "/assets/images/Shi Ying Ng Namecard-4jun26.jpg",
    phone: "+6588096839",
    email: "ngshiying06@gmail.com",
    linkedin: "https://www.linkedin.com/in/shi-ying-ng-0b846a347/"
  }

  // Add more cards here. Remember the comma after the block above
  // when you add the next one.

};
