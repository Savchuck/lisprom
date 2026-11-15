let toggler_nav = document.querySelector(".navbar-toggler");
let catalog_link = document.querySelector("#navbarDropdownMenuLink");
let menu_catalog = document.querySelector(".dropdown-menu");

toggler_nav.addEventListener('click', function(){
    if(firstUl.classList.contains('text-center'))
    {
        firstUl.classList.remove('text-center');}
});

catalog_link.addEventListener('mouseenter', function(){
    menu_catalog.classList.add('show');
    menu_catalog.addEventListener('mouseleave', function(){
        menu_catalog.classList.remove('show');
    })
    
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('/getOrder').then(response => response.json()).then(data => {
    
        let orderTable = `<table class = "orderTable" border=2 cellspacing="2" width="90vw">
            <tr>
            <th>Назва</th><th>Кількість</th><th>Розміри</th><th>Тип деревини</th><th>Ціна</th>
            </tr>
        `;
        let totalSum = 0;
        console.log(data);
        data.forEach(item => {
            let row = ""
            item.forEach(elem => {
                row += `<tr><td>${elem.name}</td><td>${elem.quantity}</td><td>${elem.size}</td><td>${elem.type}</td><td>${elem.price}</td></tr>`;
                
            totalSum += parseFloat(elem.price);
            })
            orderTable += row;
        });
        orderTable += "</table>";
        
        document.querySelector('table#orderTable').outerHTML = orderTable;
        document.getElementById('totalSum').innerText = totalSum.toFixed(2);
    }).catch(error => {
        console.error('Помилка при отриманні даних замовлення:', error);
    });
    
    fetch('/check_login_status')
      .then(response => response.json())
      .then(data => {
        if(data.loggedIn){
          // Якщо користувач увійшов в систему, перенаправити його на відповідну сторінку
          document.querySelector("#username").value = data.userFullName;
          document.querySelector("#phone").value = data.userPhone;
          document.querySelector("#email").value = data.userEmail;
      }
      })
      .catch(error => {
          console.error('Помилка перевірки статусу входу:', error);
      });
});

// Код для обробки форми оформлення замовлення
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = this.username.value;
    const number = this.phone.value;
    const email = this.email.value;
    const address = this.address.value;

    // Отримання даних про товари з таблиці
    const products = [];
    let orderTable = Array.from(document.querySelectorAll('table.orderTable tbody tr'));


    orderTable.forEach(row => {
        let pname = row.cells[0].innerText; // Назва товару
        let quantity = row.cells[1].innerText; // Кількість

        // Отримуємо розміри товару з інших комірок і формуємо об'єкт замовлення
        let details = row.cells[2].innerText;
        products.push({ pname, quantity, details });
    });
    console.log(products);
    // Запит на сервер для збереження замовлення
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, number, email, address, products })
    })
    .then(response => {
        if (response.ok) {
            const toastLiveExample = document.getElementById('liveToast');
            toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
            document.querySelector(".toast-body").innerText = "Замовлення успішно оформлено!";
            document.querySelector(".me-auto").innerText = "Успішно";
            
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
            
        } else {
            const toastLiveExample = document.getElementById('liveToast');
            toastLiveExample.style.backgroundColor = "rgb(255, 187, 156)";
            document.querySelector(".toast-body").innerText = "Помилка при обробці замовлення";
            document.querySelector(".me-auto").innerText = "Помилка";
            
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        }
    })
    .catch(error => {
        const toastLiveExample = document.getElementById('liveToast');
            toastLiveExample.style.backgroundColor = "rgb(255, 187, 156)";
            document.querySelector(".toast-body").innerText = error;
            document.querySelector(".me-auto").innerText = "Помилка при відправленні замовлення";
            
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
    });
});


fetch('/data')
      .then(response => response.json())
      .then(data => {
        get_catalog(data)
        }).catch(error => console.error('Error:', error));

let footer_catalog_items = document.querySelector(".footer-catalog-items");
function get_catalog(catalog2){
    for(let i=0;i<catalog2.length;i++){
        
        let footer_catalog = document.createElement("li");
        let menu_catalog_items = document.createElement("li");
        menu_catalog_items.innerHTML=`
            <li><a class="dropdown-item" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></li>
        `;
        footer_catalog.innerHTML = `<span><a class="catalog-footer-span" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></span>`;
        menu_catalog.appendChild(menu_catalog_items);
        footer_catalog_items.appendChild(footer_catalog);
    }
}