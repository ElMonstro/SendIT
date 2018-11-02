'use strict'

/* Global variables*/
var pricePerKg = 200;
const allOrdersDiv = document.querySelector('#all-orders')
var all = 'all';
var canceled = 'Canceled';
var delivered = 'Delivered';
var inTransit = 'In-transit';
var singleOrder = 'order'
const options = document.querySelectorAll('.option');
var currentOption = all;
const transitOption = document.querySelector('#transit')
const canceledOption = document.querySelector('#cancel')
const allOption = document.querySelector('#all')
const deliveredOption = document.querySelector('#deliver')
const ordersTitle = document.querySelector('#title')



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
    currentOption = option;
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
        <span class="statuses"><span class="status">${status}</span><span class="cancel-btn"><img src="static/img/cancel.png"></span></span>`;
        

        var orderId = orderDiv.querySelector('.order-id');
        orderDiv.addEventListener('click', ()=>{
            viewOrder();


        });

        const statusSpan = orderDiv.querySelector('.status');
        const cancelBtn =  orderDiv.querySelector('.cancel-btn');

        // Display different colors for different status
        if (status == canceled){
            statusSpan.classList.add('canceled')            
        }
        if(status == inTransit){
            cancelBtn.style.display = 'grid'
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
    transitOption.addEventListener('click', ()=>{
        DisplayOrders(inTransit)
    });

    deliveredOption.addEventListener('click', ()=>{
        DisplayOrders(delivered)
    });

    canceledOption.addEventListener('click', ()=>{
        DisplayOrders(canceled)
    });

    allOption.addEventListener('click', ()=>{
        DisplayOrders(all)
    });
}

// Function to view a single order

function viewOrder(){
    allOrdersDiv.innerHTML = ''
    ordersTitle.style.display = 'none';
    allOrdersDiv.style.marginTop = '50px';
    const singleOrder = document.createElement('div')
    singleOrder.id = 'single-order';
    singleOrder.innerHTML = 
    `<span class="heading">Order Number: <span id="order-no">435</span></span>
    <div id="delivery-stts" class="detail">
        <span class="label">Delivery status:</span>
        <span class="content "><span id="stts-color" class="in-transit">In-transit</span></span>
    </div>
    <div id="recpnt-name" class="detail">
        <span class="label">Recepient Name:</span>
        <span class="content">Joshua Moracha</span>
    </div>
    <div id="recpnt-no" class="detail">
        <span class="label">Recepient Number:</span>
        <span class="content">0734543564</span>
    </div>
    <div id="pickup-location" class="detail">
        <span class="label">Pickup Location:</span>
        <span class="content">5-5332-532</span>
    </div>
    <div id="current-location" class="detail">
        <span class="label">Current Locaton:</span>
        <span class="content">Mai Mahiu</span>
    </div>
    <div id="dest-location" class="detail">
        <span class="label">Destination Location:</span>
        <span class="content"><input id="dest-input" type="text" value="3-5334-533"><span><span id="save-btn" class="invincible">Save</span></span></span>
    </div>
    </div>`
    var inputDiv = singleOrder.querySelector('#dest-input');
    var saveBtn = singleOrder.querySelector('#save-btn');
    inputDiv.addEventListener('input', ()=>{
        saveBtn.style.display = 'grid';       
    });
    allOrdersDiv.appendChild(singleOrder);

}


// Listen to DOMContentLoaded event

document.addEventListener('DOMContentLoaded', () =>{    
    DisplayOrders(all);
    AddEventListeners();
    
});
