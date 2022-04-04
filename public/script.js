document.addEventListener("DOMContentLoaded", loadEvents);
let eventObj = {};
let equipObj = {};
let tbl = document.getElementById('events-table');

tbl.addEventListener('click', (e) => {
    // console.log(e.target);
    let td = e.target;
    let row = td.parentNode;
    let selectedEventId = row.children[0].innerHTML;

    clearBackgroundColor(tbl);
    showAddButton();

    if (row.rowIndex > 0) {
        row.className = "yellow";

        loadEventEquip(selectedEventId);
    } else {
        document.getElementById('div-booking-equip').classList.add("d-none");
        document.getElementById('btn-add-equip').classList.add("d-none");
    }

});

document.getElementById('btn-add-equip').addEventListener('click', () => {
    document.getElementById('div-booking-equip').classList.remove("d-none");
    loadEquipment();
})


function loadEvents() {
    fetch('/events')
        .then(res => res.json())
        .then(json => {
            eventObj = json;
            console.log(eventObj);
            fillEventTable(eventObj);
        })
}

function fillEventTable(events) {

    let tbl = document.getElementById('events-table');
    let tblBody = document.getElementById('events-table-body');
    tblBody.innerHTML = "";
    for (let i = 0; i < events.length; i++) {

        let row = document.createElement('tr');

        let cell = document.createElement("td");
        cell.innerHTML = events[i].id;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = events[i].cal_name;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = events[i].title;
        row.appendChild(cell);

        cell = document.createElement("td");
        let eventStartDate = events[i].start.slice(0, 10);
        cell.innerHTML = eventStartDate;
        row.appendChild(cell);

        cell = document.createElement("td");
        let eventEndDate = events[i].end.slice(0, 10);
        cell.innerHTML = eventEndDate;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = events[i].notes;
        row.appendChild(cell);

        tblBody.appendChild(row)
    }
    tbl.append(tblBody)
}

function clearBackgroundColor(tbl) {
    let rows = tbl.rows;
    // console.log(rows.length);
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("yellow");
    }
}

function showAddButton() {
    document.getElementById('btn-add-equip').classList.remove("d-none");
}

function loadEventEquip(id) {
    let tbl = document.getElementById('equip-table');
    let tblBody = document.getElementById('equip-table-body');
    // console.log(id);
    let data = {};
    data.id = id;
    fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            fillEquipTable(data, tbl, tblBody)
            // console.log("data:", data);
        })
        // .then(refresh)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })

}


function fillEquipTable(equip, tbl, tblBody) {
    console.log("fillEquipTable", equip);

    tblBody.innerHTML = "";
    for (let i = 0; i < equip.length; i++) {

        let row = document.createElement('tr');

        let cell = document.createElement("td");
        cell.innerHTML = equip[i].fixture_id;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = equip[i].fixture_name;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = equip[i].event_id;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = equip[i].storage_qty;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = equip[i].result_qty;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.innerHTML = equip[i].selected_qty;
        row.appendChild(cell);

        cell = document.createElement("td");
        if (equip[i].event_start !== null) {
            let eventStartDate = equip[i].event_start.slice(0, 10);
            cell.innerHTML = eventStartDate;
        }else {
            cell.innerHTML = "";
        }

        row.appendChild(cell);


        cell = document.createElement("td");
        if (equip[i].event_end !== null) {
            let eventEndDate = equip[i].event_end.slice(0, 10);
            cell.innerHTML = eventEndDate;
        }else {
            cell.innerHTML = "";
        }
        row.appendChild(cell);

        tblBody.appendChild(row);
    }
    tbl.append(tblBody);

    document.getElementById('div-equip-table').classList.remove("d-none");
}

function loadEquipment() {
    let tbl = document.getElementById('booking-equip-table');
    let tblBody = document.getElementById('booking-equip-table-body');
    fetch('/equipment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ""
    })
        .then(res => res.json())
        .then(data => {
            console.log("data:", data);
            fillEquipTable(data, tbl, tblBody)            
        })
        // .then(refresh)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}