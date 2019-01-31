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
var pending = 'Pending';
var rejected = 'Rejected';
// Change order status options
var accept = 'accept';
var reject = 'reject';
var deliver = 'deliver';
var cancel = 'cancel';
var singleOrder = 'order';
var admin = 'admin';
var client = 'client';
// Snack bar info types
var error = 'error';
var success = 'success';
var plain = 'plain';


// Elements
const allOrdersDiv = document.querySelector('#all-orders')
const options = document.querySelectorAll('.option');
var currentOption = all;
const ordersTitle = document.querySelector('#title')
const orderStatistics = document.querySelector('.order-statistics');
const pageTitle = document.querySelector('title').innerText;
const createOrderBtn = document.querySelector('#new-order');
const rejectedOption = document.querySelector('#reject');
const newOption = document.querySelector('#new');
const dashboardCont = document.querySelector('.dash-cont .cont');
const notificationOption = document.querySelector('#notifications-option')
// Client dashboard elements
const transitOption = document.querySelector('#transit')
const canceledOption = document.querySelector('#cancel')
const allOption = document.querySelector('#all')
const deliveredOption = document.querySelector('#deliver')
// Admin dashboard elements
const adminTransitOption = document.querySelector('#admin-transit')
const adminCanceledOption = document.querySelector('#admin-cancel')
const adminAllOption = document.querySelector('#admin-all')
const adminDeliveredOption = document.querySelector('#admin-deliver')
// Snackbar elements
var infoMsgDiv = document.querySelector('.info-msg');
var infoMsgSpan = document.querySelector('.info');
// Get passed variables
let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('id');
let username = sessionStorage.getItem('username');

// Fuction to check if an object is empty
function isEmpty(dict) {
    return Object.getOwnPropertyNames(dict) == 0;
}

// Function to display order from
function DisplayOrders(user, option) {
    allOrdersDiv.style.marginTop = '0px';
    ordersTitle.style.display = 'grid';
    currentOption = option;
    var actionButtons = `<span class="action-buttons"><span class="action-btn accept">accept</span><span class="action-btn reject">reject</span></span>`
    allOrdersDiv.innerHTML = '';
    let getOrdersUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/users/' + userId.toString() + '/parcels';
    var actionButton = '<span class="action-btn cancel-btn">Cancel</span>';
    if (user == admin) {
        actionButton = '<span class="action-btn" >Edit</span>';
        getOrdersUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/parcels'; 
    }

    document.querySelector('.acc-name').innerText = username.charAt(0).toUpperCase() + username.slice(1);
    document.querySelector('.init').innerText = username.slice(0, 1).toUpperCase();

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
            showSnackbar(error, data.message)
            }) 
        } else if (res.status == 200){
                res.json().then((data) => {
                setStats(data.orders);
                loopThroughOrders(data.orders);
                })            
        } else if (res.status == 401){
            res.json().then((data) => {
                showSnackbar(error, data.message)
                window.location.href = 'login.html';
                });   
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
            var statusHtml = `<span class="statuses"><span class="status">${status}</span></span>`
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML =
                `<span class="order-id">${orderId}</span>
                <span class="pickup">${pickupAdd}</span>
                <span class="Destination">${destAdd}</span>
                <span><span class="weight">${weight}</span> Kgs</span>
                <span class="price-span"><span>Kshs</span> <span class="price"> ${price}</span></span>
                <span class="status-column">${statusHtml}</span>`;
    
    
            orderDiv.addEventListener('click', (e) => {
                var clickedOrder = e.target.parentNode.querySelector('.order-id')
                var clickedOrderCancel = e.target.parentNode.parentNode.querySelector('.order-id')
                if (clickedOrder){
                    var clickedOrderId = clickedOrder.innerHTML               

                if(e.target.classList.contains('cancel-btn')){
                    changeOrderStatus(user, cancel, clickedOrderId);
                }else{
                    viewOrder(user, view, clickedOrderId);
                }
            }
            });
            
            const statusColumn = orderDiv.querySelector('.status-column');
            var statusSpan = orderDiv.querySelector('.status');
            const actionBtn = orderDiv.querySelector('.action-btn');
            // Display different colors for different status           
            statusSpan.classList.add(status.toLowerCase());

            if (status == pending && user == admin){
                statusSpan.onmouseover =  () => {
                    statusColumn.innerHTML = actionButtons;
                    var actionBtnsSpan = statusColumn.querySelector('.action-buttons');
                    var rejectBtn = statusColumn.querySelector('.reject');
                    var acceptBtn = statusColumn.querySelector('.accept');

                    acceptBtn.onclick = e => {
                        orderId = e.target.parentNode.parentNode.parentNode.querySelector('.order-id').innerHTML;
                        changeOrderStatus(false, user, accept, orderId);
                        actionBtnsSpan.disabled = true;
                        console.log(accept)
                    }

                    rejectBtn.onclick = e => {
                        orderId = e.target.parentNode.parentNode.parentNode.querySelector('.order-id').innerHTML;
                        changeOrderStatus(false, user, reject, orderId);
                        actionBtnsSpan.disabled = true;
                        console.log(reject)
                    }

                }

                statusColumn.onmouseleave = () =>{
                    var statuses = document.createRange().createContextualFragment(statusHtml);
                    statusSpan = statuses.querySelector('.status');
                    statusSpan.classList.add('pending');
                    statusSpan.innerText = 'Pending'
                    statusSpan.onmouseover = () => statusColumn.innerHTML = actionButtons;
                    statusColumn.innerHTML = '';
                    statusColumn.appendChild(statuses);
                }
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
    newOption.addEventListener('click', () => {
        DisplayOrders(user, pending);
    });

    rejectedOption.addEventListener('click', () => {
        DisplayOrders(user, rejected)
    });
    if (user == client) {
        // Client dashboard options
        createOrderBtn.addEventListener('click', () => {
            window.location.href = 'create-order.html';
        })
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

    notificationOption.onclick = showNotifications

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
    allOrdersDiv.style.marginTop = '30px';
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
    .then(res => {
        if (res.status == 200){
            res.json()
            .then(data => display(data.order));
        } else if (res.status == 401){
            res.json()
            .then(data => showSnackbar(error, data.message))
            window.location.href = 'login.html';            
        } else {
            res.json()
            .then(data => showSnackbar(error, data.message))
        }
    })
    

    // Function to display order
    function display(order){
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
        var statusBtnId = '';
        var statusAction = '';
    
        
        // All view modes
        if (mode == view) {
            singleOrder.classList.add('view-mode')
        }
        // Edit mode
        if (mode == edit) {
            // Client edit mode
            singleOrder.classList.add('edit-mode');
            if(user == client){
                editModeInputLabel = 'edit-input-label'
                destLocationHtml = `<input id="dest-input" class="edit-input" type="text" value="${dest}">`;
                statusBtnId = 'cancel-btn';
                statusAction = 'Cancel'
            }
            // Admin edit mode
            if(user == admin){
                editModeInputLabelAdmin = 'edit-input-label'
                singleOrder.id = 'admin-single-order';
                singleOrder.className = 'single-order'
                currentLocationHtml = `<input id="curr-loc-input" class="edit-input" type="text" value="${currentLocation}">`;
                singleOrder.classList.add('edit-mode');
                statusBtnId = 'deliver-btn';
                statusAction = 'Deliver';
                }

        } 
        
        // Both edit and view mode and both users 
        singleOrder.innerHTML =
            `<span class="heading">Order Number: <span id="order-no">${orderId}</span><span class="edit-button invincible">Edit</span></span>
        <div id="delivery-stts" class="detail">
            <span class="label">Delivery status:</span>
            <span class="content split">${statusHtml}<span><span id="${statusBtnId}" class="status-btn invincible">${statusAction}</span></span></span>
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
    <span class="content split">${destLocationHtml}<span><span id="save-dest-loc" class="save-btn invincible">Save</span></span></span>
        </div>
        </div>`
        
        const editButton = singleOrder.querySelector('.edit-button'); 
        const saveCurrLocationBtn = singleOrder.querySelector('#save-curr-loc');
       
        // View mode
        if (mode == view){
            const statusText = singleOrder.querySelector('#stts-color').innerHTML    
            // If the parcel hasnt been delivered
            if(statusText == inTransit){
            editButton.style.display = 'inline';

            if (pageTitle == 'Dashboard'){
                editButton.addEventListener('click', ()=>{
                    viewOrder(client, edit, orderId);
                    });
            } else if(pageTitle == 'Admin Dashboard'){
                editButton.addEventListener('click', ()=>{
                    viewOrder(admin, edit, orderId);
                    });
            }
        }
        }
       
        
        // edit mode
        if (mode == edit) {
            // Client edit mode
            if(user == client){
                // Get elements
                const destInputDiv = singleOrder.querySelector('#dest-input');
                const saveDestBtn = singleOrder.querySelector('#save-dest-loc'); 
                const cancelBtn = singleOrder.querySelector('#cancel-btn');                  
                //show cancel button
                cancelBtn.style.display = 'grid';
                // Add event listeners       
                destInputDiv.addEventListener('input', () => {
                    saveDestBtn.style.display = 'grid';
                });
                saveDestBtn.addEventListener('click', () => {
                    var destLoc = destInputDiv.value;
                    saveLocation(user, destLoc, orderId);
                });
                cancelBtn.addEventListener('click', () => {
                    changeOrderStatus(true, user,cancel, orderId);
                });


            }
        
            if (user == admin){
                // Get elements
                const currLocationInput = singleOrder.querySelector('#curr-loc-input');
                const deliverBtn = singleOrder.querySelector('#deliver-btn');
                const saveCurrLocation = singleOrder.querySelector('#save-curr-loc')
                // show deliver button
                deliverBtn.style.display = 'grid'
                // Add event listeners       
                currLocationInput.addEventListener('input', ()=>{
                    saveCurrLocation.style.display = 'grid';
                });
                saveCurrLocationBtn.addEventListener('click', () => {
                    var currentLoc = currLocationInput.value;
                    saveLocation(user, currentLoc, orderId);
                });
                deliverBtn.addEventListener('click', () => {
                    changeOrderStatus(true, user, deliver, orderId);
                });
        
            }
            
        }

        // Add created element to DOM
        allOrdersDiv.appendChild(singleOrder);
    }

}


function saveLocation(user, location, order_id){
    var saveLocationUrl = '';
    if (user == admin){
        saveLocationUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels/${order_id}/PresentLocation`;
        var payload = {curr_location: location}
     }else{
        saveLocationUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels/${order_id}/destination`;
        var payload = {dest_location: location}
     }     
     // Make request
     fetch(saveLocationUrl, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        'token': token
        },
        body: JSON.stringify(payload)
    })
    .then((resp) => {
        if (resp.status == 200){
            resp.json()
            .then(data => showSnackbar(success, data.message));
        } else {
            resp.json()
            .then(data => showSnackbar(success, data.message));
        }        
    })
    .catch((error) => console.log(error))
}

// Function to change order status
function changeOrderStatus(viewOrders=true, user, action, orderId){
    var changeStatusUrl;
    changeStatusUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/parcels/${orderId}/${action}`;

    // Make request
    fetch(changeStatusUrl, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        'token': token
        },
    })
    .then((resp) => {
        
        if (resp.status == 200){
            resp.json()
            .then(data => showSnackbar(success, data.message))
            if (viewOrders){
                viewOrder(user, view, orderId);
            }else{
                DisplayOrders(user, all);
            }
            
        }else{
            resp.json()
            .then(data => showSnackbar(error, data.message))
        }
        
        
    })
    .catch((error) => console.log(error))    
    
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

var deliveredStatSpan = document.querySelector('#delivered-stat');
var canceledStatSpan = document.querySelector('#canceled-stat');
var inTransitStatSpan = document.querySelector('#intransit-stat');
var allOrdersStatSpan = document.querySelector('#all-stat');
var rejectedStatSpan = document.querySelector('#reject-stat');
var newStatSpan = document.querySelector('#new-stat');

function setStats(orders){
    var deliveredStat = 0;
    var canceledStat = 0;
    var allStat = orders.length;
    var inTransitStat = 0;
    var newStat = 0;
    var rejectedStat = 0;

    orders.forEach(order => {
        if (order['status'] == canceled){
            canceledStat ++;
        } else if (order['status'] == delivered){
            deliveredStat ++;
        } else if (order['status'] == inTransit){
            inTransitStat ++;  
        } else if (order['status'] == pending){
            newStat ++;  
        } else if (order['status'] == rejected){
            rejectedStat ++;  
        }    
    });
    deliveredStatSpan.innerText = deliveredStat;
    canceledStatSpan.innerText = canceledStat;
    inTransitStatSpan.innerText = inTransitStat;
    allOrdersStatSpan.innerText = allStat;
    newStatSpan.innerText = newStat;
    rejectedStatSpan.innerText = rejectedStat;
}

// Display notifications function
function showNotifications(){
    allOrdersDiv.innerHTML = ''
    allOrdersDiv.style.marginTop = '0'
    ordersTitle.style.display = 'none';
    var notificationsTitleDiv = document.createElement('div');
    notificationsTitleDiv.id = 'noti-title';
    notificationsTitleDiv.innerHTML = `<span class="heading" id="noti-text">Notifications</span><span id="clear-btn">Clear</span>`
    notificationsTitleDiv.querySelector('#clear-btn').onclick = clearNotifications
    allOrdersDiv.appendChild(notificationsTitleDiv);
    var notificationsDiv = document.createElement('div');
    notificationsDiv.id = 'notifications';
    var notificationsUrl = 'https://pacific-harbor-80743.herokuapp.com/api/v2/users/' + userId.toString() + '/notifications';
    fetch(notificationsUrl, {
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'token': token
        }
    } )
    .then(res => {
        if (res.status == 200){
            res.json()
            .then(data => loopThroughNotifications(data.notifications))
        }else{
            res.json()
            .then(data => showSnackbar(plain, data.message))
        }
    })
    .catch(err => console.log(err))
    

    function loopThroughNotifications(notifications){
        notifications.forEach(notification => {
            var colorClass;
            var message = notification.message;
            var headerTxt = notification.message.split(' ').pop();
            var headertxts = [rejected.toLocaleLowerCase(), delivered.toLocaleLowerCase(), canceled.toLocaleLowerCase()];
            if (!headertxts.includes(headerTxt)){
                if (headerTxt == 'accepted'){
                    colorClass = 'in-transit';                    
                }else{
                    colorClass = 'plain'
                    headerTxt = 'location Changed'
                }
            }else{ 
                colorClass = headerTxt;               
            }

            headerTxt = headerTxt.charAt(0).toUpperCase() + headerTxt.slice(1) + '!';
            var notificationId = notification.notification_id;
            var order_id = notification.order_id;
            var date = notification.created_on;

            var notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification'
            notificationDiv.innerHTML = 
                `<div class="header ${colorClass}"><span class="header-txt">${headerTxt}</span><button class="close-btn">×<span class="noti-id invincible">${notificationId}</span></button></div>
                <div class="message">
                    ${message}
                    <div class="date">${date}</div>
                    <span class="order-id invincible">${order_id}</span>
                </div>`

            notificationDiv.querySelector('.message').onclick = e =>{
                var orderIdSpan = e.target.querySelector('.order-id');
                var orderId;
                if (orderIdSpan){
                    orderId = orderIdSpan.innerText; 
                    if (pageTitle == 'Dashboard'){
                        viewOrder(client, view, orderId);
                    } else {
                        viewOrder(admin, view, orderId);
                    }
                }
            } 
            notificationDiv.querySelector('.close-btn').onclick = e => {
                var clickedNotiDiv =  e.target.parentNode.parentNode;
                clickedNotiDiv.style.display = 'none';
                var notificationId = e.target.querySelector('.noti-id').innerText;
                var seeNotificationUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/notifications/${notificationId}`;
                fetch(seeNotificationUrl, {
                    method: 'PUT',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json',
                    'token': token
                    }
                })
                .then(res => res.json())
                .then(data => showSnackbar(plain, data.message));
       
            }
            notificationsDiv.appendChild(notificationDiv)
            
        });
       
    }

    allOrdersDiv.appendChild(notificationsDiv);


}

// Clear notifications function
function clearNotifications(){
    document.querySelector('#notifications').style.display = 'none';
    var clearNotificationsUrl = `https://pacific-harbor-80743.herokuapp.com/api/v2/users/${userId}/notifications`;
    fetch(clearNotificationsUrl, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        'token': token
        }
    })
    .then(res => res.json())
    .then(data => showSnackbar(plain, data.message))

}

const logoutBtn = document.querySelector('#logout')
// Logout function
logoutBtn.onclick = () => {
    sessionStorage.setItem('token', 'gibberish');
    window.location.href = 'login.html';
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
