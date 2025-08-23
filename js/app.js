// pasted this from Khalil's branch on featire/navbar

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById("hamburger");
    const navBar = document.getElementById("nav-bar");
    const loginlogoutBtn = document.getElementById("login-logout-btn");
    const navBarLinks = document.querySelectorAll('.nav-bar-link');

    // set login/logout button text
    if(sessionStorage.getItem("loggedIn") !== "true"){
        loginlogoutBtn.innerHTML = "Login";
    } else {
        loginlogoutBtn.innerHTML = "Logout";
    }

    // handle login/logout button click
    loginlogoutBtn.addEventListener('click', () => {
        if(sessionStorage.getItem("loggedIn") === "true"){
            handleLogout();
        } else {
            window.location.href = './login.html';
        }
    });

    // handle nav links
    navBarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(sessionStorage.getItem("loggedIn") !== "true"){
                e.preventDefault();
                window.location.href = './login.html';
            }
        });
    });

    // hamburger toggle
    hamburger.addEventListener('click', () => {
        navBar.classList.toggle('show');
    });

    // logout function
    function handleLogout(){
        sessionStorage.removeItem("loggedIn");
        window.location.href = "./login.html";
    }
});