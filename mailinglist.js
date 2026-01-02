function createContactForm(containerId) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <div class="footer-content">
    

      <!-- Mailing List Form -->
      <div class="contact-form">
        <form
          action="https://impactcolliders.us10.list-manage.com/subscribe/post?u=1b49b4b873f4789130f22dfd4&amp;id=c856daa883&amp;f_id=008cc2e1f0"
          method="post"
          target="_self"
        >
          <h2>Join our Mailing List</h2>
          <br>
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
    
   .contact-form {
  width: 50%;
  margin: 0 auto;
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
