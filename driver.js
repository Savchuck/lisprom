let order_block = document.querySelectorAll(".order-block");
let sort_value = document.querySelector(".form-select");
sort_value.addEventListener('change', sorting);

sorting();
function sorting(){
    
order_block.forEach( (item) =>{
    let status_order = item.querySelector(".status-order");


    
    switch(sort_value.value){
        case "1": 
            item.style.display = 'block';
            break;
        case "2":
            if(status_order.textContent === 'Передано водію')
                item.style.display = 'block';
            else{
                item.style.display = 'none';
            }
            break;
        case "3":
            if(status_order.textContent === 'Отримано водієм')
                item.style.display = 'block';
            else{
                item.style.display = 'none';
            }
            break;
        case "4":
            if(status_order.textContent === 'Доставлено')
                item.style.display = 'block';
            else{
                item.style.display = 'none';
            }
            break;
        default:
            item.style.display = 'block';
            break;
    }

});
    
}

order_block.forEach( (item) =>{
    let order_main = item.querySelector(".order-main");
    let button_add = item.querySelector('.add-order-driver');
    let status_order = item.querySelector(".status-order");
    if(status_order.textContent === 'Передано водію'){
        button_add.textContent = "Прийняти замовлення";
        button_add.addEventListener('click', function() {
        
            let orderId = item.querySelector(".id-order").textContent;
           // Assuming you have orderId stored in a data attribute
          // Send a POST request to your backend to update the status
          fetch(`/updateOrderStatus/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Отримано водієм' })
          })
          .then(response => {
            if (response.ok) {
              // Reload the page or update the UI as needed
              location.reload(); // Example: reload the page
            } else {
              // Handle error
              console.error('Failed to update order status');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
    }
    else if(status_order.textContent === 'Отримано водієм'){
        button_add.textContent = "Доставлено";
        button_add.addEventListener('click', function() {
        
            let orderId = item.querySelector(".id-order").textContent;
           // Assuming you have orderId stored in a data attribute
          // Send a POST request to your backend to update the status
          fetch(`/updateOrderStatus/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Доставлено' })
          })
          .then(response => {
            if (response.ok) {
              // Reload the page or update the UI as needed
              location.reload(); // Example: reload the page
            } else {
              // Handle error
              console.error('Failed to update order status');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
    }
    else if(status_order.textContent != 'Передано водію'){
        button_add.style.display = 'none';
    }
    

    item.querySelector(".open-order-info").addEventListener('click', function(){
        if(order_main.style.display == "" || order_main.style.display == "none"){
            
            item.style.borderRadius  = '0 0 30px 30px';
            order_main.style.display = "block";
        }
        else{
            order_main.style.display = "";
            
            item.style.borderRadius  = '0px';
        }
    
    })
    item.style.borderRadius  = '0px';
});