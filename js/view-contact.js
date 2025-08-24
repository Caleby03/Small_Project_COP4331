const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
const contactContainer = document.querySelector('.contacts-container');
const length = contacts.length;

function addContactElement(){
    /*
        <div class="contact">
          <h3 class="contact-initials">AK</h3>
          <div class="contact-group">
            <p class="contact-name">name</p>
            <p class="contact-email">email</p>
            <p class="contact-phone">phone</p>
          </div>
      </div>

    */

    //loop through contacts added
    for(let i = 0; i < length; i++){
        //creating layout above
        let contact = document.createElement('div');
        contact.classList = "contact";

        let contactInitials = document.createElement('h3');
        contactInitials.classList = "contact-initials";

        let contactGroup = document.createElement('div');
        contactGroup.classList = "contact-group";

        let firstName = contacts[i].firstName;
        let lastName = contacts[i].lastName;
        let phone = contacts[i].phone;

        applyInitials(contactInitials, firstName, lastName);
        contact.appendChild(contactInitials);

        //adding name, email, phone
        let nameP = document.createElement("p");
        nameP.classList = "contact-name";
        applyNames(nameP, firstName, lastName);
        contactGroup.appendChild(nameP);

        let emailP = document.createElement("p");
        emailP.classList = "contact-email";
        emailP.textContent = "Email";
        contactGroup.appendChild(emailP);

        let phoneP = document.createElement("p");
        phoneP.classList = "contact-phone";
        applyPhones(phoneP, phone);
        contactGroup.appendChild(phoneP);

        contact.appendChild(contactGroup);

        contactContainer.appendChild(contact);

    }
}

function createP(className, text){
    const p = document.createElement("p");
    p.classList = className;
    p.textContent = text;
    return p;
    //use this to clean up addContactElement()
}


//used these to test

//set initials on correct element
function applyInitials(element, firstName, lastName){
    let firstLetter = firstName[0];
    let secondLetter = lastName[0];
    element.textContent = firstLetter + secondLetter;
}

//set names on correct element
function applyNames(element, firstName, lastName){
    element.textContent = firstName + " " + lastName;
}

//set phone numbers on correct element
function applyPhones(element, phone){
    element.textContent = phone;
}


addContactElement();
