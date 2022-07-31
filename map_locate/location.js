window.addEventListener('load', function () {  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  } else { 
    alert("Geolocation is not supported by this browser.");
  }
});

function success(position) {
  lat=parseFloat(position.coords.latitude);
  longt=parseFloat(position.coords.longitude);
  GetMap(lat,longt);
}

 // show map
function GetMap(latitude,longitude){       
    //map object
    var map = new atlas.Map("myMap", {
        view: 'Auto',
        //Azure Maps primary subscription key
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'hdq8J5GnXLybAwib95YgXYMqM_PTABPw6B23B8BDvEw'
        }
    });

    map.events.add('ready', function(){
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //location points
        var resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: 'pin-round-darkblue',
                anchor: 'center',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });

        map.layers.add(resultLayer);  //to show result layer on map layer

        //MapControlCredential is used to share authentication between a map control and the service module.
        var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

        //SearchURL object is used to get recycling points in an area
        var searchURL = new atlas.service.SearchURL(pipeline);

        var query ='recycling';
        var radius = 90000;
        
        //search query
        searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
            limit: 10,
            lat: latitude,
            lon: longitude,
            radius: radius,
            view: 'Auto'
        }).then((results) => {
            // Extracting GeoJSON feature collection from the response and add it to the datasource
            var data = results.geojson.getFeatures();
            datasource.add(data);

            //setting camera bounds to show the results
            map.setCamera({
                bounds: data.bbox,
                zoom: 10,
                padding: 15
            });
        });

        //Creating a popup 
        popup = new atlas.Popup();

        //displaying a popup
        map.events.add('mouseover', resultLayer, showPopup);

        function showPopup(e) {
            var p = e.shapes[0].getProperties();
            var position = e.shapes[0].getCoordinates();
            //Creating popup from properties of the selected result.
            var html = `<div style="padding:5px">
                <div><b>${p.poi.name}</b></div>
                <div>${p.address.freeformAddress}</div>
                <div>${position[1]}, ${position[0]}</div> 
                </div>`;

            popup.setPopupOptions({
                content: html,
                position: position
            });

            popup.open(map);
        }
    });
}