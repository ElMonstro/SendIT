// Elements
const recepientNameInput = document.querySelector('#recep-name');
const recepientNoInput = document.querySelector('#recep-no');
const pickupInput = document.querySelector('#pickup');
const destInput = document.querySelector('#dest');
const weightInput = document.querySelector('#weight')
const createBtn = document.querySelector('#create-btn');
const homeBtns = document.querySelectorAll('.home');
var infoMsgDiv = document.querySelector('.info-msg');
var infoMsgSpan = document.querySelector('.info');

var inputs = {
    receipient: recepientNameInput,
    receipientNo: recepientNoInput,
    pickup: pickupInput,
    dest: destInput,
    weight: weightInput
}

error = 'error';
success = 'success';
plain = 'plain';


// Get passed variables
let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('id');
let username = sessionStorage.getItem('username');

// Add event listeners
createBtn.addEventListener('click', createOrder)
homeBtns.forEach((btn) => btn.addEventListener('click', () => {
    window.location.href = 'dashboard.html?id=' + id.toString() + '&token=' + token;
}))

if (token.length < 20){
    window.location.href = 'login.html';
}
// Function to create parcel
function createOrder(e){
    e.preventDefault();
    var recepientName = recepientNameInput.value;
    var recepientNo = recepientNoInput.value;
    var pickup = pickupInput.value;
    var dest = destInput.value;
    var weight = weightInput.value;
    const createOrderUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels`

    if (!isThereEmptyField(inputs)){
        makePost()
    }

    function makePost(){
        order = { 
            "weight": Number(weight),
            "recepient_name": recepientName,
            "recepient_no": Number(recepientNo),
            "pickup": pickup,
            "dest": dest
           }
           
           // Create parcel
        fetch(createOrderUrl, {
            method: 'POST',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json',
            'token': token
            },
            body: JSON.stringify(order)
        })
        .then((res) => {
            res.json().then((data) => {
                if (res.status == 201){
                    showSnackbar(success, data.message);             
                }else{
                    showSnackbar(error, data.message);
                }
               
            })
           
        })
        .catch(error => consol.log(error));
    }
}

// Checks if fields are empty
function isThereEmptyField(inputs){
    var isEmpty = false
    for (input in inputs){
        if (!inputs[input].value){           
            inputs[input].classList.add('required');
            showSnackbar(error, 'Please fill out this field(s)');
            isEmpty = true;
        }else {
            inputs[input].className = inputs[input].className.replace("required", "");
        }
    }
    return isEmpty    
}

// Function to display snackbar
function showSnackbar(infoType, message){
    infoMsgDiv.classList.remove(error, success)    
    infoMsgSpan.innerText = message;
    infoMsgDiv.classList.add(infoType);
    infoMsgDiv.classList.add('show');
    setTimeout(() => { 
        infoMsgDiv.className = infoMsgDiv.className.replace("show", ""); }, 5000
        );
    }

