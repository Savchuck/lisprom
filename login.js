document.querySelector("#login-button").addEventListener("click", function(event){
  event.preventDefault(); // Prevent the default form submission
  
  const email = document.querySelector("#exampleInputEmail1").value;
  const password = document.querySelector("#exampleInputPassword1").value;
  
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }) // Send email and password in the request body
  })
  .then(response => response.json())
  .then(data => {
    if(data.error === "Неправильний email або пароль"){
        document.querySelector(".toast-body").innerText = data.error;
        // Show Bootstrap toast for invalid email or password
        const toast = new bootstrap.Toast(document.getElementById('liveToast'));
        toast.show();
    }
    else{
      window.location.href = '/catalog';
    }
  })
  .catch(error => console.error('Помилка:', error));
});