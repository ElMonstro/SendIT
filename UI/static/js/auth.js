// Elements
const registerBtn = document.querySelector('#register-btn');

const url = 'https://pacific-harbor-80743.herokuapp.com/'

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
    var email = document.querySelector('#reg-email').value
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
        body: JSON.stringify({email:email, password:password})

    })
    .then((res) => res.json())
    .then((data)=> console.log(data))
}




