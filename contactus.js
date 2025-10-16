function createContactForm(containerId) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <div class="footer-content">
      <div class="row contact-row">
        <!-- Contact Links -->
        <div class="col-lg-6 contact-links">
          <h2>Contact Us</h2>
          <ul class="social">
            <li><a href="https://www.instagram.com/impactcolliders/" target="_blank"><i class="fa fa-instagram"></i></a></li>
            <li><a href="https://www.tiktok.com/@impactcolliders?is_from_webapp=1&sender_device=pc" target="_blank"><i class="fa fa-tiktok"><img src="assets/images/tiktok.png" style="height:2.5dvh"></i></a></li>
            <li><a href="https://www.facebook.com/p/Impact-Colliders-61571335654695/" target="_blank"><i class="fa fa-facebook"></i></a></li>
            <li><a href="https://www.linkedin.com/company/impact-colliders/posts/?feedView=all" target="_blank"><i class="fa fa-linkedin"></i></a></li>
          </ul>
        </div>

        <br>

        <!-- Contact Form -->
        <div class="col-lg-6 contact-form">
          <form id="contact" action="#" method="post">
            <div class="row">
              <div class="col-md-6">
                <input name="name" type="text" placeholder="Full Name" required />
              </div>
              <div class="col-md-6">
                <input name="email" type="text" placeholder="Email Address" required />
              </div>
              <div class="col-lg-12">
                <input name="subject" type="text" placeholder="Subject" required />
              </div>
              <div class="col-lg-12">
                <textarea name="message" rows="6" placeholder="Your Message" required></textarea>
              </div>
              <div class="col-lg-12">
                <button type="submit" class="main-button">Send Message</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <br>

      <!-- Mailing List Form -->
      <div class="contact-form">
        <form
          action="https://impactcolliders.us10.list-manage.com/subscribe/post?u=1b49b4b873f4789130f22dfd4&amp;id=c856daa883&amp;f_id=008cc2e1f0"
          method="post"
          target="_self"
        >
          <h2>Join our Mailing List</h2>
          <div class="row">
            <div class="col-md-12">
              <input type="email" name="EMAIL" placeholder="Email Address" required />
            </div>
            <div class="col-md-6">
              <input type="text" name="FNAME" placeholder="First Name" required />
            </div>
            <div class="col-md-6">
              <input type="text" name="LNAME" placeholder="Last Name" required />
            </div>
            <div class="col-md-12" style="display:none;">
              <input type="text" name="b_1b49b4b873f4789130f22dfd4_c856daa883" tabindex="-1" value="">
            </div>
            <div class="col-md-12">
              <button type="submit" class="main-button">Subscribe</button>
            </div>
          </div>
        </form>
      </div>

      <div class="sub-footer">
        <p>&copy; 2025 Impact Colliders. All rights reserved.</p>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .main-button {
      background-color: #000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .main-button:hover {
      background-color: #333;
    }

    /* Add spacing below social links only */
    ul.social {
      margin-bottom: 30px; /* space below social links */
    }
  `;
  document.head.appendChild(style);

  // Contact form submission
  const form = document.getElementById("contact");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = form.querySelector("input[name='name']").value;
    const email = form.querySelector("input[name='email']").value;
    const subject = form.querySelector("input[name='subject']").value;
    const message = form.querySelector("textarea[name='message']").value;

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailtoLink = `mailto:info@impactcolliders.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  });

  // Mobile reorder function
  function reorderForMobile() {
    const row = container.querySelector(".contact-row");
    const links = container.querySelector(".contact-links");

    if (window.innerWidth < 992) {
      row.prepend(links);
    } else {
      row.appendChild(links);
    }
  }

  // Initial check
  reorderForMobile();

  // Recheck on window resize
  window.addEventListener("resize", reorderForMobile);
}

// Inject the contact form
createContactForm("contact-container");
