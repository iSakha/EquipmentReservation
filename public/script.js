document.addEventListener("DOMContentLoaded", loadEvents);
let eventObj = {};
let equipObj = {};
let eventEquipArr = [];
let tbl = document.getElementById('events-table');

//  Click Event table
// ======================================================================
tbl.addEventListener('click', (e) => {
    // console.log(e.target);
    let td = e.target;
    let row = td.parentNode;
    let selectedEventId = row.children[0].innerHTML;
    let start = row.children[3].innerHTML;
    let end = row.children[4].innerHTML;

    clearBackgroundColor(tbl);
    showAddButton();

    document.getElementById('event-name').innerHTML = row.children[2].innerHTML;
    document.getElementById('event-id').innerHTML = selectedEventId;

    document.querySelectorAll('.row')[0].classList.remove("d-none");

    if (row.rowIndex > 0) {
        row.className = "yellow";

        loadEventEquip(selectedEventId);
        setDate(start, end);
    } else {
        document.getElementById('div-booking-equip').classList.add("d-none");
        document.getElementById('btn-add-equip').classList.add("d-none");
        document.querySelectorAll('.row')[0].classList.add("d-none");
        document.querySelectorAll('.row')[1].classList.add("d-none");
        document.querySelectorAll('.row')[2].classList.add("d-none");
    }

});

function setDate(start, end) {
    document.getElementById('start').value = start;
    document.getElementById('end').value = end;
}

//  Click Button "Add equipment"
// ======================================================================
document.getElementById('btn-add-equip').addEventListener('click', () => {
    document.getElementById('div-booking-equip').classList.remove("d-none");
    let start = document.getElementById('start').value;
    let end = document.getElementById('end').value;
    loadEquipment(start, end);

})

//  Click Equipment table
// ======================================================================
let tblEquip = document.getElementById('booking-equip-table');
tblEquip.addEventListener('click', (e) => {

    // console.log(e.target.className);
    if (e.target.className == "txt-to-take") {

    } else if (e.target.className == "equip-tbl-cell") {
        let td = e.target;
        let row = td.parentNode;
        let selectedFixture = row.children[0].innerHTML;
        console.log(selectedFixture);

        document.getElementById('lbl-fxtName').innerHTML = row.children[1].innerHTML;
        document.getElementById('lbl-storage-qty').innerHTML = row.children[3].innerHTML;
        document.getElementById('lbl-available-qty').innerHTML = row.children[4].innerHTML;
        document.getElementById('lbl-fxt-id').innerHTML = row.children[0].innerHTML;

        document.querySelectorAll('.row')[1].classList.remove("d-none");
        document.querySelectorAll('.row')[2].classList.remove("d-none");
    }



})

//  Click Button "OK"
// ======================================================================
document.getElementById('btn-ok').addEventListener('click', () => {
    let fxt_qty = document.getElementById('txt-take-qty').value;
    let event_id = document.getElementById('event-id').innerHTML;
    let fxt_id = document.getElementById('lbl-fxt-id').innerHTML;
    let fxtObj = {};
    fxtObj.event_id = event_id;
    fxtObj.fxt_id = fxt_id;
    fxtObj.fxt_qty = fxt_qty;
    // console.log(fxtObj);

    fetch('/events', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fxtObj)
    })
        .then(res => res.json())
        .then(data => {
            // fillEquipTable(data, tbl, tblBody)
            console.log("data:", data);
            alert('Добавлено успешно');
        })
        // .then(refresh)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })


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
            fillEquipEventTable(data, tbl, tblBody);
            eventEquipObj = data;
            console.log("data:", data);
        })
        // .then(refresh)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })

}


function fillEquipEventTable(equip, tbl, tblBody) {
    console.log("fillEquipEventTable", equip);
    eventEquipArr = equip;
    tblBody.innerHTML = "";
    for (let i = 0; i < equip.length; i++) {

        // eventEquipArr.push(equip[i]);

        let row = document.createElement('tr');
        let cell = document.createElement("td");
        getEventEquip(equip[i].fixture_id);
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].fixture_id;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.innerHTML = "";
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].fixture_name;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('font-bold');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].event_id;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].storage_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].result_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].selected_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        if (equip[i].event_start !== null) {
            let eventStartDate = equip[i].event_start.slice(0, 10);
            cell.innerHTML = eventStartDate;
        } else {
            cell.innerHTML = "";
        }

        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        if (equip[i].event_end !== null) {
            let eventEndDate = equip[i].event_end.slice(0, 10);
            cell.innerHTML = eventEndDate;
        } else {
            cell.innerHTML = "";
        }
        row.appendChild(cell);

        tblBody.appendChild(row);
    }
    tbl.append(tblBody);

    document.getElementById('div-equip-table').classList.remove("d-none");

    console.log('eventEquipArr :', eventEquipArr);
}

function fillEquipTable(equip, tbl, tblBody) {
    console.log("fillEquipTable", equip);

    tblBody.innerHTML = "";
    for (let i = 0; i < equip.length; i++) {

        let row = document.createElement('tr');
        let cell = document.createElement("td");

        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].fixture_id;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.innerHTML = "";
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].fixture_name;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('font-bold');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].storage_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].result_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        cell.innerHTML = equip[i].selected_qty;
        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.classList.add('equip-tbl-cell');
        let newinputbox = document.createElement("input");
        newinputbox.classList.add('txt-to-take')
        newinputbox.value = getEventEquip(equip[i].fixture_id);
        newinputbox.setAttribute("type", "text");
        if (newinputbox.value > 0) {
            row.classList.add("yellow");
        }

        cell.appendChild(newinputbox);

        if (equip[i].fixture_id.slice(4, 7) === '000') {
            cell.classList.add('d-none');
        }

        row.appendChild(cell);



        tblBody.appendChild(row);


    }
    tbl.append(tblBody);

    document.getElementById('div-equip-table').classList.remove("d-none");
}

function loadEquipment(start, end) {
    let tbl = document.getElementById('booking-equip-table');
    let tblBody = document.getElementById('booking-equip-table-body');
    let interval = {};
    interval.start = start;
    interval.end = end;

    let data = JSON.stringify(interval);
    fetch('/equipment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
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

function getEventEquip(id) {
    console.log(id);
    let qty = 0;
    for (let i = 0; i < eventEquipArr.length; i++) {
        if (eventEquipArr[i].fixture_id === id) {
            console.log(eventEquipArr[i].selected_qty);
            qty = eventEquipArr[i].selected_qty;
        }
    }
    return qty;
}