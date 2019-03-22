<template>
  <div class="container">
    <div id="map"></div>
    <div class="btn-tool">
      <div v-for="item in toolImgList">
        <div class="img-div" :class="{active: item.selected}" @click="clickTools(item)">
          <img class="img-tool" :src="item.img" alt="" :title="item.title">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3';
  import * as L from 'leaflet';
  import circleImg from '../assets/circle.png';
  import eraserImg from '../assets/eraser.png';
  import handImg from '../assets/hand.png';
  import rectImg from '../assets/rect.png';
  import sectionImg from '../assets/section.png';
  import stationImg from '../assets/station.png';

  export default {
    name: 'Map',
    data() {
      return {
        timeExtent: [new Date('2016-1-1'), new Date('2016-2-1')],
        speedColor: d3.interpolate('red', 'green'),
        reflect: d3.scale
          .linear()
          .domain([5, 45])
          .range([0, 1]),
        toolImgList: [
          {img: handImg, title: 'control map', selected: false, type: 'hand'},
          {img: circleImg, title: 'select area by circle', selected: false, type: 'circle'},
          {img: rectImg, title: 'select area by rect', selected: false, type: 'rect'},
          {img: eraserImg, title: 'eraser the selected', selected: false, type: 'eraser'},
          {img: sectionImg, title: 'all sections speed', selected: false, type: 'section'},
          {img: stationImg, title: 'all stations heat map', selected: false, type: 'station'}
        ],
        networkShow: false,
        heatmapShow: false,
        firstRequest: true,
        tiles: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      };
    },
    mounted() {
      let tiles = L.tileLayer(this.tiles, {
        maxZoom: 20,
        minZoom: 5
      });
      this.map = new L.Map('map', {
        preferCanvas: true,
        zoomControl: false,
        attributionControl: false
      }).addLayer(tiles).setView(new L.LatLng(31.457514, 104.753437), 10);

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
    methods: {
      createSectionSpeedNoRoute(sectionId, path) {
        this.axios.get('/api/sectionRunData/noRoute', {
          params: {
            sectionId: sectionId,
            startTime: this.timeExtent[0].getTime(),
            endTime: this.timeExtent[1].getTime()
          }
        }).then(aveSpeed => {
          if (aveSpeed.data !== -1) {
            L.polyline(path, {
              color: this.speedColor(this.reflect(aveSpeed.data)),
              weight: 2,
              opacity: 1
            }).addTo(this.map);
          }
        });
      },
      clickTools(item) {
        this.toolImgList.forEach(item => item.selected = false);
        item.selected = true;
        switch (item.type) {
          case 'section': {
            this.sectionInfo.forEach(item => this.createSectionSpeedNoRoute(item.section_id, JSON.parse(item.path)));
            break;
          }
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .container {
    position: relative;
    float: left;
    border: solid black;
    border-width: 0 1px 1px 1px;
    height: 70%;
    width: calc(85% - 430px);

    #map {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .btn-tool {
      position: absolute;
      pointer-events: auto;
      left: 11px;
      top: 100px;
      z-index: 1;

      .img-div {
        border: 1px #909399 solid;
        border-radius: 5px;
        width: 34px;
        height: 34px;
        padding: 4px;
        margin-bottom: 3px;
        background-color: rgba(144, 147, 153, 0.75);

        .img-tool {
          width: 24px;
          height: 24px;
        }
      }

      .active {
        background-color: #000000;
      }
    }
  }

</style>