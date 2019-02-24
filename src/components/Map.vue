<template>
  <div class="map">
    <LMap :zoom="zoom" :center="center">
      <LTileLayer :url="url"></LTileLayer>
    </LMap>
  </div>
</template>

<script>
  import {LMap, LTileLayer} from 'vue2-leaflet';

  export default {
    name: 'Map',
    components: {
      LMap,
      LTileLayer
    },
    data() {
      return {
        zoom: 11,
        center: L.latLng(31.457514, 104.753437),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      }
    },
    mounted() {
      // this.axios.get('/api/networkData/stations').then(result => {
      //   this.stationInfo = result.data;
      // }).catch(error => console.log(error));
      // this.axios.get('/api/networkData/sections').then(result => {
      //   this.sectionInfo = result.data;
      // }).catch(error => console.log(error));
      // this.axios.get('/api/networkData/routes').then(result => {
      //   this.routesInfo = result.data;
      // }).catch(error => console.log(error));
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .map {
    position: relative;
    float: left;
    border: solid black;
    border-width: 0 1px 1px 1px;
    height: 70%;
    width: calc(85% - 430px);
  }

</style>