window.addEventListener("load", pageLoad);

var api_list_get = {};

function pageLoad() {
    readJSONdb_get();
    window.setInterval(checkRun, 10);
}

function readJSONdb_get() {
    var db_url =  "\api_list.json";
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", db_url, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var db = JSON.parse(xml_req.responseText);
        for (r in db) {
            api_list_get[db[r]['title']] = [db[r]['api_key'], db[r]['api_type']];
        }
    }
}

function checkRun() {
    if (document.getElementById("run").innerHTML === "run") {
        document.getElementById("run").innerHTML = "";
        var res = (document.getElementById("input_result").innerHTML).split(",");
        var loc = (document.getElementById("location_result").innerHTML).split(",");
        var data = getRelevantData(res, loc);
        document.getElementById("results").innerHTML = JSON.stringify(data);
    }
}

function getRelevantData(results, location) {
    var data_set = [];
    results.forEach(function(r) {
        link = api_list_get[r][0];
        format = api_list_get[r][1];
        var data;
        switch(format) {
            case "json":
              data = getJSON(link);
              break;
            case "xml":
              data = getXML(link);
              break;
        }
        if (data !== undefined) {
            (data.records).forEach(function(d) {
                var data_location = [d["Longitude"], d["Latitude"]];
                if (checkLocation(data_location, location)) {
                    data_set.push(d);
                }
            });
        }
    });
    return data_set;
}

function checkLocation(loc_data, loc_want) {
    d_long = loc_data[0];
    d_lat = loc_data[1];
    w_long = loc_want[0];
    w_lat = loc_want[1];
    w_dev = loc_want[2];

    if ((d_long >= w_long - w_dev) && (d_long <= w_long + w_dev)) {
        if ((d_lat >= w_lat - w_dev) && (d_lat <= w_lat + w_dev)) {
            return true;
        }
    } return false;
}

function getJSON(json) {
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", json, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var data_json = JSON.parse(xml_req.responseText).result;
        return data_json;
    }
}

function getXML(xml) {
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", xml, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var data_json = JSON.parse(xml_req.responseText).result;
        return data_json;
    }
}