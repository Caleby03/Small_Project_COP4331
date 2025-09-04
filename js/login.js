// pasted this from Khalil's branch on featire/navbar
const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
const extension = "php";
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorTxt = document.getElementById("error-text");

    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);

    function handleLogin(e){
        e.preventDefault(); // stop default form submission
        if(handleError()) return;
        console.log(emailInput.value, passwordInput.value);
        let payload = {login: emailInput.value, password: passwordInput.value};
        let jsonPayload = JSON.stringify(payload);
        console.log(jsonPayload);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", urlbase + '/Login.' + extension, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        
        try{    
            xhr.onreadystatechange = function() 
            {
                if(this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    console.log(jsonObject);
                    
                    sessionStorage.setItem("loggedIn", "true");
                    window.location.href = "color.html";
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err){
            errorTxt.innerHTML = err.message;
        }
    }

    function handleRegister(){
        window.location.href = "./register.html";
    }

    function handleError(){
        const emailVal = emailInput.value.trim();
        const passVal = passwordInput.value.trim();

        if(emailVal === "" && passVal === ""){
            errorTxt.innerHTML = "Please enter email and password";
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