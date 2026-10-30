document.addEventListener("DOMContentLoaded", function () {

  // TRANSLATIONS
  const translations = {
    fr: {
      tagline: "Rapide • Simple • Fiable",
      welcome: "Bienvenue sur IvoireConnect !",
      intro: "Votre connexion Internet simplifiée.",
      buyTitle: "Acheter des forfaits Internet",
      network: "Choisir le réseau",
      phone: "Numéro de téléphone",
      bundle: "Choisir un forfait",
      payment: "Mode de paiement",
      continue: "CONTINUER",
      how: "Comment ça marche ?",
      step1: "✓ Choisissez votre réseau",
      step2: "✓ Choisissez votre forfait",
      step3: "✓ Entrez votre numéro",
      step4: "✓ Suivez les instructions de paiement",
      footer: "Connecter la Côte d'Ivoire",
      invalid: "Veuillez entrer un numéro valide à 10 chiffres.",
      select: "Veuillez choisir un forfait.",
      success: "Commande préparée !"
    },

    en: {
      tagline: "Fast • Simple • Reliable",
      welcome: "Welcome to IvoireConnect!",
      intro: "Your internet connection made simple.",
      buyTitle: "Buy Internet Bundles",
      network: "Select Network",
      phone: "Phone Number",
      bundle: "Choose a Bundle",
      payment: "Payment Method",
      continue: "CONTINUE",
      how: "How It Works",
      step1: "✓ Choose your network",
      step2: "✓ Choose your bundle",
      step3: "✓ Enter your phone number",
      step4: "✓ Follow payment instructions",
      footer: "Connecting Côte d'Ivoire",
      invalid: "Enter a valid 10-digit phone number.",
      select: "Please select a bundle.",
      success: "Order prepared!"
    }
  };

  // DATA BUNDLES AND PRICES
  const bundleData = {
    Orange: [
      ["220 MB", 250],
      ["400 MB", 350],
      ["750 MB", 550],
      ["1.5 GB", 1100],
      ["4 GB", 1100]
    ],

    MTN: [
      ["220 MB", 250],
      ["400 MB", 350],
      ["750 MB", 550],
      ["1.5 GB", 1100],
      ["2.2 GB", 1600]
    ],

    Moov: [
      ["650 MB", 250],
      ["900 MB", 350],
      ["1.5 GB", 550],
      ["4 GB", 1100]
    ]
  };

  let selectedBundle = null;
  let currentLanguage = "fr";

  // HTML ELEMENTS
  const network = document.getElementById("network");
  const phone = document.getElementById("phone");
  const buyButton = document.getElementById("buyBtn");
  const bundleContainer = document.querySelector(".bundles");
  const message = document.getElementById("message");

  if (!network || !phone || !buyButton || !bundleContainer || !message) {
    console.error("IvoireConnect: An HTML element is missing.");
    return;
  }

  // LANGUAGE SWITCHING
  function setLanguage(language) {
    if (!translations[language]) return;

    currentLanguage = language;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;

      if (translations[language][key]) {
        element.textContent = translations[language][key];
      }
    });

    phone.placeholder = language === "fr"
      ? "Exemple : 0700000000"
      : "Example: 0700000000";

    localStorage.setItem("ivoireLanguage", language);
    message.textContent = "";
  }

  document.querySelectorAll(".lang-btn").forEach(button => {
    button.addEventListener("click", function () {
      setLanguage(this.dataset.lang);
    });
  });

  // NETWORK SELECTION
  network.addEventListener("change", function () {
    const chosenNetwork = this.value;

    selectedBundle = null;
    message.textContent = "";
    bundleContainer.innerHTML = "";

    if (!bundleData[chosenNetwork]) return;

    bundleData[chosenNetwork].forEach(([size, price]) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "bundle";

      button.textContent =
        size + " — " + price.toLocaleString() + " FCFA";

      button.addEventListener("click", function () {

        document.querySelectorAll(".bundle").forEach(item => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        selectedBundle = {
          network: chosenNetwork,
          size: size,
          price: price
        };

        message.textContent =
          "Selected: " + chosenNetwork + " | " +
          size + " | " + price.toLocaleString() + " FCFA";
      });

      bundleContainer.appendChild(button);
    });
  });

  // WHATSAPP ORDER
  buyButton.addEventListener("click", function () {

    const customerPhone = phone.value.trim();

    if (!/^0\d{9}$/.test(customerPhone)) {
      message.textContent = translations[currentLanguage].invalid;
      return;
    }

    if (!selectedBundle) {
      message.textContent = translations[currentLanguage].select;
      return;
    }

    const payment = document.getElementById("payment").value;

    const whatsappMessage =
      "Hello IvoireConnect! I want to order:\n" +
      "Network: " + selectedBundle.network + "\n" +
      "Bundle: " + selectedBundle.size + "\n" +
      "Price: " + selectedBundle.price + " FCFA\n" +
      "Customer phone: " + customerPhone + "\n" +
      "Payment: " + payment;

    const whatsappLink =
      "https://api.whatsapp.com/send?phone=2250556973452&text=" +
      encodeURIComponent(whatsappMessage);

    // Show a clickable WhatsApp button
    message.innerHTML =
      translations[currentLanguage].success +
      "<br><br>" +
      '<a href="' + whatsappLink +
      '" target="_blank" rel="noopener noreferrer">' +
      "SEND ORDER ON WHATSAPP</a>";

  });

  // START LANGUAGE
  const savedLanguage = localStorage.getItem("ivoireLanguage") || "fr";
  setLanguage(savedLanguage);

});