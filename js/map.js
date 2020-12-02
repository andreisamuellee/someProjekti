
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
  console.log('POSTAA');

  const img = document.createElement('img');
  img.src = url + '/thumbnails/' + data.KuvaTiedosto;
  img.classList.add('resp');

  img.addEventListener('click', () => {
    modalImage.src = url + '/' + data.KuvaTiedosto;
    imageModal.alt = data.Otsikko;
    imageModal.classList.toggle('hide');
  });

  const figure = document.createElement('figure').appendChild(img);

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
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
            '<h2 class="markerHeader">' + data.Otsikko + '</h2>' +
            '<img src=' + url + '/thumbnails/' + data.KuvaTiedosto + ' class="markerImg"></img>'
          ))
          .addTo(map);
      }
    });
}

