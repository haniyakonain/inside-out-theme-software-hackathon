/* ===================================================================
   Inside Out — DevMinds
   Store rendering + cart, mobile nav, scroll reveal, back-to-top,
   cursor glow.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Store: products + cart ---------------- */

  const ACCENTS = [
    "var(--joy)", "var(--sadness)", "var(--anger)", "var(--fear)",
    "var(--disgust)", "var(--envy)", "var(--anxiety)", "var(--embarrassment)",
    "var(--ennui)", "var(--joy)"
  ];

  const products = [
    { name: "Joy's Memory Orb",      price: "$10", imageUrl: "images/1.jpg" },
    { name: "Headquarters Console",  price: "$15", imageUrl: "images/2.jpg" },
    { name: "Sadness's Blue Book",   price: "$20", imageUrl: "images/3.jpg" },
    { name: "Anger's Fire Mug",      price: "$25", imageUrl: "images/4.jpg" },
    { name: "Fear's Checklist Pad",  price: "$30", imageUrl: "images/5.jpg" },
    { name: "Disgust's Broccoli Pin",price: "$35", imageUrl: "images/6.jpg" },
    { name: "Core Memory Set",       price: "$40", imageUrl: "images/7.jpg" },
    { name: "Islands of Personality",price: "$45", imageUrl: "images/8.jpg" },
    { name: "Riley's Hockey Jersey", price: "$50", imageUrl: "images/9.jpg" },
    { name: "Mind World Poster",     price: "$55", imageUrl: "images/10.jpg" },
  ];

  let cartCount = 0;
  const cartCountEl = document.getElementById("cartCount");
  const toastEl = document.getElementById("toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };

  const addToCart = (name, button) => {
    cartCount += 1;
    if (cartCountEl) cartCountEl.textContent = String(cartCount);
    showToast(`${name} added to cart`);

    if (button) {
      const original = button.textContent;
      button.textContent = "Added ✓";
      button.classList.add("added");
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("added");
        button.disabled = false;
      }, 900);
    }
  };

  const renderProducts = (list) => {
    const container = document.getElementById("products");
    if (!container) return;

    const fragment = document.createDocumentFragment();

    list.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.setProperty("--accent", ACCENTS[index % ACCENTS.length]);

      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.name;
      img.loading = "lazy";

      const name = document.createElement("h3");
      name.textContent = product.name;

      const price = document.createElement("p");
      price.textContent = product.price;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Add to Cart";
      button.addEventListener("click", () => addToCart(product.name, button));

      card.append(img, name, price, button);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  };

  renderProducts(products);

  /* ---------------- Mobile nav toggle ---------------- */

  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------- Back to top ---------------- */

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("show", window.scrollY > 500),
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Cursor glow (pointer devices only) ---------------- */

  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    let raf = null;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          glow.style.opacity = "1";
          glow.style.left = `${e.clientX}px`;
          glow.style.top = `${e.clientY}px`;
          raf = null;
        });
      },
      { passive: true }
    );
    window.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  }
});
