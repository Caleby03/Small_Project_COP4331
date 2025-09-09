// js for add-contact page
(function () {
  const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
  const extension = "php";

  const form = document.getElementById("AddContactForm");
  const firstEl = document.getElementById("firstName");
  const lastEl  = document.getElementById("lastName");
  const phoneEl = document.getElementById("phoneNumber");
  const emailEl = document.getElementById("emailAddress");
  const errorEl = document.getElementById("error-text");
  const successEl = document.getElementById("success-text");
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
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  function showSuccess(msg){
    successEl.textContent = msg || "";
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
  let email     = normalize(emailEl?.value);

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
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    emailEl.focus();
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
      email,
      phone,
      createdAt: new Date().toISOString()
    };

    // save contact
    submitBtn.disabled = true;
    try {
      contacts.push(newContact);
      saveContacts(contacts);
      form.reset();
      showSuccess("Added to contacts!");
      
      userId = sessionStorage.getItem("userId");
      if (!userId){
        showError("Not Signed in. Please Sign-in to add contacts.");
        return;
      }

      let payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            userId: userId
      };

      // Send contact to Add-Contact API
      let jsonPayload = JSON.stringify(payload);

      console.log(jsonPayload);

      let xhr = new XMLHttpRequest();
      xhr.open("POST", urlbase + '/AddContact.' + extension, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      
      try
      {    
        xhr.onreadystatechange = function() 
        {
          if(this.readyState == 4 && this.status == 200) 
          {
            let jsonObject = JSON.parse(xhr.responseText);
            if(jsonObject.error != "")
            {
              showError(jsonObject.error);
              return;
            }
          }
          };
          xhr.send(jsonPayload);
      }
      catch(err){
        errorTxt.innerHTML = err.message;
      }
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } catch (err) {
      console.error(err);
      showError("Something went wrong saving the contact. Please try again.");
      submitBtn.disabled = false;
    }
  });
})();
