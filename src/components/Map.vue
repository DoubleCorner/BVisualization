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
        stationLayerData: [],
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
        firstRequest: true
      };
    },
    mounted() {
      mapBoxGL.accessToken = 'pk.eyJ1IjoiY29ybmVyIiwiYSI6ImNqMHZ1NmM3bTAwMzYycXJzMmdmNjZ3am4ifQ.7oCzveSFDF1eSnm8QcdpXQ';
      this.map = new mapBoxGL.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        minZoom: 5,
        maxZoom: 25,
        center: [104.753437, 31.457514],
        zoom: 10,
        pitch: 45,
        bearing: -17.6
      });


      this.axios.get('/api/networkData/stations').then(result => {
        this.stationInfo = result.data;
        this.stationLayerData = this.stationInfo.map(item => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude]
            },
            properties: {
              info: item,
              routesNumber: item.routes_number
            }
          };
        });
        this.map.addSource('stationSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        this.map.addLayer({
          id: 'stationHeatmap',
          type: 'heatmap',
          source: 'stationSource',
          maxzoom: 15,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'routesNumber'],
              0, 0,
              10, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              15, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 2,
              15, 20
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 1,
              15, 0
            ]
          }
        });
        this.map.addLayer({
          id: 'stationPoints',
          type: 'circle',
          source: 'stationSource',
          minzoom: 13,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, [
                'interpolate',
                ['linear'],
                ['get', 'routesNumber'],
                1, 3,
                10, 8
              ],
              25, [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                1, 5,
                10, 50
              ]
            ],
            'circle-color': '#FDBB84',
            'circle-stroke-color': 'gray',
            'circle-stroke-width': 1
          }
        }, 'waterway-label');
        this.axios.get('/api/networkData/sections').then(result => {
          this.sectionInfo = result.data;
          this.map.addSource('sectionSource', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });
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
          this.axios.get('/api/networkData/routes').then(result => {
            this.routesInfo = result.data;
          }).catch(error => console.log(error));
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    },
    methods: {
      createSectionSpeedNoRoute(section, path) {
        this.axios.get('/api/sectionRunData/noRoute', {
          params: {
            sectionId: section.section_id,
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
              color: 'gray',
              info: section
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
            if (this.networkShow) {
              this.map.getSource('sectionSource').setData({
                type: 'FeatureCollection',
                features: []
              });
            } else {
              if (this.firstRequest) {
                this.sectionInfo.forEach(item => {
                  let path = JSON.parse(item.path).map(p => [p[1], p[0]]);
                  this.createSectionSpeedNoRoute(item, path);
                });
                this.firstRequest = false;
              } else {
                this.map.getSource('sectionSource').setData({
                  type: 'FeatureCollection',
                  features: this.sectionLayerData
                });
              }
            }
            this.networkShow = !this.heatmapShow;
            break;
          }
          case 'station': {
            if (this.heatmapShow) {
              this.map.getSource('stationSource').setData({
                type: 'FeatureCollection',
                features: []
              });
            } else {
              this.map.getSource('stationSource').setData({
                type: 'FeatureCollection',
                features: this.stationLayerData
              });
            }
            this.heatmapShow = !this.heatmapShow;
            break;
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
        border: 1px #909399 solid;
        border-radius: 5px;
        width: 34px;
        height: 34px;
        padding: 4px;
        margin-bottom: 3px;
        background-color: rgba(144, 147, 153, 0.5);

        .img-tool {
          width: 24px;
          height: 24px;
        }
      }

      .active {
        background-color: #909399;
      }

    }
  }
</style>