let block_catalog = document.querySelector(".block-catalog");
let menu_catalog = document.querySelector(".dropdown-menu");
let firstUl = document.querySelector('ul.navbar-nav.ms-auto.text-center');
let toggler_nav = document.querySelector(".navbar-toggler");
let svg_down_button = document.querySelector('.upper-items svg');
let catalog_link = document.querySelector("#navbarDropdownMenuLink");
let footer_catalog_items = document.querySelector(".footer-catalog-items");

let mybutton = document.getElementById("myBtn1");




// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('a[href="/about-us"]').addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelector('#about-us-section').scrollIntoView({ behavior: 'smooth' });
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('a[href="/contacts"]').addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelector('#contacts-down').scrollIntoView({ behavior: 'smooth' });
    });
  });

svg_down_button.addEventListener('click', function(){
    let targetBlock = document.querySelector('.catalog');
    
    if (targetBlock) {
        targetBlock.scrollIntoView({ behavior: 'smooth' });
    }
});

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
        let catalog_items = document.createElement("div");
        let menu_catalog_items = document.createElement("li");
        
        let footer_catalog = document.createElement("li");
        catalog_items.classList.add("catalog-items");
        catalog_items.innerHTML = `
            <div class="cat-item" tabindex="${i + 9}">
                <h2>${catalog2[i].cname}</h2>
                <p>Відкрити категорію 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
                </p>
            </div>
        `;
        catalog_items.style.backgroundImage = "url('img/catalog/"+ (i+1) + ".jpg')";
        
        menu_catalog_items.innerHTML=`
            <li><a class="dropdown-item" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></li>
        `;
        footer_catalog.innerHTML = `<span><a class="catalog-footer-span" href="/catalog/${catalog2[i].cname}">${catalog2[i].cname}</a></span>`;
        menu_catalog.appendChild(menu_catalog_items);
        footer_catalog_items.appendChild(footer_catalog);
        block_catalog.appendChild(catalog_items);
        catalog_items.addEventListener('click', function () {
            window.location.href = '/catalog/' + catalog2[i].cname;
        });
        
    }
};

let send_message = document.querySelector(".send-message");
send_message.addEventListener('click', function(){
  let name = document.querySelector("#name-feedback").value;
  let email = document.querySelector("#email-feedback").value;
  let text_message = document.querySelector(".text-message").value;
  if(name != "" && email != "" && text_message != ""){
      fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: name, email, text_message }),
    })
    .then(response => response.text())
    .then(data => {
        const toastLiveExample = document.getElementById('liveToast');
        toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
        document.querySelector(".toast-body").innerText = "Повідомлення відправлено успішно";
        document.querySelector(".me-auto").innerText = "Успішно";
        
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    })
    .catch((error) => {
        console.error('Помилка:', error);
    });
}else{
  const toastLiveExample = document.getElementById('liveToast');
  toastLiveExample.style.backgroundColor = "rgb(255, 187, 156)";
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
}
});