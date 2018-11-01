'use strict'

/* Global variables*/
var pricePerKg = 200;
const allOrdersDiv = document.querySelector('#all-orders')
var all = 'all';
var canceled = 'Canceled';
var delivered = 'Delivered';
var inTransit = 'In-transit';

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
function DisplayOrders(option){
    allOrdersDiv.innerHTML = '';
    for(var order in allOrders){
        var pickupAdd = allOrders[order][0];
        var destAdd = allOrders[order][1];
        var weight = allOrders[order][2];
        var price = weight * pricePerKg;
        var status = allOrders[order][3];
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = 
        `<span class="order-id">${order}</span>
        <span class="pickup">${pickupAdd}</span>
        <span class="Destination">${destAdd}</span>
        <span><span class="weight">${weight}</span> Kgs</span>
        <span><span>Kshs</span> <span class="price"> ${price}</span></span>
        <span class="status">${status}</span>`;

        const statusSpan = orderDiv.querySelector('.status');

        if (status == canceled){
            statusSpan.classList.add('canceled')            
        }
        if(status == inTransit){
            statusSpan.classList.add('in-transit')           
         }
         if(status == delivered){
            statusSpan.classList.add('delivered')
        }  
        
        if (option == all){
            allOrdersDiv.appendChild(orderDiv);
        }
        if (status == option){
            allOrdersDiv.appendChild(orderDiv);
        }

        
        

    }    

}



// Add event listeners to side-panel options
function AddEventListeners(){
    ;
}


// Listen to DOMContentLoaded event

document.addEventListener('DOMContentLoaded', () =>{    
    DisplayOrders(all);
});
