const express = require("express");
const mysql = require("mysql2");
const config = require('./config.js');
const cors = require("cors");

const PORT = 3080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let eventsObj = {};
let equipObj = {};
let fullEquipObj = {};

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({ extended: false });

//      Get Home page
// ==========================================================
app.use(express.static(__dirname + "/public"));

//  READ events
// --------------------------------------------------------------------
app.get("/events", function (request, response) {
  readEvents(response);
});

//  READ event equipment
// --------------------------------------------------------------------
app.post("/events", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log("update.request.body", request.body);
  return readEventEquipment(request.body, response);
  // response.send(request.body);
});

//  READ Equipment
// --------------------------------------------------------------------
app.post("/equipment", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log("request.body", request.body);
  return readEquipment(request.body, response);
  // response.send(request.body);
});

//  ADD Equipment to the Event
// --------------------------------------------------------------------
app.put("/events", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log("request.body", request.body);
  return addEquipmentToEvent(request.body, response);
  // response.send(request.body);
});

//  UPDATE Equipment to the Event
// --------------------------------------------------------------------
app.patch("/events", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log("request.body", request.body);
  return updateEquipmentToEvent(request.body, response);
  // response.send(request.body);
});


//  READ events function
// --------------------------------------------------------------------
function readEvents(response) {

  connection = mysql.createConnection(config);
  connection.execute("SELECT * FROM v_events",
    function (err, results, fields) {
      if (err) {
        console.log('Check SSH tunnel!')
        return console.log("Error: " + err.message);
      }
      eventsObj = results;
      console.log(eventsObj);
      response.send(eventsObj);
      connection.end();
    });
}

//  READ eventEquipment function
// --------------------------------------------------------------------
function readEventEquipment(data, response) {
  connection = mysql.createConnection(config);
  // console.log("data.id", data.id);
  // execute will internally call prepare and query
  connection.execute(
    "SELECT * FROM `v_result_2` WHERE `event_id` = ?",
    [data.id],
    function (err, results, fields) {
      if (err) return console.log(err);
      equipObj = results
      console.log(equipObj); // results contains rows returned by server
      response.send(equipObj);
      connection.end();
    }
  )
}

//  READ Equipment function
// --------------------------------------------------------------------
function readEquipment(interval, response) {
  connection = mysql.createConnection(config);
  connection.execute("CALL equip_selection(?,?)",
    [interval.start, interval.end],
    function (err, results, fields) {
      if (err) {
        console.log('Check SSH tunnel!')
        return console.log("Error: " + err.message);
      }
      fullEquipObj = results[0];
      console.log(fullEquipObj); // results contains rows returned by server
      response.send(fullEquipObj);
      connection.end();
    }
  )
}

//  ADD Equipment to the Event function
// --------------------------------------------------------------------
function addEquipmentToEvent(data, response) {
  console.log("data to add: ", data);
  let dataArray = [];
  connection = mysql.createConnection(config);
  for (let i = 0; i < data.length; i++) {    
    dataArray.push([data[i].id_fxt, data[i].id_event, data[i].qty]);
  }

  console.log("dataArray to add: ", dataArray);
  const sql = "INSERT INTO selected_fixtures(id_fxt, id_event, qty) VALUES ?";
  connection.query(sql, [dataArray], function (err, results) {
    if (err) return console.log(err);
  });
  response.send(data);
  connection.end();
}

//  UPDATE Equipment to the Event function
// --------------------------------------------------------------------
function updateEquipmentToEvent(data, response) {
  console.log("data to update: ", data);
  let dataArray = [];
  connection = mysql.createConnection(config);
  for (let i = 0; i < data.length; i++) {
    dataArray = [data[i].qty, data[i].id_event, data[i].id_fxt];
    // console.log("dataArray to update: ", dataArray);
    const sql = "UPDATE selected_fixtures SET qty=? WHERE id_event=? AND id_fxt=?";
    connection.query(sql, dataArray, function (err, results) {
      if (err) return console.log(err);
    }

    )
  };
  response.send(data);
  connection.end();
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});