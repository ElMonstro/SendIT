// Elements
const registerBtn = document.querySelector('#register-btn');
const loginBtn = document.querySelector('#login-btn');

const registerUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/signup'
const loginUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/login'

function pswdValidator(){
    pass1 = document.querySelector('#reg-pass').value;
    pass2 = document.querySelector('#confirm-pass').value;
    if (pass1 == pass2){
        return true;
    }else{
        return false;
    }
}


function register(e){
    e.preventDefault();
    var email = document.querySelector('#reg-email').value
    var username = document.querySelector('#reg-username').value
    if (pswdValidator()){
        var password = document.querySelector('#reg-pass').value;
    }else{
        console.log('passwords dont match')
    }

    fetch(registerUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username: username, email: email, password:  password})

    })
    .then((res) => {
        if (res.status == 200){
            window.location.href = 'login.html';
            
        }
        res.json().then((data)=> console.log(data));
    })
    
    .catch((error) => console.log(error));
}

function login(e){
    e.preventDefault();
    let username = document.querySelector('#login-username').value;
    let password = document.querySelector('#login-pswd').value;

    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username: username, password:  password})

    })
    .then((res) => {
        if (res.status == 200){
            res.json().then((data)=> {
                id = data['user_id'];
                is_admin = data['is_admin']
                if (!is_admin){
                    window.location.href = 'dashboard.html?id=' + id.toString() + '&token=' + data['token'];
                }else{
                    window.location.href = 'admin-dashboard.html?id=' + id.toString() + '&token=' + data['token'];
                }
               
            });
        
        }
        
    })
    
    .catch((error) => console.log(error));
}

pageTitle = document.querySelector('title').innerText;

// add event listener to submit buttons
if (pageTitle == 'Register'){
    registerBtn.addEventListener('click', register)
    
} else if(pageTitle == 'Login'){
    loginBtn.addEventListener('click', login);
}





