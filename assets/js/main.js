// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Quote form.
// If the form has a data-endpoint (e.g. a Formspree or Web3Forms URL), it posts there.
// Until one is set up, it opens the visitor's email app with everything filled in.
const form = document.querySelector("#quote-form");
if (form) {
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const services = data.getAll("services").join(", ") || "Not specified";
    const endpoint = form.dataset.endpoint;

    if (endpoint) {
      status.className = "form-status";
      status.textContent = "Sending…";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        status.className = "form-status ok";
        status.textContent = "Thanks! Your request was sent. Jay will get back to you soon.";
      } catch {
        status.className = "form-status err";
        status.textContent = "Something went wrong. Please email Jay@BaltimoreSoundGuy.com directly.";
      }
      return;
    }

    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "—"}`,
      `Event type: ${data.get("event_type") || "—"}`,
      `Event date: ${data.get("event_date") || "—"}`,
      `Location: ${data.get("location") || "—"}`,
      `Services: ${services}`,
      "",
      data.get("message") || "",
    ];
    const subject = `Quote request: ${data.get("event_type") || "Event"} — ${data.get("name")}`;
    window.location.href =
      "mailto:Jay@BaltimoreSoundGuy.com" +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;
    status.className = "form-status ok";
    status.textContent = "Your email app should open with your request filled in. Just hit send!";
  });
}
