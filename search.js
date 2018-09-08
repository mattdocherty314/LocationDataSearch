window.addEventListener("load", pageLoad);

var api_list_search = {};

function pageLoad() {
    readJSONdb_search();
    var search_btn = document.getElementById("search");
    search_btn.addEventListener("click", startSearch);
}

function readJSONdb_search() {
    var db_url =  "\api_list.json";
    var xml_req = new XMLHttpRequest();
    xml_req.open("GET", db_url, false);
    xml_req.send();
    if (xml_req.status === 200) {
        var db = JSON.parse(xml_req.responseText);
        for (r in db) {
            api_list_search[db[r]['title']] = db[r]['desc'];
        }
    }
}

function startSearch() {
    document.getElementById("run").innerHTML = "Searching ...";
    
    var inp_field = document.getElementById("input_search");
    var loc_field = document.getElementById("location_search");
    var inp_out = document.getElementById("input_result");
    var loc_out = document.getElementById("location_result");

    var inp_res = getInput(inp_field.value);
    var loc_res = getLocation(loc_field.value);

    inp_out.innerHTML = inp_res;
    loc_out.innerHTML = loc_res;
}

function getInput(input_search) {
    var results = [];
    var input_search_or = input_search.toLowerCase().split(" or ");
    for (var title in api_list_search) {
        for (var inp in input_search_or) {
            if (api_list_search[title].toLowerCase().indexOf(input_search_or[inp]) !== -1) {
                results.push(title);
            }
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
        var precision = calculatePrecision();
        return [data_json[0].lon, data_json[0].lat, precision];
    }
}

function calculatePrecision() {
    var range_input = document.getElementById("range").value;
    var range = parseFloat(range_input);

    return range/100; // prec = range/(2*3*6000/360)
}