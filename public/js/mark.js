const username = document.forms['attendance-form']['username'];
const password = document.forms['attendance-form']['password'];
const responseContainer = document.getElementById('response-container');

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

    const response = await fetch('/api/v1/attendance', {
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
    const json = await response.json();
    
    if (json.error) {
        responseContainer.innerHTML = `<div class="timer"></div>
        <div class="data">
            <div class="message-red" id="message">${json.message}</div>
            <div class="details" id="details">
                <div class="grp1-red">
                    <div><span id="in-time">${json.error}</span></div>
                </div>
            </div>
        </div>`;
    }
    if (json.data) {
        responseContainer.innerHTML = `<div class="timer"></div>
        <div class="data">
            <div class="message" id="message">${json.message}</div>
            <div class="details" id="details">
                <div class="grp1">
                    <div>Entry: <span id="in-time">${json.data.in}</span></div>
                    <div>Exit: &nbsp;<span id="out-time">${json.data.out}</span></div>
                </div>
                <div class="grp2">Duration: <div id="duration">${Math.floor(json.data.duration / 3600)}h:${Math.floor((json.data.duration % 3600) / 60)}m</div>
                </div>
            </div>
        </div>`;
    }

    username.value = '';
    password.value = '';

    setTimeout(() => {
        responseContainer.innerHTML = '';
    }, 5000);
}