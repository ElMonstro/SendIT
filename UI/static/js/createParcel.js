// Elements
const recepientNameInput = document.querySelector('#recep-name');
const recepientNoInput = document.querySelector('#recep-no');
const pickupInput = document.querySelector('#pickup');
const destInput = document.querySelector('#dest');
const weightInput = document.querySelector('#weight')
const createBtn = document.querySelector('#create-btn');

// Get passed variables
var url = new URL(document.URL);
let token = url.searchParams.get('token');

// Add event listener to create button
createBtn.addEventListener('click', createOrder)

// Function to create parcel
function createOrder(e){
    e.preventDefault();
    var recepientName = recepientNameInput.value;
    var recepientNo = recepientNoInput.value;
    var pickup = pickupInput.value;
    var dest = destInput.value;
    var weight = weightInput.value;
    const createOrderUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels`

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
                console.log(data.order)
            }
            console.log(data.message)
        })
       
    })
    .catch(error => consol.log(error));
}

