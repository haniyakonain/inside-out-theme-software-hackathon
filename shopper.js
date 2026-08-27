/* ===================================================================
   Inside Out - DevMinds
   Store rendering (real outbound shop links), mobile nav, scroll
   reveal, back-to-top, cursor glow, navbar scroll/active state,
   ripple flourishes, hero parallax.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Store: products (real links, no fake cart) ---------------- */

  const products = [
    { name: "Emotion Mug Set",        price: 14, oldPrice: 18, rating: 4.8, tag: "drinkware",   badge: "Bestseller", imageUrl: "images/1.jpg",  shopQuery: "inside out mug set" },
    { name: "Mixed Emotions Game",    price: 24, rating: 4.6, tag: "games",       badge: null,          imageUrl: "images/2.jpg",  shopQuery: "inside out mixed emotions game" },
    { name: "Joy Icon Tee",           price: 19, rating: 4.7, tag: "apparel",     badge: "New",         imageUrl: "images/3.jpg",  shopQuery: "inside out joy t shirt" },
    { name: "Great Day Tee",          price: 19, rating: 4.5, tag: "apparel",     badge: null,          imageUrl: "images/4.jpg",  shopQuery: "inside out sadness t shirt" },
    { name: "Disgust Icon Tee",       price: 19, rating: 4.4, tag: "apparel",     badge: null,          imageUrl: "images/5.jpg",  shopQuery: "inside out disgust t shirt" },
    { name: "Best Friends Tee",       price: 21, oldPrice: 26, rating: 4.9, tag: "apparel",     badge: "Bestseller", imageUrl: "images/6.jpg",  shopQuery: "inside out characters t shirt" },
    { name: "Core Crew Tee",          price: 22, rating: 4.6, tag: "apparel",     badge: null,          imageUrl: "images/7.jpg",  shopQuery: "inside out group t shirt" },
    { name: "Emotion Pin Badge Set",  price: 12, rating: 4.8, tag: "accessories", badge: "New",         imageUrl: "images/8.jpg",  shopQuery: "inside out pin badge set" },
    { name: "Mind World Phone Case",  price: 16, rating: 4.3, tag: "accessories", badge: null,          imageUrl: "images/9.jpg",  shopQuery: "inside out phone case" },
    { name: "Emotion Phone Case Set", price: 27, oldPrice: 34, rating: 4.7, tag: "accessories", badge: null,          imageUrl: "images/10.jpg", shopQuery: "inside out phone case set" },
  ];

  const TAG_LABEL = {
    apparel: "Apparel",
    drinkware: "Drinkware",
    games: "Games",
    accessories: "Accessories",
  };

  const formatPrice = (n) => `$${n}`;
  const shopUrl = (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;

  const renderProducts = (list) => {
    const container = document.getElementById("products");
    if (!container) return;

    const fragment = document.createDocumentFragment();

    list.forEach((product) => {
      const card = document.createElement("div");
      card.className = `product-card tag-${product.tag}`;

      const media = document.createElement("div");
      media.className = "product-media";

      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.name;
      img.loading = "lazy";
      media.appendChild(img);

      const tag = document.createElement("span");
      tag.className = "product-tag";
      tag.textContent = TAG_LABEL[product.tag] || product.tag;
      media.appendChild(tag);

      if (product.badge) {
        const badge = document.createElement("span");
        badge.className = "product-badge";
        badge.textContent = product.badge;
        media.appendChild(badge);
      }

      const name = document.createElement("h3");
      name.textContent = product.name;

      const rating = document.createElement("div");
      rating.className = "product-rating";
      rating.innerHTML = `<i class="fa-solid fa-star"></i> ${product.rating.toFixed(1)}`;

      const priceRow = document.createElement("div");
      priceRow.className = "product-price";
      const now = document.createElement("span");
      now.className = "now";
      now.textContent = formatPrice(product.price);
      priceRow.appendChild(now);
      if (product.oldPrice) {
        const was = document.createElement("span");
        was.className = "was";
        was.textContent = formatPrice(product.oldPrice);
        priceRow.appendChild(was);
      }

      // Real outbound link to an actual marketplace search for this item -
      // no simulated cart, no fake "added" state.
      const link = document.createElement("a");
      link.className = "shop-link";
      link.href = shopUrl(product.shopQuery);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `Shop Now <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
      link.addEventListener("click", (e) => spawnRipple(link, e));

      card.append(media, name, rating, priceRow, link);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  };

  renderProducts(products);

  /* ---------------- Ripple click feedback ---------------- */

  function spawnRipple(el, event) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${(event.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
    ripple.style.top = `${(event.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  document.querySelectorAll(".btn-magic, .btn-ghost, .back-to-top, .social-btn").forEach((el) => {
    el.addEventListener("click", (e) => spawnRipple(el, e));
  });

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

  /* ---------------- Navbar: scrolled state + active link ---------------- */

  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const linkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          const link = navLinks.find((a) => a.getAttribute("href") === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => linkObserver.observe(section));
  }

  /* ---------------- Scroll reveal (with stagger for grids) ---------------- */

  document.querySelectorAll(".products, .gallery-grid").forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
    });
  });

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
  const fineHover = window.matchMedia("(pointer: fine)").matches;

  if (glow && fineHover) {
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

  /* ---------------- Hero parallax tilt (desktop only) ---------------- */

  const heroVisual = document.querySelector(".hero-visual");
  const heroFrame = document.querySelector(".hero-frame");
  if (heroVisual && heroFrame && fineHover) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    });
    heroVisual.addEventListener("mouseleave", () => {
      heroFrame.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  // Note: the gallery no longer gets a JS mouse-tilt - it now uses the
  // restored CSS flex "accordion" (panels widen on hover), and animating
  // both at once looked janky, so this keeps to the one effect.
});
