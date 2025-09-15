function createContactForm(containerId) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
      <div class="footer-content">
        <div class="row">
          <div class="col-lg-6">
            <div class="contact-form">
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
          <div class="col-lg-6">
            <h2>Contact Us</h2>
            <ul class="social">
              <li><a href="https://www.instagram.com/impactcolliders/"><i class="fa fa-instagram"></i></a></li>
              <li><a href="https://www.facebook.com/p/Impact-Colliders-61571335654695/"><i class="fa fa-facebook"></i></a></li>
              <li><a href="https://www.linkedin.com/company/impact-colliders/posts/?feedView=all"><i class="fa fa-linkedin"></i></a></li>
              <li><a href="https://www.tiktok.com/@impact.colliders?is_from_webapp=1&sender_device=pc"><i class="fa fa-tiktok"></i></a></li>
            </ul>
          </div>
        </div>
        <div class="sub-footer">
          <p>&copy; 2025 Impact Colliders. All rights reserved.</p>
        </div>
      </div>
    `;

  // Attach form submission handler
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
}

// Inject the contact form
createContactForm("contact-container");
