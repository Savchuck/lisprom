let toggler_nav = document.querySelector(".navbar-toggler");
let catalog_link = document.querySelector("#navbarDropdownMenuLink");
let firstUl = document.querySelector('ul.navbar-nav.ms-auto.text-center');
let menu_catalog = document.querySelector(".dropdown-menu");
let list = document.querySelector(".list");
let right_block=document.querySelector(".catalog-right-part");
let footer_catalog_items = document.querySelector(".footer-catalog-items");

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

fetch('/data')
      .then(response => response.json())
      .then(data => {
        get_catalog(data)
        }).catch(error => console.error('Error:', error));

function get_catalog(catalog2){
    for(let i=0;i<catalog2.length;i++){
        let menu_catalog_items = document.createElement("li");
        let list_item = document.createElement("li");
        let catalog_item_block=document.createElement("div");
        
        let footer_catalog = document.createElement("li");
        catalog_item_block.classList.add("catalog-item-block");
        catalog_item_block.innerHTML=`
            <div class="catalog-item">
            <a href="/catalog/${catalog2[i].cname}">
                <button class="catalog-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                </button>
            </a>
            </div>
            <h2 style="margin-top: 20px;">${catalog2[i].cname}</h2>
        `;
        catalog_item_block.querySelector(".catalog-item").style.backgroundImage = "url('img/catalog/"+ (i+1) + ".jpg')";
        menu_catalog_items.innerHTML=`
            <li><a class="dropdown-item" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></li>
        `;
        list_item.innerHTML=`
        <li><a class="list-group-item" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></li>
        `;
        footer_catalog.innerHTML = `<span><a class="catalog-footer-span" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></span>`;
        right_block.appendChild(catalog_item_block);
        list.appendChild(list_item);
        menu_catalog.appendChild(menu_catalog_items);
        footer_catalog_items.appendChild(footer_catalog);
        
        
    }

};