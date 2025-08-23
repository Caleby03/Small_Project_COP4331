// js for add-contact page
(function () {
  const form = document.getElementById("AddContactForm");
  const firstEl = document.getElementById("firstName");
  const lastEl  = document.getElementById("lastName");
  const phoneEl = document.getElementById("phoneNumber");
  const errorEl = document.getElementById("error-text");
  const submitBtn = document.getElementById("add-contact-btn");

  if (!form || !firstEl || !lastEl || !phoneEl) return;

  // helpers
  const normalize = s => (s || "").trim();
  const digits = s => (s || "").replace(/\D/g, "");
  const titleCase = s => s.replace(/\b([a-z])/g, m => m.toUpperCase()).replace(/\b([A-Z][a-z]*)/g, w => w);

  function formatPhone(raw) {
    const d = digits(raw).slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }

  function loadContacts() {
    try { return JSON.parse(localStorage.getItem("contacts")) || []; }
    catch { return []; }
  }

  function saveContacts(list) {
    localStorage.setItem("contacts", JSON.stringify(list));
  }

  function showError(msg) {
    errorEl.textContent = msg || "";
    if (msg) errorEl.focus?.();
  }

  //  live formatting (automatically adds "-" between groups of 3 digits)
  phoneEl.addEventListener("input", () => {
    const before = phoneEl.value;
    phoneEl.value = formatPhone(before);
    if (document.activeElement === phoneEl) {
      phoneEl.setSelectionRange(phoneEl.value.length, phoneEl.value.length);
    }
  });

  // submit button handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

    let firstName = normalize(firstEl.value);
    let lastName  = normalize(lastEl.value);
    let phone     = formatPhone(phoneEl.value);

    // form validation
    if (!firstName || !lastName || !phone) {
      showError("Please fill out all fields.");
      return;
    }
    if (digits(phone).length !== 10) {
      showError("Please enter a valid 10‑digit phone number.");
      phoneEl.focus();
      return;
    }

    // normalize capitalization of names
    firstName = titleCase(firstName);
    lastName  = titleCase(lastName);

    const contacts = loadContacts();

    //  duplicate detection 
    const exists = contacts.some(c =>
      c.firstName.toLowerCase() === firstName.toLowerCase() &&
      c.lastName.toLowerCase() === lastName.toLowerCase() &&
      digits(c.phone) === digits(phone)
    );
    if (exists) {
      showError("That contact already exists.");
      return;
    }

    // build contact
    const newContact = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString()
    };

    // save contact
    submitBtn.disabled = true;
    try {
      contacts.push(newContact);
      saveContacts(contacts);
      form.reset();

      // return to home page
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      showError("Something went wrong saving the contact. Please try again.");
      submitBtn.disabled = false;
    }
  });
})();
