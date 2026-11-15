function register() {
    const fullName = document.getElementById("inputNAME").value;
    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;
    const repeatPassword = document.getElementById("exampleInputPassword2").value;

    if (password !== repeatPassword) {
        document.querySelector(".toast-body").innerText = "Пароль і повторний пароль не співпадають";
        // Show Bootstrap toast for invalid email or password
        const toast = new bootstrap.Toast(document.getElementById('liveToast'));
        toast.show();
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
        document.querySelector(".toast-body").innerText = "Реєстрація пройшла успішно!";
        document.querySelector(".me-auto").innerText = "Успішно";
        
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();


        
        // можна виконати додаткові дії, наприклад, перенаправити користувача на іншу сторінку
    })
    .catch((error) => {
        console.error('Помилка:', error);
    });
}