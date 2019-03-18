<template>
  <div class="header">
    <span class="title">BVis System</span>
    <span class="time">{{nowTime}}</span>
  </div>
</template>
<script>
  export default {
    name: 'Header', data() {
      return {
        nowTime: ''
      };
    }, mounted() {
      this.formatTime();
      setInterval(this.formatTime, 60000);
    }, methods: {
      formatTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = date.getDate();
        day = day < 10 ? '0' + day : day;
        let hour = date.getHours();
        hour = hour < 10 ? '0' + hour : hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        this.nowTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      }
    }
  };
</script>
<style scoped lang="less">
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 20px;
    background-color: #646464;
    color: #ffffff;
    font-size: small;
    display: flex;
    justify-content: space-between;

    .title {
      margin-left: 10px;
    }

    .time {
      margin-right: 10px;
    }
  }
</style>