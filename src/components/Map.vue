<template>
  <div id="map">
    <div class="btn-tool">
      <div v-for="item in toolImgList">
        <div class="img-container" :class="{active: item.selected}" @click="clickTools(item)">
          <img class="img-tool" :src="item.img" alt="" :title="item.title">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mapBoxGL from 'mapbox-gl';
  import * as d3 from 'd3';
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
        sectionLayerData: [],
        toolImgList: [{img: handImg, title: 'control map', selected: false, type: 'hand'},
          {img: circleImg, title: 'select area by circle', selected: false, type: 'circle'},
          {img: rectImg, title: 'select area by rect', selected: false, type: 'rect'},
          {img: eraserImg, title: 'eraser the selected', selected: false, type: 'eraser'},
          {img: sectionImg, title: 'all sections speed', selected: false, type: 'section'},
          {img: stationImg, title: 'all stations heat map', selected: false, type: 'station'}],
        networkShowFlag: false,
        firstRequest: true
      };
    },
    mounted() {
      mapBoxGL.accessToken = 'pk.eyJ1IjoiY29ybmVyIiwiYSI6ImNqMHZ1NmM3bTAwMzYycXJzMmdmNjZ3am4ifQ.7oCzveSFDF1eSnm8QcdpXQ';
      this.map = new mapBoxGL.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        minZoom: 5,
        maxZoom: 17,
        center: [104.753437, 31.457514],
        zoom: 10,
        pitch: 45,
        bearing: -17.6
      });

      this.axios.get('/api/networkData/stations').then(result => {
        this.stationInfo = result.data;
        this.axios.get('/api/networkData/sections').then(result => {
          this.map.addSource('sectionSource', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });
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
          let sectionStyle = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: path
            },
            properties: {
              color: 'gray'
            }
          };
          if (aveSpeed.data !== -1) {
            sectionStyle.properties.color = this.speedColor(this.reflect(aveSpeed.data));
          }
          this.sectionLayerData.push(sectionStyle);
          this.map.getSource('sectionSource').setData({
            type: 'FeatureCollection',
            features: this.sectionLayerData
          });
        });
      },
      clickTools(item) {
        this.toolImgList.forEach(item => item.selected = false);
        item.selected = true;
        switch (item.type) {
          case 'section': {
            if (this.networkShowFlag) {
              this.map.removeLayer('sectionLayer');
              this.networkShowFlag = false;
            } else {
              //control layer by source
              this.map.addLayer({
                id: 'sectionLayer',
                type: 'line',
                source: 'sectionSource',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': ['get', 'color'],
                  'line-width': 3
                }
              });
              if (this.firstRequest) {
                this.sectionInfo.forEach(item => {
                  let path = JSON.parse(item.path).map(p => [p[1], p[0]]);
                  this.createSectionSpeedNoRoute(item.section_id, path);
                });
                this.firstRequest = false;
              }
              this.networkShowFlag = true;
            }

          }
        }
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

    .btn-tool {
      position: absolute;
      pointer-events: auto;
      left: 11px;
      top: 100px;
      z-index: 1;

      .img-container {
        border: 1px #409EFF solid;
        border-radius: 5px;
        width: 34px;
        height: 34px;
        padding: 4px;
        margin-bottom: 3px;
        background-color: rgba(64, 158, 255, 0.15);

        .img-tool {
          width: 24px;
          height: 24px;
        }
      }

      .active {
        background-color: #409EFF;
      }

    }
  }
</style>