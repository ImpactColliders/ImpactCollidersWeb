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
              <li><a href="https://www.instagram.com/impactcolliders/" target="_blank"><i class="fa fa-instagram"></i></a></li>
              <li><a href="https://www.tiktok.com/@impactcolliders?is_from_webapp=1&sender_device=pc" target="_blank"><i class="fa fa-tiktok"><img src="assets/images/tiktok.png" style="height:2dvh"></i></a></li>
              <li><a href="https://www.facebook.com/p/Impact-Colliders-61571335654695/" target="_blank"><i class="fa fa-facebook"></i></a></li>
              <li><a href="https://www.linkedin.com/company/impact-colliders/posts/?feedView=all" target="_blank"><i class="fa fa-linkedin"></i></a></li>
            </ul>
          </div>
        </div>

        <div id="mc_embed_shell">

        <br>
  
<!-- Impact Colliders Mailing List -->
<form
  action="https://impactcolliders.us10.list-manage.com/subscribe/post?u=1b49b4b873f4789130f22dfd4&amp;id=c856daa883&amp;f_id=008cc2e1f0"
  method="post"
  target="_self"
  style="max-width:420px;margin:20px 0;padding:20px;border:1px solid #ccc;border-radius:8px;font-family:sans-serif;text-align:left;"
>
  <h2 style="text-align:left;margin-bottom:16px;">Join our Mailing List</h2>

  <label>Email Address</label>
  <input
    type="email"
    name="EMAIL"
    required
    style="width:100%;padding:10px;margin:6px 0 12px;border:1px solid #ccc;border-radius:4px;"
  >

  <label>First Name</label>
  <input
    type="text"
    name="FNAME"
    required
    style="width:100%;padding:10px;margin:6px 0 12px;border:1px solid #ccc;border-radius:4px;"
  >

  <label>Last Name</label>
  <input
    type="text"
    name="LNAME"
    required
    style="width:100%;padding:10px;margin:6px 0 16px;border:1px solid #ccc;border-radius:4px;"
  >

  <input type="hidden" name="tags" value="357">

  <!-- honeypot (anti-bot) -->
  <div style="position:absolute;left:-5000px;" aria-hidden="true">
    <input type="text" name="b_1b49b4b873f4789130f22dfd4_c856daa883" tabindex="-1" value="">
  </div>

  <button
    type="submit"
    style="width:100%;padding:10px;background:#0073e6;color:#fff;border:none;border-radius:4px;cursor:pointer;"
  >
    Subscribe
  </button>
</form>




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
