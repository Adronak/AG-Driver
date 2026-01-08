const body = document.body;

body.classList.remove("no-js");

window.addEventListener("load", () => {
  body.classList.add("is-loaded");
});

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const emailParts = ["contact", "agcdriver.fr"];
const contactEmail = emailParts.join("@");

const emailDisplays = document.querySelectorAll("[data-email-display]");
const emailLinks = document.querySelectorAll("[data-email-link]");
const emailButtons = document.querySelectorAll("[data-email-button]");

emailDisplays.forEach((element) => {
  element.textContent = contactEmail;
});

emailLinks.forEach((element) => {
  element.textContent = contactEmail;
  element.setAttribute("href", `mailto:${contactEmail}`);
});

emailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = `mailto:${contactEmail}`;
  });
});

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const vehicles = [
  {
    type: "Berline prestige",
    name: "Mercedes Classe S",
    desc: "Silence absolu, finitions cuir et confort longue distance.",
    price: "À partir de 380 EUR",
    capacity: "3 passagers - 3 bagages",
    tags: ["Massage", "Climatisation 4 zones", "Chauffeur dédié"],
    image: "assets/img/new-class-s.jpg",
  },
  {
    type: "Berline executive",
    name: "Mercedes Classe E",
    desc: "Équilibre parfait entre élégance et efficacité business.",
    price: "À partir de 150 EUR",
    capacity: "3 passagers - 2 bagages",
    tags: ["Espace bureau", "Connectivité", "Bouteilles d'eau"],
    image: "assets/img/class-e.jpg",
  },
  {
    type: "Van premium",
    name: "Mercedes Classe V",
    desc: "Idéal pour les groupes, transferts familles et événements.",
    price: "À partir de 350 EUR",
    capacity: "6 passagers - 6 bagages",
    tags: ["Accès facile", "Confort lounge", "Grand coffre"],
    image: "assets/img/mercedes-class-v.jpg",
  },
  {
    type: "SUV premium",
    name: "Audi Q4 Électrique",
    desc: "Confort moderne et tenue de route pour longs trajets.",
    price: "À partir de 150 EUR",
    capacity: "4 passagers - 4 bagages",
    tags: ["Système premium", "Assises hautes", "Technologie embarquée"],
    image: "assets/img/new-Q4.jpg",
  },
];

const slider = document.querySelector(".vehicle-slider");

if (slider) {
  const media = slider.querySelector(".vehicle-media");
  const imageEl = document.getElementById("vehicle-image");
  const typeEl = document.getElementById("vehicle-type");
  const nameEl = document.getElementById("vehicle-name");
  const descEl = document.getElementById("vehicle-desc");
  const priceEl = document.getElementById("vehicle-price");
  const capacityEl = document.getElementById("vehicle-capacity");
  const tagsEl = document.getElementById("vehicle-tags");
  const dotsEl = document.getElementById("vehicle-dots");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  let index = 0;
  let autoplayId = null;
  let switchTimeout = null;

  const buildDots = () => {
    vehicles.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Aller au véhicule ${idx + 1}`);
      dot.addEventListener("click", () => {
        index = idx;
        updateVehicle();
        restartAutoplay();
      });
      dotsEl.appendChild(dot);
    });
  };

  const setActiveDot = () => {
    const dots = dotsEl.querySelectorAll("button");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  };

  const renderTags = (tags) => {
    tagsEl.innerHTML = "";
    tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
  };

  const updateVehicle = () => {
    if (!vehicles.length) {
      return;
    }

    const vehicle = vehicles[index];

    if (media) {
      media.classList.add("is-switching");
    }

    if (switchTimeout) {
      clearTimeout(switchTimeout);
    }

    switchTimeout = setTimeout(() => {
      imageEl.src = vehicle.image;
      imageEl.alt = vehicle.name;
      typeEl.textContent = vehicle.type;
      nameEl.textContent = vehicle.name;
      descEl.textContent = vehicle.desc;
      priceEl.textContent = vehicle.price;
      capacityEl.textContent = vehicle.capacity;
      renderTags(vehicle.tags);
      setActiveDot();

      if (media) {
        requestAnimationFrame(() => {
          media.classList.remove("is-switching");
        });
      }
    }, 180);
  };

  const nextVehicle = () => {
    index = (index + 1) % vehicles.length;
    updateVehicle();
  };

  const prevVehicle = () => {
    index = (index - 1 + vehicles.length) % vehicles.length;
    updateVehicle();
  };

  const startAutoplay = () => {
    if (autoplayId) {
      return;
    }
    autoplayId = setInterval(nextVehicle, 6500);
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  buildDots();
  updateVehicle();
  startAutoplay();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextVehicle();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevVehicle();
      restartAutoplay();
    });
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", startAutoplay);
}

const mapElement = document.getElementById("service-map");

if (mapElement && window.L) {
  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView([43.55, 6.95], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 18,
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: "map-pin",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const locations = [
    { name: "Saint-Tropez", coords: [43.2707, 6.6402] },
    { name: "Cannes", coords: [43.5528, 7.0174] },
    { name: "Monaco", coords: [43.7384, 7.4246] },
    { name: "Nice Aéroport", coords: [43.6584, 7.2159] },
    { name: "Marseille Aéroport", coords: [43.4376, 5.2143] },
  ];

  locations.forEach((spot) => {
    L.marker(spot.coords, { icon: pinIcon }).addTo(map).bindPopup(spot.name);
  });

  L.circle([43.55, 6.8], {
    radius: 90000,
    color: "#c8a55a",
    fillColor: "#c8a55a",
    fillOpacity: 0.12,
  }).addTo(map);
}

const form = document.getElementById("contact-form");

if (form) {
  const status = form.querySelector(".form-status");
  const button = form.querySelector(".btn");
  const buttonLabel = button ? button.querySelector("span") : null;
  const defaultLabel = buttonLabel ? buttonLabel.textContent : "";

  const buildMailtoLink = () => {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `Demande AG Driver${name ? ` - ${name}` : ""}`;
    const body = [
      `Nom: ${name || "-"}`,
      `Email: ${email || "-"}`,
      "",
      "Message:",
      message || "-",
    ].join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.classList.add("is-sent");
    window.location.href = buildMailtoLink();

    if (status) {
      status.textContent = "Votre application email va s'ouvrir pour finaliser l'envoi.";
    }

    if (button) {
      button.classList.remove("pulse");
      void button.offsetWidth;
      button.classList.add("pulse");
      button.disabled = true;
      if (buttonLabel) {
        buttonLabel.textContent = "Ouvrir l'email";
      }

      setTimeout(() => {
        button.disabled = false;
        button.classList.remove("pulse");
        if (buttonLabel) {
          buttonLabel.textContent = defaultLabel;
        }
      }, 1400);
    }
  });
}
