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
    if (document.getElementById("run").innerHTML === "Searching ...") {
        document.getElementById("run").innerHTML = "";
        var res = (document.getElementById("input_result").innerHTML).split(",");
        var loc = (document.getElementById("location_result").innerHTML).split(",");
        var data = getRelevantData(res, loc);
        document.getElementById("results").innerHTML = JSON.stringify(data);
        var lat_used = getLatitudeTerm(data, 0);
        var lon_used = getLongitudeTerm(data, 0);
        var map_center = [parseFloat(data[0][lat_used]), parseFloat(data[0][lon_used])];
        var map = L.map('map').setView(map_center, 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);

        for (e in data) {
            if (data[e] === undefined) {
                continue;
            }
            var lat_used = getLatitudeTerm(data, e);
            var lon_used = getLongitudeTerm(data, e);
            var gps = [parseFloat(data[e][lat_used]), parseFloat(data[e][lon_used])];
            var marker = L.marker(gps).addTo(map);
        }
    }
}

function getRelevantData(results, location) {
    var data_set = [];
    for (r in results) {
        if (api_list_get[results[r]] === undefined) {
            continue;
        }
        link = api_list_get[results[r]][0];
        format = api_list_get[results[r]][1];
        switch(format) {
            case "json":
            data = getJSON(link);
            break;
            case "xml":
            data = getXML(link);
            break;
        }
        for (d in data.records) {
            if (data.records[d] === undefined) {
                continue;
            }
            var lon_used = getLongitudeTerm(data.records, d);
            var lat_used = getLatitudeTerm(data.records, d);
            var data_location = [data.records[d][lon_used], data.records[d][lat_used]];
            if (checkLocation(data_location, location)) {
                data_set.push(data.records[d]);
            }
        }
    }
    return data_set;
}

function getLatitudeTerm(data, index) {
    var latitude_terms = ["Latitude", "Lat_GDA94", "Crash_Latitude_GDA94", "LATITUDE"];
    for (lat in latitude_terms) {
        lat_term = latitude_terms[lat];
        if (data[index][lat_term] !== undefined) {
            return lat_term;
        } 
    }
}

function getLongitudeTerm(data, index) {
    var longitude_terms = ["Longitude", "Long_GDA04", "Crash_Longitude_GDA94", "LONGITUDE"];
    for (lon in longitude_terms) {
        lon_term = longitude_terms[lon];
        if (data[index][lon_term] !== undefined) {
            return lon_term;
        } 
    }
}

function checkLocation(loc_data, loc_want) {
    d_long = parseFloat(loc_data[0]);
    d_lat = parseFloat(loc_data[1]);
    w_long = parseFloat(loc_want[0]);
    w_lat = parseFloat(loc_want[1]);
    w_dev = parseFloat(loc_want[2]);
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
