var startPos;
var flyTo = false;

mapboxgl.accessToken = 'pk.eyJ1IjoicHJvdGVpbnMyMiIsImEiOiJjamEybDhiYmM5Z2hoMnFwYWludjAwdmFqIn0.EZ7z_2NgA_vJhSzOnRLFEQ';

if(window.location.href.indexOf("artists/1/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/2/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/3/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/4/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/5/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/6/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/7/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/8/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/9/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/10/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else if(window.location.href.indexOf("artists/test/") > -1) {
    geoJson = "../../geojson/artist.geojson";
    init();
}
else{
    geoJson = null;
    window.location = "../../index.html";
    //init();
}

function init(){
    $.getJSON( geoJson, function( data ) {
        startPos = data.features[0].geometry.coordinates;

        //if data ready load map
        if(data){
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/proteins22/cja9yhzqw1yhg2ro21li3u1u5',
                center: startPos,
                zoom: getRandomInt(14, 18),
                bearing: 0,
                pitch: 0
            });

            // Create a GeoJSON source with an empty lineString.
            var geojson = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [startPos]
                    }
                }]
            };
            var speedFactor = 30; // number of frames per longitude degree
            var animation; // to store and cancel the animation
            var currentShowId = '0';
            var prevShowId;

            map.on('load', function() {
                map.addLayer({
                    'id': 'line-animation',
                    'type': 'line',
                    'source': {
                        'type': 'geojson',
                        'data': geojson
                    },
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': {
                        'line-color': '#f80046',
                        'line-width': 5,
                        'line-opacity': 0.8
                    }
                });
            });

            //push coordinates into array
            var datesArray = [];
            $.each(data.features, function(i, item) {
                if( item.information.end === true ){
                    datesArray.push({
                        center: this.geometry.coordinates,
                        zoom: 1.5,
                        bearing: 0,
                        pitch: 0
                    });
                }
                else{
                    datesArray.push({
                        center: this.geometry.coordinates,
                        zoom: getRandomInt(14, 18),
                        bearing: getRandomInt(-90, 180),
                        pitch: getRandomInt(15, 40)
                    });
                }
               

                //console.log(data.features[i].information);
                var num = i;
                num = 1 + i;
                $('.dates').append('<section id="' + i + '"><div class="showCounter">#'+num+'</div><h3 class="date">' + data.features[i].information.dateOfShow + '</h3>' +
                    (data.features[i].information.supportAct ? '<h4 class="support">with: ' + data.features[i].information.supportAct + '</h4>': '') +
                    (data.features[i].information.venue ? '<h1 class="venue">' + data.features[i].information.venue + '</h1>': '<h1 class="venue">' + data.features[i].information.city + '</h1>') + '<p class="location">'+ data.features[i].information.city+', '+data.features[i].information.country + '</p>'
                );


            });

            //turn array into object
            var tourDates = datesArray.reduce(function(acc, cur, i) {
                acc[i] = cur;
                return acc;
            }, {});

            //map ready
            map.on('load', function () {
                
                $('.preloader').fadeOut();
                $('.dates section:first-child').attr('class','active');

                map.addSource('markers', {
                    "type": "geojson",
                    "data": data
                });

                map.addLayer({
                    "id": "markers",
                    "source": "markers",
                    "type": "symbol",
                    "layout": {
                        "icon-image": "{marker-symbol}",
                        "text-field": "{title}",
                        "text-font": ["Alfa Slab One Regular", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    },
                    "paint": {
                        "text-color": "#f80046",
                        "icon-color": "#fff"
                    }
                });

                $(".dates section").click(function(){
                    var showNumber = $(this).attr('id');
                    hideInfo();
                    $('html, body').animate({
                        scrollTop: $(this).offset().top
                    }, 'slow', function(){
                        setActiveShow(showNumber);
                    });
                });

                
                window.onscroll = function() {
                    
                    hideInfo();
                    var dates = Object.keys(tourDates);
                    for (var i = 0; i < dates.length; i++) {
                        var date = dates[i];
                        if (isElementOnScreen(date)) {
                            setActiveShow(date);
                            break;
                        }
                    }
                };

                function setActiveShow(showNumber) {
                    if (showNumber === currentShowId) return;
                    map.flyTo(tourDates[showNumber]);

                    //set prev id using current show id
                    prevShowId = currentShowId;

                    document.getElementById(showNumber).setAttribute('class', 'active');
                    document.getElementById(currentShowId).setAttribute('class', '');

                    //set current show id using new show number
                    currentShowId = showNumber;

                    //set up animation line
                    if(currentShowId != (datesArray.length-1)){
                        countDistance();
                        setAnimationLine();
                    }
                    
                }

                function countDistance(){
                    //console.log(data.features[prevShowId].information.distanceSoFar);
                    //console.log(data.features[currentShowId].information.distanceSoFar);

                    milesConverter1(data.features[prevShowId].information.distanceSoFar);
                    milesConverter2(data.features[currentShowId].information.distanceSoFar);

                    var mi1;
                    var mi2;

                    function milesConverter1(valNum) {
                      mi1 = valNum * 0.62137;
                    }

                    function milesConverter2(valNum) {
                      mi2 = valNum * 0.62137;
                    }

                    $('.numberMiles').each(function () {
                        $(this).prop('Counter',mi1).animate({
                            Counter: mi2
                        }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (now) {
                                $(this).text(Math.ceil(now));
                            }
                        });
                    });

                    $('.numberKm').each(function () {
                        $(this).prop('Counter',data.features[prevShowId].information.distanceSoFar).animate({
                            Counter: data.features[currentShowId].information.distanceSoFar
                        }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (now) {
                                $(this).text(Math.ceil(now));
                            }
                        });
                    });
                }

                function setAnimationLine(){

                    //push both coordinates into array
                    geojson.features[0].geometry.coordinates.push(data.features[prevShowId].geometry.coordinates);
                    geojson.features[0].geometry.coordinates.push(data.features[currentShowId].geometry.coordinates);

                    flyTo = true;
                    if(flyTo){
                        animateLine();
                    }

                }

                // animated in a circle as a sine wave along the map.
                function animateLine() {
                    // then update the map
                    map.getSource('line-animation').setData(geojson);
                    // Request the next frame of the animation.
                    if(flyTo){
                        animation = requestAnimationFrame(animateLine);
                    }
                    flyTo = false;
                }


            });
        }
    });
}

function hideInfo(){
    $('.nav .main').removeClass('show');
    $('.nav .main').addClass('hide');

    $('.nav .icon').removeClass('hide');
    $('.nav .icon').addClass('show');
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}