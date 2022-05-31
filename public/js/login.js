const username = document.forms['admin-login']['username'];
const password = document.forms['admin-login']['password'];

username.focus();

const handleSubmit = async () => {
    const usernameVal = username.value.trim().toLowerCase();
    const passwordVal = password.value.trim();

    if (usernameVal === '') {
        username.focus();
        return;
    }
    if (passwordVal === '') {
        password.focus();
        return;
    }

    const data = {
        username: usernameVal,
        password: passwordVal
    }

    const response = await fetch('/admin/api/v1/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    if(response.redirected) {
        window.location.href = response.url;
    }
    
    const json = await response.json();
    if (json.error) {
        alert(json.message);
    }

    username.value = '';
    password.value = '';
}