(function () {
  const STORAGE_KEY = "scorpio_cookie_consent";
  const existing = localStorage.getItem(STORAGE_KEY);

  function loadGA4() {
    if (window.scorpioGA4Loaded || !window.SCOPRIO_GA4_ID) return;
    window.scorpioGA4Loaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + window.SCOPRIO_GA4_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", window.SCOPRIO_GA4_ID);
  }

  function saveChoice(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    document.getElementById("scorpio-cookie-banner")?.remove();
    if (choice === "accepted") loadGA4();
  }

  function showBanner() {
    if (document.getElementById("scorpio-cookie-banner")) return;

    const banner = document.createElement("div");
    banner.id = "scorpio-cookie-banner";
    banner.innerHTML = `
      <div class="scorpio-cookie-content">
        <strong>Your privacy matters</strong>
        <p>We use essential cookies to operate this website. With your permission, we also use analytics cookies to understand blog usage and improve our content.</p>
        <div class="scorpio-cookie-actions">
          <button type="button" data-choice="accepted">Accept All</button>
          <button type="button" data-choice="rejected">Reject Non-Essential</button>
          <button type="button" data-choice="settings">Cookie Settings</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    banner.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.choice === "settings") {
          alert("Essential cookies are always active. Analytics cookies are optional.");
          return;
        }
        saveChoice(button.dataset.choice);
      });
    });
  }

  if (existing === "accepted") loadGA4();
  else if (existing !== "rejected") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }

  window.scorpioCookieSettings = function () {
    localStorage.removeItem(STORAGE_KEY);
    showBanner();
  };
})();
