function initNewsletter() {
  const form = document.querySelector<HTMLFormElement>("#newsletter-form");
  const email = document.querySelector<HTMLInputElement>("#newsletter-email");
  const error = document.querySelector<HTMLElement>("#newsletter-error");
  if (!form || !email || !error) return;

  // Keep native validation when JavaScript is unavailable.
  form.noValidate = true;
  form.onsubmit = event => {
    if (email.validity.valid) return;
    event.preventDefault();
    error.textContent = email.validity.valueMissing
      ? "Enter your email address to continue."
      : "Enter a valid email address, for example name@example.com.";
    error.hidden = false;
    email.setAttribute("aria-invalid", "true");
    email.focus();
  };
  email.oninput = () => {
    if (email.validity.valid) {
      error.hidden = true;
      email.removeAttribute("aria-invalid");
    }
  };
}
document.addEventListener("astro:page-load", initNewsletter);
initNewsletter();
