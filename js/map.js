
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
          map.on('load', function() {
            geolocate.trigger();
          });
          var marker = new mapboxgl.Marker()
          .setLngLat([24.94, 60.19])
          .addTo(map);
        