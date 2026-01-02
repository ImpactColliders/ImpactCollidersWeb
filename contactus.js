(function () {
  function injectStyles() {
    if (document.getElementById("contact-footer-styles")) return;

    const style = document.createElement("style");
    style.id = "contact-footer-styles";
    style.textContent = `
      /* ===== Contact Footer Wrapper ===== */
      #contact-footer {
        position: relative;
        background: linear-gradient(135deg, #f4813f 0%, #f1556c 100%);
        clip-path: polygon(0 15%, 100% 0, 100% 100%, 0% 100%);
        padding: 160px 0 60px;
        margin-top: 120px;
      }

      /* Contact card */
      #contact-footer .footer-content {
        background: #ffffff;
        border-radius: 14px;
        padding: 48px;
        max-width: 1000px;
        margin: 0 auto;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        position: relative;
        z-index: 2;
      }

      /* Headings */
      #contact-footer h2 {
        font-weight: 700;
        margin-bottom: 20px;
      }

      /* Social links */
      ul.social {
        display: flex;
        gap: 16px;
        padding: 0;
        margin: 0 0 30px;
        list-style: none;
      }

      ul.social li a {
        font-size: 22px;
        color: #000;
      }

      .tiktok-icon {
        height: 22px;
      }

      /* Contact form */
      .contact-form input,
      .contact-form textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 14px;
        border-radius: 6px;
        border: 1px solid #ccc;
      }

      .main-button {
        background: #000;
        color: #fff;
        padding: 10px 22px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
      }

      .main-button:hover {
        background: #333;
      }

      /* Copyright */
      .sub-footer {
        text-align: center;
        margin-top: 32px;
        font-size: 0.85rem;
        color: #fff;
      }

      /* Mobile adjustments */
      @media (max-width: 991px) {
        #contact-footer {
          padding: 140px 16px 60px;
        }

        #contact-footer .footer-content {
          padding: 32px;
        }
      }

      @media (max-width: 768px) {

  /* Remove aggressive diagonal spacing */
  #contact-footer {
    clip-path: none;
    padding: 80px 16px 40px;
    margin-top: 60px;
  }

  /* Card becomes full-width */
  #contact-footer .footer-content {
    padding: 30px 20px;
    border-radius: 14px;
  }

  /* Stack everything vertically */
  .contact-row {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Social section */
  .contact-links {
    text-align: center;
  }

  ul.social {
    justify-content: center;
  }

  /* Contact + mailing forms */
  .contact-form {
   margin: 0 auto;
  
    width: 80%;
  }

  .contact-form form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Inputs */
  .contact-form input,
  .contact-form textarea {
    font-size: 16px;
    padding: 12px 14px;
  }

  /* Buttons = full width */
  .main-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    border-radius: 999px;
  }

  /* Mailing list specific */
  .contact-form h2 {
    text-align: center;
    font-size: 1.6rem;
    margin-bottom: 10px;
  }

  /* Footer text */
  .sub-footer {
    font-size: 0.8rem;
    margin-top: 24px;
    color: #fff;
  }
}
    `;
    document.head.appendChild(style);
  }

  function injectMarkup(container) {
    container.innerHTML = `
      <section id="contact-footer">
        <div class="footer-content">
          <div class="row contact-row">

            <!-- Contact Links -->
            <div class="col-lg-6 contact-links">
              <h2>Contact Us</h2>
              <ul class="social">
                <li>
                  <a href="https://www.instagram.com/impactcolliders/" target="_blank" rel="noopener">
                    <i class="fa fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@impactcolliders" target="_blank" rel="noopener">
                    <img src="assets/images/tiktok.png" alt="TikTok" class="tiktok-icon">
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/p/Impact-Colliders-61571335654695/" target="_blank" rel="noopener">
                    <i class="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/impact-colliders/" target="_blank" rel="noopener">
                    <i class="fa fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Contact Form -->
            <div class="col-lg-6 contact-form">
              <form id="contact">
                <input name="name" type="text" placeholder="Full Name" required />
                <input name="email" type="email" placeholder="Email Address" required />
                <input name="subject" type="text" placeholder="Subject" required />
                <textarea name="message" rows="6" placeholder="Your Message" required></textarea>
                <button type="submit" class="main-button">Send Message</button>
              </form>
            </div>

          </div>
        </div>

        <div class="sub-footer">
          <p>&copy; 2025 Impact Colliders. All rights reserved.</p>
        </div>
      </section>
    `;
  }

  function attachFormHandler(container) {
    const form = container.querySelector("#contact");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.location.href =
        `mailto:info@impactcolliders.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  function handleResponsiveOrder(container) {
    const row = container.querySelector(".contact-row");
    const links = container.querySelector(".contact-links");

    if (!row || !links) return;

    function reorder() {
      if (window.innerWidth < 992) {
        row.prepend(links);
      } else {
        row.appendChild(links);
      }
    }

    reorder();
    window.addEventListener("resize", reorder);
  }

  function init() {
    const container = document.getElementById("contact-container");
    if (!container) return;

    injectStyles();
    injectMarkup(container);
    attachFormHandler(container);
    handleResponsiveOrder(container);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
