const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const nav = $("#nav");
const menuToggle = $("#menuToggle");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Scroll reveal animation with an accessible fallback
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => observer.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

// Contact form: replace this placeholder with your real email before publishing.
const YOUR_EMAIL = "your-email@example.com";
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name")).trim();
  const email = String(data.get("email")).trim();
  const message = String(data.get("message")).trim();
  if (YOUR_EMAIL === "your-email@example.com") {
    $("#formStatus").textContent = "Setup needed: open script.js and replace YOUR_EMAIL with your contact email.";
    return;
  }
  const subject = encodeURIComponent(`Website message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  $("#formStatus").textContent = "Opening your email app with the message ready to send…";
  window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
});

// Gallery lightbox
const lightbox = $("#lightbox");
$$(".gallery-card").forEach(card => card.addEventListener("click", () => {
  $("#lightboxTitle").textContent = card.dataset.title;
  $("#lightboxCaption").textContent = card.dataset.caption;
  const art = $("#lightboxArt");
  const scene = card.querySelector(".photo-art");
  art.className = `lightbox-art ${scene.className}`;
  art.innerHTML = scene.innerHTML;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}));
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
