let back_to_main = document.querySelector(".back-to-main");
let exit_button = document.querySelector("#exit-button");
let update_info = document.querySelector(".update-info");

update_info.addEventListener('click', function (e) {
  e.preventDefault();

  const full_name = document.getElementById('username').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  
  fetch('/update-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name, phone, email }),
  })
    .then(response => response.text())
    .then(data => {
      const toastLiveExample = document.getElementById('liveToast');
        toastLiveExample.style.backgroundColor = "rgb(158, 255, 156)";
        document.querySelector(".toast-body").innerText = "Зміна даних пройшла успішно!";
        document.querySelector(".me-auto").innerText = "Успішно";
        
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    });
    
});

back_to_main.addEventListener('click', function(){
  window.location.href = '/';
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