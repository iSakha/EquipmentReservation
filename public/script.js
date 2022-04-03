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

    if (row.rowIndex > 0) {
        row.className = "yellow";

        loadEventEquip(selectedEventId);
    }

});


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

function loadEventEquip(id) {
    console.log(id);
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
                fillEquipTable(data)
                // console.log("data:", data);
            })
            // .then(refresh)
            .catch(error => {
                // enter your logic for when there is an error (ex. error toast)
                console.log(error)
            })

}


function fillEquipTable(equip) {
    console.log("fillEquipTable", equip);

    let tbl = document.getElementById('equip-table');
    let tblBody = document.getElementById('equip-table-body');
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
        let eventStartDate = equip[i].event_start.slice(0, 10);
        cell.innerHTML = eventStartDate;
        row.appendChild(cell);

        cell = document.createElement("td");
        let eventEndDate = equip[i].event_end.slice(0, 10);
        cell.innerHTML = eventEndDate;
        row.appendChild(cell);

        tblBody.appendChild(row);
    }
    tbl.append(tblBody);

    document.getElementById('div-equip-table').classList.remove("d-none");
}