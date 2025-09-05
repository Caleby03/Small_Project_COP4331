// pasted this from Khalil's branch on feature/navbar

document.addEventListener('DOMContentLoaded', () => {

    // added this section for better formatting of headers
    const header = document.querySelector('.app-header');
    const setHeaderVar = () => {
        if (!header) return;
        const h = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    setHeaderVar();
    window.addEventListener('resize', () => requestAnimationFrame(setHeaderVar));
    if (window.ResizeObserver && header) {
        const ro = new ResizeObserver(() => setHeaderVar());
        ro.observe(header);
    }

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

    // logout function
    function handleLogout(){
        sessionStorage.removeItem("loggedIn");
        window.location.href = "./login.html";
    }
});