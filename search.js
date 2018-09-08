window.addEventListener("load", pageLoad);

var api_list = {};

function pageLoad() {
    readJSONdb();
    var search_btn = document.getElementById("search");
    search_btn.addEventListener("click", startSearch);
}

function readJSONdb() {
    db =  "\api_list.json";
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", db, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var db = JSON.parse(xml_req.responseText);
        for (r in db) {
            api_list[r] = db[r].desc;
        }
    }
}

function startSearch() {
    var inp_field = document.getElementById("input_search");
    var loc_field = document.getElementById("location_search");
    var inp_out = document.getElementById("input_result");
    var loc_out = document.getElementById("location_result");

    var inp_res = getInput(inp_field.value);
    var loc_res = getLocation(loc_field.value);

    inp_out.innerHTML = inp_res;
    loc_out.innerHTML = loc_res;
    document.getElementById("run").innerHTML = "run";
}

function getInput(input_search) {
    var results = [];
    for (var title in api_list) {
        if (api_list[title].includes(input_search)) {
            results.push(title);
        }
    }
    return results;
}

function getLocation(location_search) {
    url =  "https://nominatim.openstreetmap.org/search/"+location_search+"?format=json&addressdetails=1&limit=1&polygon_svg=1";
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", url, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var data_json = JSON.parse(xml_req.responseText);
        return [data_json[0].lon, data_json[0].lat, 1];
    }
}