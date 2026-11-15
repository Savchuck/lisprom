let login_button = document.querySelector('#login-button');

// Зробимо запит до сервера, щоб перевірити статус входу користувача
document.addEventListener("DOMContentLoaded", () => {
  fetch('/check_login_status')
      .then(response => response.json())
      .then(data => {
        console.log(data);
          // Якщо користувач увійшов в систему, перенаправити його на відповідну сторінку
          if (data.loggedIn && data.userId) {
              if (data.userId === 1) {
                
                  login_button.textContent = "Адмін панель";
                login_button.addEventListener('click', function(){
                  login_button.href = "/users/admin";
                });
              } else if(data.userStatus==='driver'){
                login_button.textContent = "Кабінет водія";
                login_button.addEventListener('click', function(){
                  login_button.href = "/users/driver";
                });
              } 
              else {
                login_button.textContent = "Мій профіль";
                login_button.href = "/users/" + data.userId;
              }
          }
          
      })
      .catch(error => {
          console.error('Помилка перевірки статусу входу:', error);
      });
});