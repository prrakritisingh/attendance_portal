const dateInput = document.forms['date-search']['date'];
const tableBody = document.getElementById("table-body");
const strengthCount = document.getElementById("strength");
const dateDisplay = document.getElementById("data-date");
const durationDisplay = document.getElementById("duration");

let members = [];
const date = new Date();

async function fetchMemberList() {
    const response = await fetch(`/admin/api/v1/members`);
    const json = await response.json();
    members = json.data;
    getAttendance(date.toISOString().split('T')[0]);
}

function dateQuery() {
    const datevalue = dateInput.value;
    if (datevalue === '') {
        dateInput.focus();
        return;
    }
    getAttendance(datevalue);
}

function download() {
    let datevalue = dateInput.value;
    console.log(datevalue);
    if (datevalue === '') {
        datevalue = date.toISOString().split('T')[0];
    }
    downloadList(datevalue);
}

async function getAttendance(date) {

    const response = await fetch(`/admin/api/v1/attendance/${date}`);
    const json = await response.json();
    strengthCount.innerHTML = `<b>Strength:</b> ${json.data.length}`;
    dateDisplay.innerHTML = `<b>Date:</b> ${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;

    let domContent = "";
    let sno = 0;
    let maxOutTime = "";
    json.data.forEach(record => {
        sno++;
        maxOutTime = (record.out > maxOutTime) ? record.out : maxOutTime;
        const object = members.find(({ username }) => username === record.username);
        domContent += `<tr>
            <td>${sno}</td>
            <td>${object.fullname}</td>
            <td>${object.stdno}</td>
            <td>${object.branch}</td>
            <td>${object.year}</td>
            <td>${record.in}</td>
            <td>${record.out === record.in ? "-" : record.out}</td>
            <td>${Math.floor(record.duration / 3600)}h:${Math.floor((record.duration % 3600) / 60)}m</td>
            <td>${record.username}</td>
        </tr>`
    });
    durationDisplay.innerHTML = `<b>Duration:</b> ${+maxOutTime.split(':')[0] - 11}h:${+maxOutTime.split(':')[1]}m`;
    tableBody.innerHTML = domContent;
}

async function downloadList(date) {
    const response = await fetch(`/admin/api/v1/download/${date}`);
    const blob = await response.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `lab-${date}`;
    a.click();
    a.remove();
}

fetchMemberList();