<template>
  <div id="map"></div>
</template>

<script>
  import mapBoxGL from "mapbox-gl";
  import * as d3 from "d3";

  export default {
    name: "Map",
    data() {
      return {
        timeExtent: [new Date("2016-1-1"), new Date("2016-2-1")],
        speedColor: d3.interpolate("red", "green"),
        reflect: d3.scale
          .linear()
          .domain([5, 45])
          .range([0, 1])
      };
    },
    mounted() {
      mapBoxGL.accessToken = "pk.eyJ1IjoiY29ybmVyIiwiYSI6ImNqMHZ1NmM3bTAwMzYycXJzMmdmNjZ3am4ifQ.7oCzveSFDF1eSnm8QcdpXQ";
      this.map = new mapBoxGL.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v9",
        minZoom: 5,
        maxZoom: 17,
        center: [104.753437, 31.457514],
        zoom: 10,
        pitch: 45,
        bearing: -17.6
      });

      this.axios.get("/api/networkData/stations").then(result => {
        this.stationInfo = result.data;
        this.axios.get("/api/networkData/sections").then(result => {
          this.sectionInfo = result.data;
          this.sectionInfo.forEach(item => {
            let path = JSON.parse(item.path).map(p => [p[1], p[0]]);
            this.createSectionSpeedNoRoute(item.section_id, path);
          });
          this.axios.get("/api/networkData/routes").then(result => {
            this.routesInfo = result.data;
          }).catch(error => console.log(error));
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    },
    methods: {
      createSectionSpeedNoRoute(sectionId, path) {
        this.axios.get("/api/sectionRunData/noRoute", {
            params: {
              sectionId: sectionId,
              startTime: this.timeExtent[0].getTime(),
              endTime: this.timeExtent[1].getTime()
            }
          }).then(aveSpeed => {
            this.map.addLayer({
              id: "section" + sectionId,
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: path
                  }
                }
              },
              layout: {
                "line-join": "round",
                "line-cap": "round"
              },
              paint: {
                "line-color": this.speedColor(this.reflect(aveSpeed.data)),
                "line-width": 2
              }
            });
          });
      }
    }
  };
</script>

<style scoped lang="less">
  #map {
    position: relative;
    float: left;
    border: solid black;
    border-width: 0 1px 1px 1px;
    height: 70%;
    width: calc(85% - 430px);
  }
</style>