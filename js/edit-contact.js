const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
const extension = "php";

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");


const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancel-btn");

const contactId = new URLSearchParams(window.location.search).get("id");

const digits = s => (s || "").replace(/\D/g, "");

function formatPhone(raw) {
    const d = digits(raw).slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function loadContact(id){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlbase + '/SearchContacts.' + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            try{
                const response = JSON.parse(xhr.responseText);
                if(response.error){
                    console.error("Error:", response.error);
                    return;
                }

                const contact = response.results.find(c => Number(c.id) === Number(id));
                if(!contact){
                    console.error("Contact not here?");
                    return;
                }

                firstNameInput.value = contact.firstName;
                lastNameInput.value = contact.lastName;
                emailInput.value = contact.email;
                phoneInput.value = contact.phone;


            }
            catch(error){
                console.error("error:", error);
            }
        }
    }
    const payload = JSON.stringify({userId: sessionStorage.getItem("userId")});
    xhr.send(payload);
}

loadContact(contactId);


function editContact(){


    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        console.error("Not signed in");
        return;
    }

    const payload = {
        userId: Number(userId),
        contactId: Number(contactId),
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlbase + '/update.' + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                try{
                    const response = JSON.parse(xhr.responseText);
                    if(response.error){
                        console.error("Error:",response.error);
                    }
                    else{
                        console.log("Updated contact");
                        window.location.href = './index.html';
                    }
                }
                catch(error){
                    console.error("error:", error);
                }
            }
            else{
                console.error("Failed status", xhr.status);
            }
        }
    }
    xhr.send(JSON.stringify(payload));
}


function saveChanges(){
    editContact();
}

function cancelChanges(){
    window.location.href = './index.html';
}

cancelBtn.addEventListener('click', cancelChanges);

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveChanges();
});


phoneInput.value = formatPhone(contact.phone);

phoneInput.addEventListener('input', () => {
    const before = phoneInput.value;
    phoneInput.value = formatPhone(before);
    if (document.activeElement === phoneInput) {
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    }
});
