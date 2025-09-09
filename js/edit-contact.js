const urlbase = "http://cop4331smallprojectteam28.xyz/LAMPAPI";
const extension = "php";

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");


function loadContact(id){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlbase + '/update.' + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            try{
                const response = JSON.parse(xhr.responseText);
                console.log(response.results);
            }
            catch(error){
                console.error("error:", error);
            }
        }
    }
    const payload = JSON.stringify({search: "", userId: Number(userId)});
}

function editContact(contactId, data){

    const userId = sessionStorage.getItem("userId");
    if(!userId){
        console.error("Not signed in");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlbase + '/update.' + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status = 200){
                try{
                    const response = JSON.parse(xhr.responseText);
                    if(response.error){
                        console.error("Error:",response.error);
                    }
                    else{
                        console.log("Updated contact");
                    }
                }
                catch(error){
                    console.error("error:", error);
                }
            }
        }
    }
    const payload = JSON.stringify({search: "", userId: Number(userId)});

}
