<template>
  <div class="home">
    <h1>BVis System</h1>
    <hr>
    <pre>
      1.  2017/04/21   16:05   <router-link to="/traffic">Traffic</router-link>
      <br>
      2.  2017/08/14   09:51   <router-link to="/force">Force</router-link>
      <br>
      3.  2018/06/29   15:35   <router-link to="/uncertainty">Uncertainty</router-link>
    </pre>
  </div>
</template>

<script>

  export default {
    name: 'Home',
  }
</script>

<style scoped lang="less">
  .home {
    h1 {
      margin-left: 10px;
    }

    pre {
      font: 15px sans-serif
    }
  }
</style>
