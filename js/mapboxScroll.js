var startPos;
var flyTo = false;
var popup;
var venueImg;

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

        //start position
        startPos = data.features[0].geometry.coordinates;

        //if data ready load map
        if(data){
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/proteins22/cja9yhzqw1yhg2ro21li3u1u5',
                center: startPos,
                zoom: 6,
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
            var currentShowId = '0'; // the current show id
            var prevShowId; // the previous show id

            //add line layer
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

                // zoom out when last date reached
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
                        zoom: 6,
                        bearing: getRandomInt(14, 22),
                        pitch: 22
                    });
                }
               
                //generate dates
                var num = i;
                num = 1 + i;
                $('.dates').append('<section id="' + i + '" class="'+(data.features[i].information.venueImg || data.features[i].information.venueImg2 ? 'image':'')+'"> <div class="img mobile">' +
                    (data.features[i].information.festival ? '<img class="festival" src="' +
                        data.features[i].information.venueImg +'"/>' : (data.features[i].information.venueImg === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' + data.features[i].information.venueId +'/large_avatar"/>': (data.features[i].information.venueImg2 === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' + data.features[i].information.venueId +'/col2"/>': '') ) ) + '</div><div class="showCounter">#'+num+'</div><div class="col"><h3 class="date">' + data.features[i].information.dateOfShow + '</h3>' + (data.features[i].information.supportAct ? '<h4 class="support">with: ' + data.features[i].information.supportAct + '</h4>': '') + (data.features[i].information.venue ? '<h1 class="venue">' + data.features[i].information.venue + '</h1>': '<h1 class="venue">' + data.features[i].information.city + '</h1>') + '<p class="location">'+ data.features[i].information.city+', '+ data.features[i].information.country + '</p>' + (data.features[i].information.festival ? '' : (data.features[i].information.venueId ? '<a class="mobile" href="//www.songkick.com/venues/'+data.features[i].information.venueId + '/calendar" target="_blank">See all upcoming shows</a>': '')) + '</div>' + (data.features[i].information.metroId ? '<a href="https://www.songkick.com/metro_areas/'+ data.features[i].information.metroId +'" class="track mobile" target="_blank">Track Location</a>': '')
                );

                var markers = data.features[i].geometry.coordinates;
                var el = document.createElement('div');
                    el.id = 'marker'+i;
                    el.setAttribute("data-id", i);

                if(!mobile){
                    popup = new mapboxgl.Popup().setHTML((data.features[i].information.venue ? '<h4 class="venue">' + data.features[i].information.venue + '</h4>': '<h4 class="venue">' + data.features[i].information.city + '</h4>') + (data.features[i].information.festival ? '<img class="festival" src="' + data.features[i].information.venueImg +'"/>' : (data.features[i].information.venueImg === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' + data.features[i].information.venueId +'/large_avatar"/>': (data.features[i].information.venueImg2 === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' +data.features[i].information.venueId +'/col2"/>': ''))) + (data.features[i].information.festival ? '' : (data.features[i].information.venueId ? '<a class="html" href="//www.songkick.com/venues/'+data.features[i].information.venueId + '/calendar" target="_blank">See all upcoming shows</a>': '')) + (data.features[i].information.metroId ? '<a href="https://www.songkick.com/metro_areas/'+ data.features[i].information.metroId +'" class="track" target="_blank">Track Location</a>': ''));
                }
                else {
                    popup = new mapboxgl.Popup();
                }

                new mapboxgl.Marker(el).setLngLat(markers).setPopup(popup).addTo(map);
            });

            //turn array into object
            var tourDates = datesArray.reduce(function(acc, cur, i) {
                acc[i] = cur;
                return acc;
            }, {});

            //map ready
            map.on('load', function () {
                
                $('.preloader').fadeOut();
                $('.dates section:first-child').addClass('active');
                setMarkers();

                // autoplay function
                /* function auto() {
                    var firstShowNumber = $(".dates section.active");
                    var showNumber = $(firstShowNumber).attr('id');
                    setActiveShow(showNumber);
                    $(firstShowNumber).removeClass('active');
                    $(firstShowNumber).next().addClass('active');
                }
                window.setInterval(auto, 2000); */

                // on click function
                $(".dates section").click(function(){
                    var showNumber = $(this).attr('id');
                    hideInfo();
                    $('html, body').animate({
                        scrollTop: $(this).offset().top
                    }, 'slow', function(){
                        setActiveShow(showNumber);
                    });
                });

                // on scroll function
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

                    var a = document.getElementById(showNumber);
                    a.classList.add("active");

                    var b = document.getElementById(currentShowId);
                    b.classList.remove("active");

                    //set current show id using new show number
                    currentShowId = showNumber;

                    //set up animation line
                    if(currentShowId != (datesArray.length-1)){
                        countDistance();
                        setAnimationLine();
                        setMarkers();
                        $('body').removeClass('complete');
                    }
                    else {
                        $('body').addClass('complete');
                        interaction();
                    }
                    
                }

                function countDistance(){

                    $('.distance').removeClass('hide');

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
                            duration: 1000,
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
                            duration: 1000,
                            easing: 'swing',
                            step: function (now) {
                                $(this).text(Math.ceil(now));
                            }
                        });
                    });
                }

                function setAnimationLine(){

                    geojson.features[0].geometry.coordinates.push(data.features[prevShowId].geometry.coordinates);
                    geojson.features[0].geometry.coordinates.push(data.features[currentShowId].geometry.coordinates);

                    flyTo = true;
                    if(flyTo){
                        animateLine();
                    }

                }

                function animateLine() {
                    // then update the map

                    if( parseFloat(prevShowId,10) < parseFloat(currentShowId,10) ){
                        map.getSource('line-animation').setData(geojson);
                    }

                    flyTo = false;
                    // Request the next frame of the animation.
                    if(flyTo){
                        animation = requestAnimationFrame(animateLine);
                    }
                    
                }

                function setMarkers() {
                    $('.mapboxgl-popup').html('');
                    $('.mapboxgl-marker').each(function(){
                        if ( $(this).attr("data-id") === currentShowId ){
                            $(this).addClass('visited');
                            $(this).addClass('activeMarker');

                            if(!mobile){
                                i = currentShowId;
                                popup.setLngLat(data.features[i].geometry.coordinates).setHTML((data.features[i].information.venue ? '<h4 class="venue">' + data.features[i].information.venue + '</h4>': '<h4 class="venue">' + data.features[i].information.city + '</h4>') + (data.features[i].information.festival ? '<img class="festival" src="' + data.features[i].information.venueImg +'"/>' : (data.features[i].information.venueImg === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' + data.features[i].information.venueId +'/large_avatar"/>': (data.features[i].information.venueImg2 === true ? '<img src="//images.sk-static.com/images/media/profile_images/venues/' + data.features[i].information.venueId +'/col2"/>': ''))) + (data.features[i].information.festival ? '' : (data.features[i].information.venueId ? '<a class="html" href="//www.songkick.com/venues/'+data.features[i].information.venueId + '/calendar" target="_blank">See all upcoming shows</a>': '')) + (data.features[i].information.metroId ? '<a href="https://www.songkick.com/metro_areas/'+ data.features[i].information.metroId +'" class="track" target="_blank">Track Location</a>': '')).addTo(map);
                            }
                        }
                        else {
                            $(this).removeClass('activeMarker');
                        }
                    });
                }
            });
        }
    });
}

function interaction(){
    $('.mapboxgl-marker').click(function(){
        $('body').addClass('interact');
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