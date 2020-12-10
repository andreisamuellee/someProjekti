
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVpaCIsImEiOiJja2h2czJrdTUwaTNyMzRtb3JrZjVvYnpmIn0.QGfO5Fq0XigYlW9b89K4aA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [24.94, 60.19],
  zoom: 11
});

var directions = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  interactive: 0
});
if (map.tap) map.tap.disable();
map.addControl(directions, 'top-left');

var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  showAccuracyCircle: false
});
// Add the control to the map.
map.addControl(geolocate);
map.on('load', function () {
  geolocate.trigger();
});

geolocate.on('geolocate', (e) => {
  console.log('user location: ' + e.coords.longitude, e.coords.latitude)
  directions.setOrigin(e.coords.longitude + ',' + e.coords.latitude);
});

function postsToMap(post) {
  let i = 0;
  post.forEach((data) => {
    var el = document.createElement('div');
    el.innerHTML = '<div><a class="navIcon log-out" href="#"><i class="fas fa-map-marker-alt"></i></a></div>';
    el.id = 'marker' + data.PostausID;

    const btn = document.createElement('button');
    btn.innerHTML = '<button class="naviButton">Navigate</button>';

    var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
    mapboxClient.geocoding
      .forwardGeocode({
        query: data.Katuosoite + ', ' + data.Paikkakunta,
        autocomplete: false,
        limit: 1
      })
      .send()
      .then(function (response) {
        if (
          response &&
          response.body &&
          response.body.features &&
          response.body.features.length
        ) {
          var feature = response.body.features[0];
          new mapboxgl.Marker(el, { color: '#f6511d' })
            .setLngLat(feature.center)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
              '<h2 class="markerHeader">' + data.Otsikko + '</h2>' +
              '<img src=' + url + '/thumbnails/' + data.KuvaTiedosto + ' class="markerImg" id="id' + data.PostausID + '"></img>'
            ))
            .addTo(map);
          el.addEventListener('click', () => {
            const btn = document.querySelector('#naviButton' + data.PostausID);
            console.log(btn);
            el.addEventListener('click', () => {
              const controls = document.querySelector('.mapboxgl-ctrl-directions').style.visibility = "visible";
              directions.setDestination(feature.center);
              console.log('spot location: ' + feature.center);
            });
          });
        }
      });
  });
}


if (document.querySelector('.naviButton') != null) {
  console.log('Not null! ' + document.querySelector('.naviButton'));
}



