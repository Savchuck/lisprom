let menu_catalog = document.querySelector(".dropdown-menu");
let catalog_link = document.querySelector("#navbarDropdownMenuLink");
let basket_button = document.querySelector(".basket");
let basket_block = document.querySelector(".basket-block");
let basket_block_items = document.querySelector(".basket-block-items");
let isBasketVisible = false;
let delete_buttons = document.querySelectorAll(".delete-button");
let order_basket = document.querySelector(".order-basket");
let toggler_nav = document.querySelector(".navbar-toggler");
let firstUl = document.querySelector('ul.navbar-nav.ms-auto.text-center');
let basket_verify = document.querySelector(".basket-verify");

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // Максимум и минимум включаются
  }

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
    // Перевіряємо, чи є дані в sessionStorage
    
    var category = document.getElementById("category").value;
    // Виконуємо запит до сервера для отримання параметрів товару за вибраною категорією
    fetch(`/parameters/${category}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let category_ID = data.categoryId;
        // Отримані параметри товару
        var parameters = data.parameters;
        console.log("url('../img/catalog/"+ category_ID + ".jpg')");
        document.querySelector(".product-block-items-left img").src = '../img/catalog/'+ category_ID + '.jpg';
        // Заповнюємо відповідні поля вибору
        var widthSelect = document.getElementById("width");
        let width_block = document.querySelector(".width-block");
        let br_width = document.querySelector(".br-width");
        let br_width_bottom = document.querySelector(".br-width-bottom");
        
        var heightSelect = document.getElementById("height");
        var lengthSelect = document.getElementById("length");
    
       
    
        // Додавання варіантів вибору для кожного параметру
        if (parameters[0].width && parameters[0].width.length > 0) {
            parameters[0].width.forEach(width => {
                var option = document.createElement("option");
                option.text = width;
                option.value = width;
                widthSelect.add(option);
            });
        } else {
            // Якщо немає даних про ширину, ховаємо поле вибору ширини
            
            width_block.style.display = 'none';
            br_width.parentNode.removeChild(br_width);
            br_width_bottom.parentNode.removeChild(br_width_bottom);
            // Тут також можна додати код для видалення підпису та інших елементів, які використовуються для вибору ширини
        }
    
        parameters[0].height.forEach(height => {
            var option = document.createElement("option");
            option.text = height;
            option.value = height;
            heightSelect.add(option);
        });
    
        parameters[0].length.forEach(length => {
            var option = document.createElement("option");
            option.text = length;
            option.value = length;
            lengthSelect.add(option);
        });
    })
    .catch(error => console.error('Error:', error));



    if(sessionStorage.length > 0) {
        // Ітеруємося через дані sessionStorage
        for(let i = 0; i < sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            let itemData = sessionStorage.getItem(key);
            let itemArray = itemData.split(',');
            
            // Створюємо новий рядок у корзині для кожного елемента
            let basket = document.createElement("table");
            basket.classList.add("basket-table");
            basket.innerHTML=`
            <tr>
                <th></th>
                <th>Товар</th>
                <th>Кількість</th>
                <th>Розміри</th>
                <th>Тип деревини</th>
            </tr>
            <tr>
                <td class="delete-button">
                    <button class="button-del">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                </button>
                </td>
                <td>${itemArray[0]}</td>
                <td>${itemArray[1]}</td>
                <td>${itemArray[2]}</td>
                <td>${itemArray[3]}</td>
            </tr>
            <tr>
                <td></td>
                <td>Ціна: </td>
                <td>${itemArray[4]}</td>
            </tr>
            `;
            
            basket_block_items.appendChild(basket);
            let price_all = document.querySelector("#price-all");
    
                price_all.innerText = parseFloat(localStorage.getItem("price")).toFixed(2);
            // Додаємо обробник подій для кнопки видалення
            const deleteButton = basket.querySelector('.button-del');
            deleteButton.addEventListener('click', function() {
                const tableRow = this.closest('table');
                const index = Array.from(basket_block_items.children).indexOf(tableRow);
                let price = parseFloat(itemArray[4]);
                tableRow.remove();
                let price_all = document.querySelector("#price-all");
                let price_add = parseFloat(price_all.innerText);
                price_add -= price;
                price_all.innerText = price_add.toFixed(2);

                // Очищаємо дані з sessionStorage
                sessionStorage.removeItem(key);
                localStorage.setItem("price", price_add.toFixed(2));
            });
        }
    }

    // Відображаємо загальну суму з localStorage
    let price_all = document.querySelector("#price-all");
    price_all.innerText = parseFloat(localStorage.getItem("price") || '0').toFixed(2);
});


    
        
            let prices_item = document.querySelector(".prices-item");
            quantity.addEventListener("change", function(){


                let length = document.getElementById("length").value;
                let widthSelect = document.getElementById("width");
                let width;
                let height = document.getElementById("height").value;
                let type = document.getElementById("type").value;
                let quantity = document.getElementById("quantity");
                let name = document.querySelector(".product-block-items-right h1").textContent;
                let size;

                if (quantity.value == 0 || quantity.value == '') {
                    quantity.value = 1;
                }

                if (widthSelect.value == 'default' && widthSelect.style.display !== 'none') {
                    width = null;
                    size = `${height}*${length}`;
                } else {
                    width = widthSelect.value;
                    size = `${height}*${width}*${length}`;
                }
                fetch(`/getPrice?pname=${name}&detail=${size}`)
        .then(response => response.json())
        .then(data => {
                let price = parseFloat(data.price);
                if(type === "Дуб"){
                    price += (parseFloat(price) * 0.3);
                } else if(type === "Ясен"){
                    price += (parseFloat(price) * 0.2);
                } else if(type === "Береза"){
                    price += (parseFloat(price) * 0.2);
                }
                if (length !== 'default' && height !== 'default' && type !== 'default' && (width !== 'default' || width === null)) {
                    console.log(prices_item);
                    prices_item.innerText = (parseFloat(price) * quantity.value).toFixed(2) + " грн/шт";
                    console.log(prices_item);
                console.log("lox");
                } else {
                    const toastLiveExample = document.getElementById('liveToast');
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    toastBootstrap.show();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
            




let price_all1=document.querySelector("#price-all");


order_basket.addEventListener('click', function() {
    let length = document.getElementById("length").value;
    let widthSelect = document.getElementById("width");
    let width;
    let height = document.getElementById("height").value;
    let type = document.getElementById("type").value;
    let quantity = document.getElementById("quantity");
    let name = document.querySelector(".product-block-items-right h1").textContent;
    let size;

    if (quantity.value == 0 || quantity.value == '') {
        quantity.value = 1;
    }

    if (widthSelect.value == 'default' && widthSelect.style.display !== 'none') {
        width = null;
        size = `${height}*${length}`;
    } else {
        width = widthSelect.value;
        size = `${height}*${width}*${length}`;
    }

    console.log("Length:", length);
    console.log("Height:", height);
    console.log("Type:", type);
    console.log("Width:", width);
    console.log("Size:", size);

    if (length !== 'default' && height !== 'default' && type !== 'default' && (width !== 'default' || width === null)) {
        fetch(`/getPrice?pname=${name}&detail=${size}`)
            .then(response => response.json())
            .then(data => {
                let prices_item = document.querySelector(".prices-item");
                
                let price = parseFloat(data.price);
                if(type === "Дуб"){
                    price += (parseFloat(price) * 0.3);
                } else if(type === "Ясен"){
                    price += (parseFloat(price) * 0.2);
                } else if(type === "Береза"){
                    price += (parseFloat(price) * 0.2);
                }
                quantity.addEventListener("change", function(){
                    console.log(prices_item);
                    prices_item.innerText = parseFloat(price) * quantity;
                    console.log(prices_item);
                    
                });
                


                let itemFound = false;
                let basketItems = document.querySelectorAll('.basket-table tr');

                basketItems.forEach(function(item, index) {
                    if (item.cells[1].textContent === name &&
                        item.cells[3].textContent === size &&
                        item.cells[4].textContent === type) {

                        let existingQuantity = parseInt(item.cells[2].textContent);
                        let newQuantity = existingQuantity + parseInt(quantity.value);
                        item.cells[2].textContent = newQuantity;
                        let newPrice = newQuantity * price;
                        basketItems[index + 1].cells[2].textContent = newPrice.toFixed(2);

                        let price_all = document.querySelector("#price-all");
                        let totalPrice = parseFloat(price_all.innerText);
                        totalPrice += parseFloat(quantity.value) * price;
                        price_all.innerText = totalPrice.toFixed(2);
                        localStorage.setItem("price", totalPrice.toFixed(2));

                        itemFound = true;
                    }

                    let basket_order = document.querySelectorAll(".basket-table");
                    basket_order.forEach((elem, index) => {
                        let name_elem = elem.rows[1].cells[1].innerHTML;
                        let quantity_elem = elem.rows[1].cells[2].innerHTML;
                        let size_elem = elem.rows[1].cells[3].innerHTML;
                        let type_elem = elem.rows[1].cells[4].innerHTML;
                        let price_elem = elem.rows[2].cells[2].innerHTML;
                        sessionStorage.setItem(index, [name_elem, quantity_elem, size_elem, type_elem, price_elem]);
                    });
                });

                if (!itemFound) {
                    let basket = document.createElement("table");
                    basket.classList.add("basket-table");
                    basket.innerHTML = `
                        <tr>
                            <th></th>
                            <th>Товар</th>
                            <th>Кількість</th>
                            <th>Розміри</th>
                            <th>Тип деревини</th>
                        </tr>
                        <tr>
                            <td class="delete-button">
                                <button class="button-del">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </button>
                            </td>
                            <td>${name}</td>
                            <td>${quantity.value}</td>
                            <td>${size}</td>
                            <td>${type}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Ціна: </td>
                            <td>${(quantity.value * price).toFixed(2)}</td>
                        </tr>
                    `;

                    basket_block_items.appendChild(basket);
                    let price_all = document.querySelector("#price-all");
                    let totalPrice = parseFloat(price_all.innerText);
                    totalPrice += parseFloat(quantity.value) * price;
                    price_all.innerText = totalPrice.toFixed(2);
                    localStorage.setItem("price", totalPrice.toFixed(2));

                    const deleteButton = basket.querySelector('.button-del');
                    deleteButton.addEventListener('click', function() {
                        const tableRow = this.closest('table');
                        console.log("tableRow:", tableRow); // Debugging log

                        // Find index of the table within basket_block_items
                        let tables = document.querySelectorAll('.basket-table');
                        let index = Array.from(tables).indexOf(tableRow);
                        let rowPrice = parseFloat(tableRow.querySelector('tr:nth-child(3) td:nth-child(3)').textContent);
                        console.log(rowPrice);
                        let price_all = document.querySelector("#price-all");
                        let totalPrice = parseFloat(price_all.innerText);
                        totalPrice -= rowPrice;
                        price_all.innerText = totalPrice.toFixed(2);
                        localStorage.setItem("price", totalPrice.toFixed(2));
                        sessionStorage.removeItem(index);
                        tableRow.remove();
                    });

                    let basket_order = document.querySelectorAll(".basket-table");
                    basket_order.forEach((elem, index) => {
                        let name_elem = elem.rows[1].cells[1].innerHTML;
                        let quantity_elem = elem.rows[1].cells[2].innerHTML;
                        let size_elem = elem.rows[1].cells[3].innerHTML;
                        let type_elem = elem.rows[1].cells[4].innerHTML;
                        let price_elem = elem.rows[2].cells[2].innerHTML;
                        sessionStorage.setItem(index, [name_elem, quantity_elem, size_elem, type_elem, price_elem]);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
});


    


basket_verify.addEventListener('click', function(){
    let result = [];
    let basket_order = document.querySelectorAll(".basket-table");
    basket_order.forEach((elem) => {
        let name_elem = elem.rows[1].cells[1].innerText;
        let quantity_elem = elem.rows[1].cells[2].innerText; 
        let size_elem = elem.rows[1].cells[3].innerText;
        let type_elem = elem.rows[1].cells[4].innerText;
        let price_elem = elem.rows[2].cells[2].innerText;
        
        result.push({
            "name": name_elem,
            "quantity": quantity_elem,
            "size": size_elem,
            "type": type_elem,
            "price": price_elem
        });
    })
    console.log(result);
    fetch('/saveOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    }).then(response => {
        if (response.ok) {
            // Перенаправлення на сторінку оформлення замовлення
            window.location.href = '/order';
        } else {
            console.error('Помилка при збереженні замовлення');
        }
    });
    localStorage.clear();
    sessionStorage.clear();
});




basket_button.addEventListener('click', function(){
    if(!isBasketVisible){
        basket_block.classList.remove('hidden');
        basket_block.style.display = "block";
        isBasketVisible = true;
        basket_button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="rgb(234, 222, 207)" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
        `;
    }
    else{ 
        basket_block.classList.add('hidden');
        basket_block.style.display = "none";
        isBasketVisible = false;
        basket_button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="rgb(234, 222, 207)" class="bi bi-cart" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
        </svg>
        `;
    }
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

