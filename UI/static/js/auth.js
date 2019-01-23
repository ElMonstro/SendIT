
// Elements
const registerBtn = document.querySelector('#register-btn');
const loginBtn = document.querySelector('#login-btn');

const registerUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/signup'
const loginUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/login'

var success = 'success';
var error = 'error';
var plain = 'plain';

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
            res.json().then((data)=> {
            });
            window.location.href = 'login.html';       
        } else{
            res.json()
            .then(data => {
                showSnackbar(error, data.message);
                console.log(data.message)
            });
        }
        
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

var pageTitle = document.querySelector('title').innerText;
var infoMsgDiv = document.querySelector('.info-msg');
var infoMsgSpan = document.querySelector('.info');

// Function to display snackbar
function showSnackbar(infoType, message){
    
    infoMsgSpan.innerText = message;
    infoMsgDiv.classList.add(infoType);
    infoMsgDiv.classList.add('show');
    setTimeout(() => { 
        infoMsgDiv.className = infoMsgDiv.className.replace("show", ""); }, 5000
        );
    
}


// add event listener to submit buttons
if (pageTitle == 'Register'){
    registerBtn.addEventListener('click', register)
    
} else if(pageTitle == 'Login'){
    loginBtn.addEventListener('click', login);
}






