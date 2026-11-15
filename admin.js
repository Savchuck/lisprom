let message_main = document.querySelector(".message-main");
let back_to_main = document.querySelector(".back-to-main");
let exit_button = document.querySelector("#exit-button");
let message_block = document.querySelector(".message-block");
document.addEventListener("DOMContentLoaded", (event) => {
  fetch('/message')
      .then(response => response.json())
      .then(data => {
        get_message(data);
        }).catch(error => console.error('Error:', error));
});
function get_message(catalog2){
  for(let i=0;i<catalog2.length;i++){
    let message_block = document.createElement("div");
    message_block.classList.add("message-block");
    message_block.dataset.id = catalog2[i].id_message;
    console.log(message_block.dataset.id);
    let header = document.createElement("div");
    let main = document.createElement("div");
    header.classList.add("header");
    main.classList.add("main");
    header.innerHTML = `
        <div>        
          <h5>${catalog2[i].full_name}</h5>
          <p>${catalog2[i].email}</p>
        </div>
        <div class="delete-message"  data-bs-toggle="modal" data-bs-target="#exampleModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
    `;
    main.innerHTML = `<p>${catalog2[i].text_message}</p>`
    message_block.appendChild(header);
    message_block.appendChild(main);
    message_main.appendChild(message_block);   
    header.querySelector(".delete-message").addEventListener("click", function () {
      document.querySelector("#sure").addEventListener("click", function(){
        delete_message(catalog2[i].id_message, message_block);
      })
    });
}
}


function delete_message(id, message_block) {
  fetch(`/delmessage/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin' // Include cookies with the request
  })
  .then(response => {
    if (response.ok) {
      const toastLiveExample = document.getElementById('liveToast');
      toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
      document.querySelector(".toast-body").innerText = "Повідомлення успішно видалено!";
      document.querySelector(".me-auto").innerText = "Успішно";
      
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
      message_main.removeChild(message_block);
    } else {
        const toastLiveExample = document.getElementById('liveToast');
        toastLiveExample.style.backgroundColor = "rgb(255, 187, 156)";
        document.querySelector(".toast-body").innerText = "Помилка при видаленні";
        document.querySelector(".me-auto").innerText = "Помилка";
        
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


back_to_main.addEventListener('click', function(){
    window.location.href = '/';
    console.log("S");
});

exit_button.addEventListener('click', function() {
    fetch('/logout', {
      method: 'POST',
      credentials: 'same-origin' // Include cookies with the request
    }).then(response => {
      if (response.ok) {
        window.location.href = '/login'; // Redirect to the login page
      } else {
        alert('Помилка при виході');
      }
    }).catch(error => {
      console.error('Error:', error);
    });
  });