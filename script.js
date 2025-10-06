/* script.js — optimized version */

/* ========== Shortcuts ========== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Cache elements used repeatedly */
const themeButtons = $$("#theme-toggle");
const skillCards = $$(".skill-card");
const projectLinks = $$(".proj-link");
const scrollEls = $$(".animate-on-scroll");

/* ========== THEME ========== */
const themeKey = "portfolio-theme";

function applyTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light");
  themeButtons.forEach(btn => {
    btn.textContent = theme === "light" ? "Light Mode" : "Dark Mode";
    btn.setAttribute("aria-pressed", theme === "light");
  });
}

function initTheme() {
  const saved = localStorage.getItem(themeKey);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? "light" : "dark");
  applyTheme(theme);
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");
  const theme = isLight ? "light" : "dark";
  localStorage.setItem(themeKey, theme);
  applyTheme(theme);
}

function bindThemeButtons() {
  themeButtons.forEach(btn => btn.addEventListener("click", toggleTheme));
}

/* ========== NAV HIGHLIGHT ========== */
function highlightNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  $$(".main-nav a").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === path)
  );
}

/* ========== SCROLL ANIMATIONS ========== */
function setupScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    scrollEls.forEach(el => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    });
    return;
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  scrollEls.forEach(el => obs.observe(el));
}

/* ========== SKILL TOOLTIPS ========== */
const skillDescriptions = {
  "HTML": "The backbone of web pages, used for structure.",
  "CSS": "Used for styling and responsive design.",
  "JavaScript": "Adds interactivity to web pages.",
  "Python": "General-purpose programming language.",
  "Communication": "Ability to share ideas clearly.",
  "Teamwork": "Collaborating effectively with others.",
  "Problem Solving": "Finding solutions to challenges.",
  "Creativity": "Thinking outside the box."
};

function bindSkillTooltips() {
  skillCards.forEach(card => {
    const skillName = card.dataset.skill || card.textContent.trim();
    card.addEventListener("mouseenter", () => {
      const text = skillDescriptions[skillName];
      if (!text) return;
      const tip = document.createElement("div");
      tip.className = "tooltip";
      tip.innerText = text;
      card.appendChild(tip);

      const rect = tip.getBoundingClientRect();
      if (rect.right > window.innerWidth - 12) {
        tip.style.left = "auto";
        tip.style.right = "0";
      }
    });
    card.addEventListener("mouseleave", () => {
      const existing = card.querySelector(".tooltip");
      if (existing) existing.remove();
    });
  });
}

/* ========== PROJECT MODALS ========== */
function bindProjectModals() {
  projectLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const card = link.closest(".proj-card");
      if (!card) return;

      const title = card.querySelector("h3")?.innerText || "Project";
      const desc = card.querySelector("p")?.innerText || "";
      const imgSrc = card.querySelector("img")?.src || "";

      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-modal="true" aria-label="${title}">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          ${imgSrc ? `<img src="${imgSrc}" alt="${title}" class="modal-img">` : ""}
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      `;
      document.body.appendChild(modal);

      $(".modal-close", modal).addEventListener("click", () => modal.remove());
      modal.addEventListener("click", ev => { if (ev.target === modal) modal.remove(); });
    });
  });
}

/* ========== CONTACT FORM ========== */
function bindContactForm() {
  const form = $(".contact-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#name", form).value.trim();
    const email = $("#email", form).value.trim();
    const message = $("#message", form).value.trim();

    if (!name || !email || !message) return alert("Please fill in all fields before submitting.");

    const key = "contact-submissions";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push({ name, email, message, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(prev));

    alert(`Thank you for reaching out, ${name}! Your message was saved (simulated).`);
    form.reset();
  });
}

/* ========== IMAGE TILT ========== */
function bindImageTilt() {
  $$(".image-tilt").forEach(card => {
    const img = $("img", card);
    if (!img) return;

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 6;
      const ry = (x - 0.5) * -6;
      img.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
    });

    card.addEventListener("mouseleave", () => img.style.transform = "");
  });
}

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  bindThemeButtons();
  highlightNav();
  setupScrollAnimations();
  bindSkillTooltips();
  bindProjectModals();
  bindContactForm();
  bindImageTilt();

  setTimeout(() => {
    $$(".animate-on-load").forEach((el, i) => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
      el.style.transitionDelay = `${i * 60}ms`;
    });
  }, 120);
});
