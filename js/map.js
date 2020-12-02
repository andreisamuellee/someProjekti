
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVpaCIsImEiOiJja2h2czJrdTUwaTNyMzRtb3JrZjVvYnpmIn0.QGfO5Fq0XigYlW9b89K4aA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [24.94, 60.19],
  zoom: 11
});

var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
map.on('load', function () {
  geolocate.trigger();
});

function postsToMap(data) {
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
        new mapboxgl.Marker()
        .setLngLat(feature.center)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML(
          '<h2>'+data.Otsikko+'</h2><p>Posted: '+data.Aikaleima+'</p><p>'+data.Katuosoite + ', ' + data.Paikkakunta+'</p><p>'+data.Tiedot+'</p'
          ))
        .addTo(map);
      }
    });
}

