<template>
  <div class="footer">
    <span class="copyright">Copyright © p_wq@outlook.com</span>
  </div>
</template>

<script>
  export default {
    name: 'Footer'
  };
</script>

<style scoped lang="less">
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 20px;
    background-color: #646464;
    color: #ffffff;
    font-size: small;
    display: flex;
    justify-content: flex-end;

    .copyright {
      margin-right: 10px;
    }
  }
</style>