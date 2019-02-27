<template>
  <div id="map">
  </div>
</template>

<script>

  export default {
    name: 'Map',
    data() {
      return {}
    },
    mounted() {
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