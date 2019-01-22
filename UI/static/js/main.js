'use strict'

/* Global variables*/
var pricePerKg = 200;
// display modes
var edit = 'edit';
var view = 'view';
// Display order options
var all = 'all';
var canceled = 'Canceled';
var delivered = 'Delivered';
var inTransit = 'In-transit';
var singleOrder = 'order';
var admin = 'admin';
var client = 'client';

// Elements
const allOrdersDiv = document.querySelector('#all-orders')
const options = document.querySelectorAll('.option');
var currentOption = all;
const ordersTitle = document.querySelector('#title')
const orderStatistics = document.querySelector('.order-statistics');
const pageTitle = document.querySelector('title').innerText

const transitOption = document.querySelector('#transit')
const canceledOption = document.querySelector('#cancel')
const allOption = document.querySelector('#all')
const deliveredOption = document.querySelector('#deliver')

const adminTransitOption = document.querySelector('#admin-transit')
const adminCanceledOption = document.querySelector('#admin-cancel')
const adminAllOption = document.querySelector('#admin-all')
const adminDeliveredOption = document.querySelector('#admin-deliver')

// Get passed variables
var url = new URL(document.URL);
let token = url.searchParams.get('token');
let userId = url.searchParams.get('id');

// Fuction to check if an object is empty
function isEmpty(dict) {
    return Object.getOwnPropertyNames(dict) == 0;
}

// Function to display order from
function DisplayOrders(user, option) {
    allOrdersDiv.style.marginTop = '0px';
    ordersTitle.style.display = 'grid';
    currentOption = option;
    allOrdersDiv.innerHTML = '';
    let getOrdersUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/users/' + userId.toString() + '/parcels';
    var actionButton = '<span class="action-btn cancel-btn">Cancel</span>';
    if (user == admin) {
        actionButton = '<span class="action-btn edit-btn" >Edit</span>';
        getOrdersUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/parcels'; 
    }
    // Fetch orders
    fetch(getOrdersUrl, {
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'token': token
        }
    } )
    .then((res) => {
        if (res.status == 404){
            res.json()
            .then((data) => {                
            console.log(data.message)
            }) 
        } else if (res.status == 200){
                res.json().then((data) => {
                loopThroughOrders(data.orders)
                })            
        }
    })
    .catch((err) => console.log(err)) 

    //Loop through orders and display them
    function loopThroughOrders(allOrders){
        for (var index in allOrders) {
            var order = allOrders[index];
            var orderId = order.order_id;
            var pickupAdd = order.pickup;
            var destAdd = order.dest;
            var weight = order.weight;
            var price = weight * pricePerKg;
            var status = order.status;
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML =
                `<span class="order-id">${orderId}</span>
                <span class="pickup">${pickupAdd}</span>
                <span class="Destination">${destAdd}</span>
                <span><span class="weight">${weight}</span> Kgs</span>
                <span><span>Kshs</span> <span class="price"> ${price}</span></span>
                <span class="statuses"><span class="status">${status}</span>${actionButton}</span></span>`;
    
    
            orderDiv.addEventListener('click', (e) => {
                var clickedOrder = e.target.parentNode.querySelector('.order-id')
                if (clickedOrder){
                    var clickedOrderId = clickedOrder.innerHTML               

                if(e.target.classList.contains('edit-btn')){
                    viewOrder(user, edit, clickedOrderId);
                }else{
                    viewOrder(user, view, clickedOrderId);
                }
            }
            });
    
            const statusSpan = orderDiv.querySelector('.status');
            const actionBtn = orderDiv.querySelector('.action-btn');
    
            actionBtn.addEventListener('click',
                () => {
                    console.log('edited')
                })
    
            // Display different colors for different status
            if (status == canceled) {
                statusSpan.classList.add('canceled')
            }
            if (status == inTransit) {
                actionBtn.style.display = 'grid'
                statusSpan.classList.add('in-transit')
            }
            if (status == delivered) {
                statusSpan.classList.add('delivered')
            }
            
            // Filter viewed orders
            if (option == all) {
                allOrdersDiv.appendChild(orderDiv);
            }
            if (status == option) {
                allOrdersDiv.appendChild(orderDiv);
            }
    
        }
    }

}




// Add event listeners to side-panel options and order stats
function AddEventListeners(user) {

    if (user == client) {
        // Client dashboard options
        transitOption.addEventListener('click', () => {
            DisplayOrders(client, inTransit)
        });

        deliveredOption.addEventListener('click', () => {
            DisplayOrders(client, delivered)
        });

        canceledOption.addEventListener('click', () => {
            DisplayOrders(client, canceled)
        });

        allOption.addEventListener('click', () => {
            DisplayOrders(client, all)
        });
    }

    if (user == admin) {
        // Admin dashboard options
        adminTransitOption.addEventListener('click', () => {
            DisplayOrders(admin, inTransit)
        });

        adminDeliveredOption.addEventListener('click', () => {
            DisplayOrders(admin, delivered)
        });

        adminCanceledOption.addEventListener('click', () => {
            DisplayOrders(admin, canceled)
        });

        adminAllOption.addEventListener('click', () => {
            DisplayOrders(admin, all)
        });

    }

    // Order statistics event listener for both admin and client dashboards
    orderStatistics.addEventListener('click', (e) => {
        if (e.target.id == 'dlvd') {
            DisplayOrders(user, delivered);
        }
        if (e.target.id == 'cncld') {
            DisplayOrders(user, canceled);
        }
        if (e.target.id == 'trst') {
            DisplayOrders(user, inTransit);
        }
    });
}

// Function to view a single order

function viewOrder(user, mode, orderId) {
    allOrdersDiv.innerHTML = ''
    ordersTitle.style.display = 'none';
    allOrdersDiv.style.marginTop = '50px';
    const singleOrder = document.createElement('div');
    singleOrder.id = 'single-order';
    singleOrder.className = 'single-order'
    var orderUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels/${orderId}`

    fetch(orderUrl, {
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'token': token
        }
    } )
    .then((resp) => resp.json())
    .then((data) => {
        var order = data.order;
        display(order);

    })

    // Function to display order
    function display(order){
        console.log(order)
        // Order details
        var dest = order.dest;
        var currentLocation = order.curr_loc;
        var pickupLocation = order.pickup;
        var weight = order.weight;
        var status = order.status;
        var orderId = order.order_id;
        var recepientName = order.recepient_name;
        var userId = order.userId;
        var receipientNo = order.recepient_no;

        var destLocationHtml = `<span id="">${dest}</span>`;
        var currentLocationHtml = `<span class="content">${currentLocation}</span>`;
        var statusHtml = `<span><span id="stts-color" class="${status.toLowerCase()}">${status}</span></span>`;
        var editModeInputLabel = '';
        var editModeInputLabelAdmin = '';
    
        
        // All view modes
        if (mode == view) {
            singleOrder.classList.add('view-mode')
        }
    
        if (mode == edit) {
            singleOrder.classList.add('edit-mode');
        }
    
        // Client edit mode
        if (mode == edit && user == client) {
            editModeInputLabel = 'edit-input-label'
            destLocationHtml = `<input id="dest-input" class="edit-input" type="text" value="${dest}">`;
        }
        
        // Admin view mode
        if (mode == edit && user == admin) {
            editModeInputLabelAdmin = 'edit-input-label'
            singleOrder.id = 'admin-single-order';
            singleOrder.className = 'single-order'
            currentLocationHtml = `<input id="curr-loc-input" class="edit-input" type="text" value="${currentLocation}">`;
            statusHtml = ` <span><span><select id="status-select">
            <option value="intransit">In-transit</option>
            <option value="delivered">Delivered</option>
          </select></span></span> `;
          singleOrder.classList.add('edit-mode');
    
        }
    
        // Both edit and view mode and both users 
        singleOrder.innerHTML =
            `<span class="heading">Order Number: <span id="order-no">${orderId}</span><span class="edit-button invincible">Edit</span></span>
        <div id="delivery-stts" class="detail">
            <span class="label">Delivery status:</span>
            <span class="content split">${statusHtml}<span><span id="status" class="save-btn invincible">Save</span></span></span>
        </div>
        <div id="recpnt-name" class="detail">
            <span class="label">Recepient Name:</span>
            <span class="content">${recepientName}</span>
        </div>
        <div id="recpnt-no" class="detail">
            <span class="label">Recepient Number:</span>
            <span class="content">${receipientNo}</span>
        </div>
        <div id="pickup-location" class="detail">
            <span class="label">Pickup Location:</span>
            <span class="content">${pickupLocation}</span>
        </div>
        <div id="current-location" class="detail">
            <span class="label ${editModeInputLabelAdmin}">Current Locaton:</span>
            <span class="content split">${currentLocationHtml}<span><span id="save-curr-loc" class="save-btn invincible" >Save</span></span></span>
        </div>
        <div id="dest-location" class="detail">
            <span class="label ${editModeInputLabel}">Destination Location:</span>
    <span class="content split">${destLocationHtml}<span><span id="dest-loc" class="save-btn invincible">Save</span></span></span>
        </div>
        </div>`
        
        
    
        if (mode == view && pageTitle == 'Dashboard'){
            const statusText = singleOrder.querySelector('#stts-color').innerHTML
            const editButton = singleOrder.querySelector('.edit-button');
    
            // If the parcel hasnt been delivered
            if(statusText == inTransit){
            editButton.style.display = 'inline'
    
            editButton.addEventListener('click', ()=>{
            viewOrder(client, edit, orderId);
            });
        }
    
    
        if (mode == edit){
            editButton.style.display = 'none';
        }
        }
       
        
        // Client edit mode
        if (mode == edit && user == client) {
            // Get elements
            const destInputDiv = singleOrder.querySelector('#dest-input');
            const saveDestBtn = singleOrder.querySelector('#dest-loc');
    
    
        
    
            // Add event listeners       
            destInputDiv.addEventListener('input', () => {
                saveDestBtn.style.display = 'grid';
            });
        }
    
        // Admin edit mode
        if(mode == edit && user == admin){
            // Get elements
            const statusSelector = singleOrder.querySelector('#status-select');
            const currLocationInput = singleOrder.querySelector('#curr-loc-input');
            const saveStatusBtn = singleOrder.querySelector('#status');
            const saveCurrLocation = singleOrder.querySelector('#save-curr-loc')
    
            // Add event listeners
            statusSelector.addEventListener('change', ()=>{
                saveStatusBtn.style.display = 'grid'            
            });
    
            currLocationInput.addEventListener('input', ()=>{
                saveCurrLocation.style.display = 'grid';
            });
    
    
        }
        allOrdersDiv.appendChild(singleOrder);
    }

}


// Listen to DOMContentLoaded event

document.addEventListener('DOMContentLoaded', () => {
    if (pageTitle == 'Admin Dashboard') {
        AddEventListeners(admin);
        DisplayOrders(admin, all);
    } else {
        AddEventListeners(client);
        DisplayOrders(client, all);
    }


});