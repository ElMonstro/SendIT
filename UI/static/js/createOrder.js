const createOrderBtn = document.querySelector('#create-order-button')
const createOrderForm = document.querySelector('#create-order-button')
const body = document.querySelector('body')

function createOrder(e) {
    e.preventDefault()
    alert("Order Created")
}

function buttonOnMouseOver () {
    createOrderBtn.style.backgroundColor = "#282a35"
}

function buttonOnMouseOut () {
    createOrderBtn.style.backgroundColor = "black"
}


body.onload = () => {
    createOrderForm.onsubmit = createOrder;
    createOrderBtn.ommouseover = buttonOnMouseOver;
    createOrderBtn.ommouseover = buttonOnMouseOut;
}
