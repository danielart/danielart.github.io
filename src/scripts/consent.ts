// Basic consent: no Google requests until the visitor explicitly accepts.
let gtmLoaded = false;
let consent: string | null = null;
try {
  consent = localStorage.getItem("cookie-consent");
} catch {
  // Storage may be unavailable; keep analytics disabled by default.
}

const dataLayer: unknown[] = [];
function loadAnalytics() {
  if (!import.meta.env.PROD || gtmLoaded || consent !== "accepted") return;
  Object.assign(window, { dataLayer });
  dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-T2HZPQD3";
  script.async = true;
  document.head.append(script);
  gtmLoaded = true;
}

function clearAnalyticsCookies() {
  const domains = location.hostname.split(".");
  const scopes = [
    "",
    ...domains.map((_, i) => `; Domain=${domains.slice(i).join(".")}`),
  ];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const scope of scopes) {
      document.cookie = `${name}=; Max-Age=0; Path=/${scope}; SameSite=Lax`;
    }
  }
}

function chooseConsent(value: "accepted" | "declined") {
  consent = value;
  try {
    localStorage.setItem("cookie-consent", value);
  } catch {
    // Honor the choice in this page even when it cannot be persisted.
  }
  const banner = document.getElementById("cookie-consent-banner");
  if (banner) banner.hidden = true;
  if (value === "accepted") {
    loadAnalytics();
  } else {
    clearAnalyticsCookies();
    // A reload removes already-loaded Google and container scripts.
    if (gtmLoaded) location.reload();
  }
}

function initConsent() {
  const banner = document.getElementById("cookie-consent-banner");
  const accept = document.getElementById("cookie-accept-btn");
  const decline = document.getElementById("cookie-decline-btn");
  if (!banner || !accept || !decline) return;
  banner.hidden = consent === "accepted" || consent === "declined";
  accept.onclick = () => chooseConsent("accepted");
  decline.onclick = () => chooseConsent("declined");
  document
    .querySelectorAll<HTMLButtonElement>("[data-cookie-settings]")
    .forEach(button => {
      button.hidden = false;
      button.onclick = () => {
        banner.hidden = false;
        decline.focus();
      };
    });
  loadAnalytics();
}

document.addEventListener("astro:page-load", initConsent);
document.addEventListener("astro:after-swap", () => {
  if (gtmLoaded && consent === "accepted") {
    dataLayer.push({
      event: "virtual_page_view",
      page_path: location.pathname,
      page_title: document.title,
    });
  }
});
initConsent();
