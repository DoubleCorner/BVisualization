<template>
  <div class="map">
  </div>
</template>

<script>
  export default {
    name: 'Map',
    data() {
      return {}
    },
    mounted() {
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