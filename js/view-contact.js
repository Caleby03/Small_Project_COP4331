/*
AI USAGE DISCLOSURE:
 I, (Collin Van Meter) used ChatGPT 5 to assist with the development of this javascript file.
 Due to the complexities of live search, sorting, and deletion confirmation features,
 I reached out to ChatGPT for help in implementing these features.
 The provided code was tested, verified and understood by me.
*/

const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
const extension = "php";

function getContacts() {
  const raw = localStorage.getItem("contacts");
  const parsed = raw ? JSON.parse(raw) : [];
  return parsed;
}

function getContactsFromDBTest(){
  const userId = sessionStorage.getItem("userId");
  if(!userId){
    console.error("Not signed in.");
    return;
  }

  let xhr = new XMLHttpRequest();
        xhr.open("POST", urlbase + '/SearchContacts.' + extension, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF=8");

  xhr.onreadystatechange = function() {
    if(this.readyState && this.status == 200){
      try{
        let response = JSON.parse(xhr.responseText);
        if(response.error){
          console.error("database error: ", response.error);
        }
        else{
          console.log("From database:", response.results);
        }
      }
      catch(error){
        console.error("Invalid json?:", error);
      }
    }
    else{
      console.error("XHR error: ", this.status);
    }
  }
  let payload = JSON.stringify({userId: userId});
  xhr.send(payload);
}

function saveContacts(list) {
  localStorage.setItem("contacts", JSON.stringify(list));
}

// grab elements
const searchEl     = document.getElementById("contact-search");
const resultsEl    = document.getElementById("results");
const emptyState   = document.getElementById("empty-state");
const showAllBtn   = document.getElementById("show-all-btn");
const modal         = document.getElementById("confirm-modal");
const confirmDelete = document.getElementById("confirm-delete");
const confirmCancel = document.getElementById("confirm-cancel");

// flags/helpers
let pendingDeleteId = null;
let showAllMode = false;

// Make initials for contact's name
function initialsFor(firstName = "", lastName = "") {
  const a = firstName.trim()[0]?.toUpperCase() || "";
  const b = lastName.trim()[0]?.toUpperCase() || "";
  return (a + b) || "?";
}

function formatPhone(phone = "") {
  const d = (phone + "").replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
  return phone || "—";
}

function contactCard(contact) {
  const item = document.createElement("div");
  item.className = "contact";
  item.setAttribute("role", "listitem");
  item.dataset.id = contact.id;

  const badge = document.createElement("h3");
  badge.className = "contact-initials";
  badge.textContent = initialsFor(contact.firstName, contact.lastName);

  const group = document.createElement("div");
  group.className = "contact-group";

  const nameP = document.createElement("p");
  nameP.className = "contact-name";
  nameP.textContent = `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim();

  const emailP = document.createElement("p");
  emailP.className = "contact-email";
  emailP.textContent = contact.email?.trim() || "—";

  const phoneP = document.createElement("p");
  phoneP.className = "contact-phone";
  phoneP.textContent = formatPhone(contact.phone);

  const actions = document.createElement("div");
  actions.className = "contact-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn";
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => handleEdit(contact.id));

  const delBtn = document.createElement("button");
  delBtn.className = "btn btn--danger";
  delBtn.type = "button";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => openConfirm(contact.id, nameP.textContent));

  actions.append(editBtn, delBtn);
  group.append(nameP, emailP, phoneP, actions);

  item.append(badge, group);
  return item;
}

function render(list) {
  resultsEl.innerHTML = "";
  if (!list.length) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";
  const frag = document.createDocumentFragment();
  list.forEach(c => frag.appendChild(contactCard(c)));
  resultsEl.appendChild(frag);
}

// Search w/ live prefix match on (first OR last name)
function matchesPrefix(q, c) {
  if (!q) return true; // handled by showAllMode/empty query guard in currentResults
  const needle = q.trim().toLowerCase();
  const first = (c.firstName || "").toLowerCase();
  const last  = (c.lastName || "").toLowerCase();
  const email = (c.email || "").toLowerCase();
  return first.startsWith(needle) || last.startsWith(needle) || email.startsWith(needle);
}

function currentResults(query) {
  const all = getContacts();

  // no actions by user, empty list
  if (!showAllMode && !query?.trim()) return [];

  // show all contacts active
  if (showAllMode && !query?.trim()) {
    return all.slice().sort((a, b) => {
      const ln = (a.lastName || "").localeCompare(b.lastName || "");
      return ln !== 0 ? ln : (a.firstName || "").localeCompare(b.firstName || "");
    });
  }

  // otherwise use live prefix matching
  const filtered = all.filter(c => matchesPrefix(query, c));
  filtered.sort((a, b) => {
    const ln = (a.lastName || "").localeCompare(b.lastName || "");
    return ln !== 0 ? ln : (a.firstName || "").localeCompare(b.firstName || "");
  });
  return filtered;
}

function updateView() {
  const q = searchEl.value;
  render(currentResults(q));
}

// Small debounce so we don’t over-render on fast typing
let t = null;
function onSearchInput() {
  clearTimeout(t);
  showAllMode = false; // typing disables show-all
  showAllBtn.textContent = "Show all contacts";
  showAllBtn.setAttribute("aria-pressed", "false");
  t = setTimeout(updateView, 80);
}


function handleEdit(id) {
  // Pass id via query string so the edit page can load the right contact
  window.location.href = `./edit-contact.html?id=${encodeURIComponent(id)}`;
}

function openConfirm(id, displayName) {
  pendingDeleteId = id;
  document.getElementById("confirm-text").textContent =
    `You are about to DELETE “${displayName}” WARNING: This action CANNOT be undone!!!`;
  modal.hidden = false;
  modal.focus?.();
}

function closeConfirm() {
  modal.hidden = true;
  pendingDeleteId = null;
}

function confirmDeletion() {
  if (!pendingDeleteId) return closeConfirm();
  const list = getContacts().filter(c => c.id !== pendingDeleteId);
  saveContacts(list);
  closeConfirm();
  updateView();
}


(() => {
  // Initial: empty list, prompt user to type or use Show All
  render([]);

  searchEl.addEventListener("input", onSearchInput);
  showAllBtn.addEventListener("click", () => {
    showAllMode = !showAllMode;
    showAllBtn.textContent = showAllMode ? "Hide all contacts" : "Show all contacts";
    showAllBtn.setAttribute("aria-pressed", String(showAllMode));
    updateView();
  });

  confirmCancel.addEventListener("click", closeConfirm);
  confirmDelete.addEventListener("click", confirmDeletion);

})();


getContactsFromDBTest();
