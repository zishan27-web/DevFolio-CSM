
document.getElementById("myform").addEventListener('submit', (event)=>{
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput =  document.getElementById("password");

    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => response.json())
    .then(data => {
        if(data.token)
        {
            console.log("Login successful! Token:", data.token);
            // Here you would save the token and redirect
            localStorage.setItem('authToken', data.token);
            window.location.href = 'admin_dashboard.html';
        } else {
            console.error("Login failed:", data);
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
    });
});

const togglebutton = document.querySelector('.togglebutton');

togglebutton.addEventListener('click', ()=>{
    const passwordInput = document.querySelector('#password');
    if (passwordInput.type === "password") {
        passwordInput.type = 'text';
        togglebutton.src = './images/view.png';
    }
    else{
        passwordInput.type = 'password';
        togglebutton.src = './images/hide.png';
    }
})