<template>
  <div id="map">
  </div>
</template>

<script>
  import mapBoxGL from 'mapbox-gl';

  export default {
    name: 'Map',
    data() {
      return {}
    },
    mounted() {
      mapBoxGL.accessToken = 'pk.eyJ1IjoiY29ybmVyIiwiYSI6ImNqMHZ1NmM3bTAwMzYycXJzMmdmNjZ3am4ifQ.7oCzveSFDF1eSnm8QcdpXQ';
      let map = new mapBoxGL.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        minZoom: 5,
        maxZoom: 17,
        center: [104.753437, 31.457514],
        zoom: 10,
        pitch: 45,
        bearing: -17.6,
      });
      this.axios.get('/api/networkData/stations').then(result => {
        this.stationInfo = result.data;
        this.axios.get('/api/networkData/sections').then(result => {
          this.sectionInfo = result.data;
          this.axios.get('/api/networkData/routes').then(result => {
            this.routesInfo = result.data;
          }).catch(error => console.log(error));
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    },
    methods: {}
  }
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