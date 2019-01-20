// Elements
const registerBtn = document.querySelector('#register-btn');

const url = 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/signup'

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

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username: username, email: email, password:  password})

    })
    .then((res) => {
        if (res.status == 200){
            window.location.href = 'login.html'
            
        }
        res.json().then((data)=> console.log(data))
    })
    
    .catch((error) => console.log(error))
}

// add event listener to register button
registerBtn.addEventListener('click', register)




