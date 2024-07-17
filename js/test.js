geoJson = "geojson/artist.geojson";

$.getJSON( geoJson, function( data ) {

    if(data){

        L.mapbox.accessToken = 'pk.eyJ1IjoicHJvdGVpbnMyMiIsImEiOiJjajl5Z2lsMDM1eWNqMzNwZ3BqNTM0N21hIn0.V-EsPZjrd_1FKC0bbFiF0w';
        var map = L.mapbox.map('map', 'mapbox.streets').setView([0, 0], 3);

        var polyline = L.polyline([]).addTo(map);
        var points = data.features;
        console.log(points);
        // add a variable for keeping track of points
        var y = 0;
        // Start drawing the polyline.
        add();

        function add() {

            // add a point on the line for the new marker
            polyline.addLatLng(
                L.latLng(points[y].geometry.coordinates[1],
                    points[y].geometry.coordinates[0])
            );


            // Pan the map along with where the line is being added.
            map.setView([points[y].geometry.coordinates[1], points[y].geometry.coordinates[0]], 5);

            // Continue to draw and pan the map by calling `add()`
            // until `y` reaches the number of points
            if (++y < points.length) window.setTimeout(add, 1000);
        }
    }

});