function signup(){
    const email = document.getElementById("newEmail").value;
    const pass = document.getElementById("newPass").value;

    if(!email || !pass){
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", pass);

    alert("Signup successful!");
    window.location.href = "login.html";
}

function login(){
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    if(
        email === localStorage.getItem("userEmail") &&
        pass === localStorage.getItem("userPass")
    ){
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}
