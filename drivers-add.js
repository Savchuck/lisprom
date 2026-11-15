let block_login = document.querySelector(".block-login");
let driver_add_button = document.querySelector(".driver-add-button");
let clicked = false;
let delete_driver_block = document.querySelectorAll(".driver");
delete_driver_block.forEach(elem =>{
    
    
    let button = elem.querySelector(".delete-driver");
    
    let name = elem.querySelector("h6").textContent;
    let email = elem.querySelector("p").textContent;
    button.addEventListener("click", function(){
        document.querySelector("#sure").addEventListener("click", function(){
        fetch('/delete-driver', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
          })
            .then(response => response.text())
            .then(data => {
                
                
                const toastLiveExample = document.getElementById('liveToast');
                toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
                document.querySelector(".toast-body").innerText = "Водій успішно видалений";
                document.querySelector(".me-auto").innerText = "Успішно";
                
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show(); 
            });
            setTimeout(function() {
                location.reload();
            }, 3000);
        })
    });

    
});
driver_add_button.addEventListener('click', function(){
    const plusIcon = document.getElementById('plus-icon');
    plusIcon.classList.toggle('rotate');
    driver_add_button.classList.toggle('rotate');
    if(clicked === false){
        block_login.style.display = "block";
        clicked = true;
    }
    else{
        clicked=false;
        block_login.style.display = "none";
    }
    
});

function register() {
    const fullName = document.getElementById("inputNAME").value;
    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;
    const repeatPassword = document.getElementById("exampleInputPassword2").value;

    if (password !== repeatPassword) {
        alert("Пароль і повторний пароль не співпадають");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: fullName, email, password, repeat_password: repeatPassword }),
    })
    .then(response => response.text())
    .then(data => {
        const toastLiveExample = document.getElementById('liveToast');
        toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
        document.querySelector(".toast-body").innerText = "Водій успішно доданий";
        document.querySelector(".me-auto").innerText = "Успішно";
        
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    })
    .catch((error) => {
        console.error('Помилка:', error);
    });
    setTimeout(function() {
        location.reload();
    }, 3000);
    
}

