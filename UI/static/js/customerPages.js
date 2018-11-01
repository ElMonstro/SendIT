'use strict'

/* Global variables*/
var pricePerKg = 200;
const allOrdersDiv = document.querySelector('#all-orders')

var allOrders = {
    321: ['4 5345 343', '4 5343 343', 5, 'In-transit'],
    453: ['4 5435 324', '6 5356 353', 3, 'Delivered'],
    133: ['5 6535 453', '8 5465 742', 6,  'Canceled'],
    301: ['4 5345 343', '4 5343 343', 5, 'In-transit'],
    353: ['4 5435 324', '6 5356 353', 3,  'Delivered'],
    633: ['5 6535 453', '8 5465 742', 6,  'Canceled']
}

// Fuction to check if tray is empty
function isEmpty(dict){
    return Object.getOwnPropertyNames(dict) == 0;
}

// Function to display order from
function DisplayOrders(){
    for(var order in orders){
        var pickupAdd = orders[order][0];
        var destAdd = orders[order][1];
        var weight = orders[order][2];
        var price = weight * pricePerKg;
        var status = orders[order][3];
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = 
        `<span class="order-id">${order}</span>
        <span class="pickup">${pickupAdd}</span>
        <span class="Destination">${destAdd}</span>
        <span><span class="weight">${weight}</span> Kgs</span>
        <span><span>Kshs</span> <span class="price"> ${price}</span></span>
        <span class="status">${status}</span>`;
        allOrdersDiv.appendChild(orderDiv);
        

    }    

}
