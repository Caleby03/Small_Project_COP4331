const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
const extension = "php";


document.addEventListener('DOMContentLoaded', () => {
    const createActBtn = document.getElementById("create-account-btn");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput  = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorTxt = document.getElementById("error-text");

    createActBtn.addEventListener('click', handleRegister);

    if(sessionStorage.getItem("registered") === "true"){
        errorTxt.innerHTML = "Account Created! Please Login.";
        sessionStorage.removeItem("registered");
    }

    function handleRegister(e){
        e.preventDefault(); // stop default form submission
        if(handleError()) return;

        let payload = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            login: emailInput.value,
            password: passwordInput.value
        };
        let jsonPayload = JSON.stringify(payload);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", urlbase + '/Register.' + extension, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        
        try{    
            xhr.onreadystatechange = function() 
            {
                if(this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if(jsonObject.error != "")
                    {
                        errorTxt.innerHTML = "Login Already Exists!";
                        return;
                    }
                    sessionStorage.setItem("registered", "true");
                    window.location.href = "./login.html";
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err){
            errorTxt.innerHTML = err.message;
        }
    }

    function handleError(){
        const firstNameVal = firstNameInput.value.trim();
        const lastNameVal = lastNameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const passVal = passwordInput.value.trim();

        if(firstNameVal === ""){
            errorTxt.innerHTML = "Invalid first name";
            return true;
        }
        if(lastNameVal === ""){
            errorTxt.innerHTML = "Invalid last name";
            return true;
        }
        if(emailVal === ""){
            errorTxt.innerHTML = "Invalid email";
            return true;
        }
        if(passVal === ""){
            errorTxt.innerHTML = "Invalid password";
            return true;
        }

        errorTxt.innerHTML = ""; // clear error on valid input

        //get username and password from database next and check if exists
        return false;
    }
});