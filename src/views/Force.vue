<template>
  <div class="force">
    <svg class="draw"></svg>
  </div>
</template>
<script>
  import * as d3 from "d3";

  export default {
    name: "Force",
    data() {
      return {
        nodes: [],
        links: []
      };
    },
    mounted() {
      this.axios
        .get("/api/networkData/stations")
        .then(stations => {
          this.stationInfo = stations.data;
          this.indexStation = d3.map();
          this.nodes = this.stationInfo.map((item, i) => {
            this.indexStation.set(item.station_id, i);
            return {
              id: item.station_id,
              name: item.station_name,
              size: item.routes_number
            };
          });
          this.axios
            .get("/api/networkData/sections")
            .then(sections => {
              this.sectionInfo = sections.data;
              this.links = this.sectionInfo.map(item => {
                return {
                  source: this.indexStation.get(item.from_id),
                  target: this.indexStation.get(item.target_id)
                };
              });
              this.drawForceGraph();
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    },
    methods: {
      drawForceGraph() {
        const height = parseInt(d3.select(".draw").style("height"));
        const width = parseInt(d3.select(".draw").style("width"));

        const rScale = d3.scale
          .linear()
          .domain(d3.extent(this.nodes, d => d.size))
          .range([2, 10]);
        const svg = d3.select(".draw");

        let force = d3.layout
          .force()
          .nodes(this.nodes)
          .links(this.links)
          .size([width, height])
          .linkDistance(20)
          .charge([-8])
          .start();

        let svgLinks = svg
          .selectAll("line")
          .data(this.links)
          .enter()
          .append("line")
          .attr("class", "force-link");

        let svgNodes = svg
          .selectAll("circle")
          .data(this.nodes)
          .enter()
          .append("circle")
          .attr("class", "force-node")
          .attr("r", d => rScale(d.size))
          .call(force.drag);

        force.on("end", function () {
          svgLinks.attr("x1", d => d.source.x);
          svgLinks.attr("y1", d => d.source.y);
          svgLinks.attr("x2", d => d.target.x);
          svgLinks.attr("y2", d => d.target.y);
          svgNodes.attr("cx", d => d.x);
          svgNodes.attr("cy", d => d.y);
        });
      }
    }
  };
</script>
<style scoped lang='less'>
  .force {
    background-color: #ffffff;
    position: absolute;
    width: 100%;
    height: 100%;

    .draw {
      width: 100%;
      height: 100%;
      position: absolute;

      .link {
        stroke: #999999;
        stroke-opacity: 0.6;
      }

      .node {
        fill: #1f77b4;
        stroke: #ffffff;
        stroke-width: 0.5;
      }
    }
  }
</style>
<style lang='less'>
  .force-link {
    stroke: #999999;
    stroke-opacity: 0.6;
  }

  .force-node {
    fill: #1f77b4;
    stroke: #ffffff;
    stroke-width: 0.5;
  }
</style>