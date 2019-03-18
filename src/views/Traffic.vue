<template>
  <div class="traffic">
    <Header></Header>
    <div class="all-view">
      <Section></Section>
      <Map></Map>
      <Important></Important>
      <StayTime></StayTime>
      <DayStayTime></DayStayTime>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Footer from "../components/Footer";
  import Header from "../components/Header";
  import Section from "../components/Section";
  import Map from "../components/Map";
  import Important from "../components/Important";
  import StayTime from "../components/StayTime";
  import DayStayTime from "../components/DayStayTime";

  export default {
    name: "Traffic",
    components: {
      Header,
      Footer,
      Section,
      Map,
      Important,
      StayTime,
      DayStayTime
    }
  };
</script>

<style scoped lang="less">
  .traffic {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;

    .all-view {
      position: fixed;
      top: 20px;
      bottom: 20px;
      width: 100%;
    }
  }
</style>
