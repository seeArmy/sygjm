<template>
  <div class="map-container">
    <el-row>
      <el-col :span="20"  class="map-layout">
        <div>
          <el-row>
            <el-col :span="24" class="map-wrapper" id="mapWrapper">1</el-col>
            <el-col :span="24" class="map-message">2</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="4"  class="map-layout"><div></div></el-col>
    </el-row>
  </div>

</template>

<script>
    export default {
        name: "index",
        data() {
          return {

          }
        },
        mounted() {
          var map = new AMap.Map('mapWrapper', {
            enableHighAccuracy: true,
            zoom:20
          });
          AMap.plugin('AMap.ToolBar',function(){//异步加载插件
            var toolbar = new AMap.ToolBar();
            map.addControl(toolbar);
          });
        },
        created() {

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .map-container{
    position: relative;
    width: 100%;
    padding: 10px;
    .map-layout{
      min-height: calc(100vh - 104px);
      position: relative;
      .map-wrapper{
        height: 65vh;
      }
      .map-message{
        height: calc(35vh - 104px);;
      }
    }
  }
</style>
