
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
var marker = new mapboxgl.Marker()
  .setLngLat([24.94, 60.19])
  .addTo(map);
/*
  for (let i = 0; i <= result.length; i++) {
    axios.get("https://api.digitransit.fi/geocoding/v1/search?text="+ result[i].address + ",Helsinki").then(function(response) {
        var el = document.createElement("div");
      el.className ="fa fa-map-marker";
      el.addEventListener('click', () =>
      {
        getMenu(result[i])
      })
      var hsl = getHslLink(result[i])
      var googleMaps = getGoogleMapsLink(result[i])
      new mapboxgl.Marker(el)
      .setLngLat(response.data.features[0].geometry.coordinates)
      .setPopup(new mapboxgl.Popup({offset:25}).setHTML('<h2>'+result[i].title+'</h2>' + hsl + googleMaps)).addTo(map);

      }).catch(function (error) {
        console.log(error);
      })
}
*/