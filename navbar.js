// navbar.js
(function () {
  const activePage = location.pathname.split("/").pop().replace(/\.html$/, "") || "";

  const navItems = [
    { name: "Home", href: "/" },
   { name: "About us", href: "about" },

    { name: "Eh, How Ah?", href: "ehhowahproduct" },



    { name: "Partner", href: "corporates" }
  ];

  function injectStyles() {
    if (document.getElementById("navbar-styles")) return;

    const style = document.createElement("style");
    style.id = "navbar-styles";
    style.textContent = `
/* ================= HEADER ================= */
.header-area {
  position: sticky;
  top: 0;
  z-index: 1100;
  height: 90px;
  background: #ce3f2e;
}

.header-area .main-nav .nav {
    background-color: #ce3f2e;
}

.header-area .main-nav .nav li a {
  color: rgba(255,255,255,0.6);
}
/* ALWAYS hidden by default */
.mobile-nav {
  display: none;
}


/* ================= DESKTOP NAV ================= */
.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10px;
}

.logo img {
  height: 44px;
  width: auto;
}

.main-nav .nav {
  display: flex;
  align-items: center;
  
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav .nav li a {
  color: #999;
  text-decoration: none;
  font-weight: 500;
}



.main-nav .nav li.active a {
  color: rgb(255, 255, 255);
  font-weight: 600;
}

/* Dropdown desktop */
.has-dropdown { position: relative; }
.dropdown {
  display: none;
  position: absolute;
    top: 100%;
  left: 0;
  background: #fff;
  border-radius: 14px;
  min-width: 200px;
  padding: 8px 0;
  box-shadow: 0 18px 35px rgba(0,0,0,0.15);
}
.has-dropdown:hover .dropdown { display: block; }

/* CTA */
.nav-cta a {
  background: #f4813f;
  color: #fff !important;
  padding: 1px 20px;
  border-radius: 999px;
  font-weight: 600;
}



/* ================= HAMBURGER ================= */
.menu-trigger {
  display: none;
  cursor: pointer;
}

.menu-trigger span,
.menu-trigger span::before,
.menu-trigger span::after {
  display: block;
  background: #333;
  height: 3px;
  width: 24px;
  border-radius: 2px;
  position: relative;
}

.menu-trigger span::before,
.menu-trigger span::after {
  content: "";
  position: absolute;
  left: 0;
}

.menu-trigger span::before { top: -7px; }
.menu-trigger span::after  { top: 7px; }

/* ================= MOBILE OVERLAY ================= */
@media (max-width: 991px) {
  .menu-trigger { display: block; }

  /* hide desktop nav */
  .main-nav .nav { display: none; }

  /* overlay */
  .mobile-nav {
    position: fixed;
    inset: 0;
    background: #fff;
    z-index: 2000;
    display: none;
    padding: 28px 24px;
  }
  .main-nav .nav.show .mobile-logo {
    display: block;
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
  }

  .mobile-logo img {
    height: 42px;
    width: auto;
  }
  .mobile-nav.show {
    display: block;
  }

  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .mobile-nav-header img {
    height: 42px;
    width: auto;
  }

  .mobile-close {
    font-size: 28px;
    cursor: pointer;
  }

  .mobile-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-nav li {
    background: #f7f7f7;
    border-radius: 12px;
    margin-bottom: 14px;
  }

  .mobile-nav li a {
    display: block;
    padding: 18px;
    text-align: center;
    font-weight: 600;
    color: #333;
    text-decoration: none;
  }

  .mobile-cta {
    margin-top: 18px;
  }

  .mobile-cta a {
    display: block;
    text-align: center;
    padding: 16px;
    border-radius: 999px;
    background: #f4813f;
    color: #fff;
    font-weight: 600;
  }

  body.nav-open {
    overflow: hidden;
  }
}
`;
    document.head.appendChild(style);
  }

  function buildNavbar() {
    return `
<div class="container">
  <nav class="main-nav">
    <a href="/" class="logo">
      <img src="assets/images/Impact Colliders_White.png" alt="Impact Colliders Logo">
    </a>

    <ul class="nav">
      ${navItems.map(item => {
        if (item.dropdown) {
          return `
          <li class="has-dropdown">
            <a href="#">${item.name}</a>
            <ul class="dropdown">
              ${item.dropdown.map(sub =>
                `<li><a href="${sub.href}">${sub.name}</a></li>`
              ).join("")}
            </ul>
          </li>`;
        }
        return `<li class="${item.href === activePage ? "active" : ""}">
          <a href="${item.href}">${item.name}</a>
        </li>`;
      }).join("")}


    </ul>

    <a class="menu-trigger"><span></span></a>
  </nav>
</div>

<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav-header">
    <img src="assets/images/Impact Colliders_Black.png" alt="Impact Colliders Logo">
    <span class="mobile-close">&times;</span>
  </div>

  <ul>
    <li><a href="/">Home</a></li>
      
    <li><a href="about">About Us</a></li>
    
    <li><a href="ehhowahproduct">Eh, How Ah?</a></li>

      <li><a href="corporates">Partner</a></li>
   
  </ul>

</div>
`;
  }

  function init() {
    const placeholder = document.getElementById("nav-placeholder");
    if (!placeholder) return;

    injectStyles();
    placeholder.innerHTML = buildNavbar();

    const menuBtn = document.querySelector(".menu-trigger");
    const mobileNav = document.getElementById("mobileNav");
    const closeBtn = mobileNav.querySelector(".mobile-close");

    menuBtn.onclick = () => {
      mobileNav.classList.add("show");
      document.body.classList.add("nav-open");
    };

    closeBtn.onclick = () => {
      mobileNav.classList.remove("show");
      document.body.classList.remove("nav-open");
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
