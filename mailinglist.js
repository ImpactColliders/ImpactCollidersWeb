// footer.js
(function () {

  //blah blah blah
  function injectFooterStyles() {
    if (document.getElementById("footer-styles")) return;

    const style = document.createElement("style");
    style.id = "footer-styles";
    style.textContent = `
      #contact-us {
        background: #ce3f2e;
        color: #fff;
        padding: 80px 8% 50px;
        font-family: "Poppins", sans-serif;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 60px;
      }

    
      .footer-col h4 {
        margin-bottom: 18px;
        font-weight: 600;
      }

      .footer-col ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-col ul li {
        margin-bottom: 10px;
      }

      .footer-col a {
        color: #fff;
        text-decoration: none;
        opacity: 0.9;
      }

      .footer-col a:hover {
        opacity: 1;
      }

      .contact-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 28px;
  border-radius: 999px;
  background: #fff;
  color: #ce3f2e !important;  /* Force text color */
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

      .newsletter-form {
        display: flex;
        margin-top: 12px;
        border-radius: 999px;
        overflow: hidden;
        background: #fff;
      }

      .newsletter-form input {
        flex: 1;
        padding: 12px 16px;
        border: none;
        outline: none;
      }

      .newsletter-form button {
        padding: 0 20px;
        border: none;
        background: #f6d7c8;
        color: #ce3f2e;
        font-weight: 600;
        cursor: pointer;
      }

      .social-icons {
        margin-top: 20px;
      }

      .social-icons i {
        margin-right: 12px;
        font-size: 20px;
        cursor: pointer;
      }

      .footer-divider {
        margin: 60px 0 40px;
        border: none;
        height: 1px;
        background: rgba(255,255,255,0.3);
      }

      .footer-bottom {
        text-align: center;
      }

      .footer-bottom img {
        height: 40px;
        margin-bottom: 12px;
      }

      .footer-bottom p {
        font-size: 0.9rem;
        opacity: 0.85;
        color : #fff;
      }

      .footer-col p,
.footer-col p a {
  color: #fff !important;
}
      /* Responsive */
      @media (max-width: 992px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
      }

      @media (max-width: 768px) {

  #contact-us {
    padding: 100px 28px 60px !important;
  }

  #contact-us .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

}

      @media (max-width: 600px) {
        .footer-grid {
          grid-template-columns: 1fr;
        }

        .newsletter-form {
          flex-direction: column;
          border-radius: 16px;
        }

        .newsletter-form button {
          padding: 14px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildFooter() {
    return `
      <div class="footer-grid">

        <div class="footer-col">
          <h4>Any Questions?</h4>
          <ul>
           
            <li><a href="ehhowahproduct.html">Product</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Partner With Us</h4>
          <ul>
            <li><a href="corporates.html">Partnerships</a></li>
          
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact</h4>
          <p>For inquiries or partnership opportunities, email us at:</p>
          <p><a href="mailto:info@impactcolliders.com">info@impactcolliders.com</a></p>
          <a href="contactus.html" class="contact-btn">Contact Us ></a>
        </div>

        <div class="footer-col">
          <h4>Stay Connected</h4>
          <p>Join our mailing list!</p>

          <form 
            action="https://impactcolliders.us10.list-manage.com/subscribe/post?u=1b49b4b873f4789130f22dfd4&amp;id=c856daa883&amp;f_id=008cc2e1f0"
            method="post"
            target="_self"
            class="newsletter-form"
          >
            <input type="email" name="EMAIL" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>

         <div class="social-icons">
  <a href="https://www.facebook.com/p/Impact-Colliders-61571335654695/" target="_blank" rel="noopener">
    <i class="fa fa-facebook"></i>
  </a>
  <a href="https://www.instagram.com/impactcolliders/" target="_blank" rel="noopener">
    <i class="fa fa-instagram"></i>
  </a>
 <a href="https://www.tiktok.com/@impactcolliders" target="_blank" rel="noopener">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
    <path d="M12.5 2h2.6c.2 1.6 1.1 3.1 2.6 4 .9.6 2 .9 3.3.9v2.7c-1.4 0-2.7-.4-3.9-1.1-.7-.4-1.4-1-2-1.6v7.2c0 3.6-2.9 6.5-6.5 6.5S2 17.7 2 14.1s2.9-6.5 6.5-6.5c.4 0 .8 0 1.2.1v2.8c-.4-.1-.8-.2-1.2-.2-2 0-3.6 1.6-3.6 3.6S6.5 17.5 8.5 17.5 12 15.9 12 13.9V2h.5z"/>
  </svg>
</a>
  <a href="https://www.linkedin.com/company/impact-colliders" target="_blank" rel="noopener">
    <i class="fa fa-linkedin"></i>
  </a>
</div>
        </div>

      </div>

      <hr class="footer-divider">

      <div class="footer-bottom">
        <img src="assets/images/Impact Colliders_White.png" alt="Impact Colliders Logo">
        <p>© 2025 Impact Colliders. All rights reserved.</p>
      </div>
    `;
  }

  function initFooter() {
    const container = document.getElementById("contact-container");
    if (!container) return;

    injectFooterStyles();
    container.innerHTML = buildFooter();
  }

  document.addEventListener("DOMContentLoaded", initFooter);
})();