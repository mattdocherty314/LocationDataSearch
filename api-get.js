var api_list = {
    "Environmental Monitoring Site Locations": ["https://data.qld.gov.au/api/action/datastore_search?resource_id=37eab16f-d391-44e3-93aa-b0dac0a6a2d8", "json"]
};
window.addEventListener("load", pageLoad);

function pageLoad() {
    //console.log("Page Loaded!");
    var res = ["Environmental Monitoring Site Locations"];
    var loc = [148, -20, 1];
    var data = getRelevantData(res, loc);
    console.log(data);
}

function getRelevantData(results, location) {
    var data_set = [];
    results.forEach(function(r) {
        link = api_list[r][0];
        format = api_list[r][1];
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