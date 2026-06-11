/* ── Typed.js hero text ── */
var typed = new Typed(".text", {
  strings: ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "UI/UX Developer"],
  typeSpeed: 70,
  backSpeed: 50,
  backDelay: 1500,
  loop: true,
});

/* ── Navbar: highlight active section on scroll ── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const active = document.querySelector(`.navbar a[href="#${id}"]`);
      if (active) active.classList.add("active");
    }
  });

  /* Sticky header shadow on scroll */
  const header = document.querySelector(".header");
  if (scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ── Scroll reveal: fade-in sections when they enter viewport ── */
const revealEls = document.querySelectorAll(
  ".about, .services-list div, .skill-category-card, .project-card, .timeline-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

/* ── EmailJS init ── */
emailjs.init("P-DtFgcOOPVw4hEmp");

/* ── Contact form: validation + EmailJS submission ── */
const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  const submitBtn = contactForm.querySelector(".btn-box");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('input[name="name"]');
    const email   = contactForm.querySelector('input[name="email"]');
    const subject = contactForm.querySelector('input[name="subject"]');
    const message = contactForm.querySelector("textarea");

    // Basic validation
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const templateParams = {
      from_name:  name.value.trim(),
      from_email: email.value.trim(),
      subject:    subject ? subject.value.trim() : "Portfolio Contact",
      message:    message.value.trim(),
    };

    emailjs
      .send(
        "service_b73du4r",
        "template_amoz41b",
        templateParams
      )
      .then(() => {
        showToast("Message sent! I'll get back to you soon. ✅", "success");
        contactForm.reset();
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        showToast("Oops! Something went wrong. Please try again.", "error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
  });
}

/* ── Toast notification helper ── */
function showToast(message, type = "success") {
  // Remove existing toast if any
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 16px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    animation: slideInToast 0.4s ease forwards;
    background: ${type === "success"
      ? "linear-gradient(135deg, #00b894, #0ef)"
      : "linear-gradient(135deg, #d63031, #e17055)"};
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}