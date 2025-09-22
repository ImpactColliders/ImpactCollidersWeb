// navbar.js
(function () {
  // Set the active page here (match the href)
  const activePage = "index.html"; // change to "about.html", "appnav.html", etc.

  const navItems = [
    { name: "Home", href: "index.html" },
    { name: "About Us", href: "about.html" },
    { name: "Video Library", href: "appnav.html" },
    { name: "Digital Game", href: "ehhowahproduct.html" },
    { name: "Shop", href: "shop.html" },
  ];

  const navHtml = `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <a href="index.html" class="logo">
              <img src="assets/images/Impact Colliders_Black.png" alt="Impact Colliders Logo" />
            </a>
            <ul class="nav">
              ${navItems
                .map(
                  (item) =>
                    `<li class="${item.href === activePage ? "active" : ""}">
                      <a href="${item.href}">${item.name}</a>
                    </li>`
                )
                .join("")}
            </ul>
            <a class="menu-trigger"><span>Menu</span></a>
          </nav>
        </div>
      </div>
    </div>
  `;

  const navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) {
    navPlaceholder.innerHTML = navHtml;

    // Optional: mobile menu toggle
    const menuTrigger = navPlaceholder.querySelector(".menu-trigger");
    const navList = navPlaceholder.querySelector(".nav");
    if (menuTrigger) {
      menuTrigger.addEventListener("click", () => {
        console.log("test");
        navList.classList.toggle("show");
      });
    }
  }
})();
