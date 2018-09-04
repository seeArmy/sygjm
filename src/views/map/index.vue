<template>
  <div class="map-container">
    <div class="map-content">
      <el-row class="map-layout" :gutter="4">
        <el-col :span="20" class="left-layout">
            <div class="left-layout">
              <div class="map-wrapper" id="mapWrapper"></div>
              <div class="map-message">
                <div class="message-frame">
                  <p>您正在与XXX聊天</p>
                  <div class="message-dialog"></div>
                  <div class="message-input">
                    <input type="text" placeholder="请输入消息"/>
                  </div>
                </div>
              </div>
            </div>
        </el-col>
        <el-col :span="4" class="persion-list" >
          <div class="user-info">
            <p>当前管理员：XXXX</p>
            <p>当前总在线人数：20人</p>
          </div>
          <el-tabs class="persion-items" v-model="persionType" type="border-card">
            <el-tab-pane v-for="item in persionTypes" :label="item.label" :key='item.key' :name="item.key">
              <el-tree :data="persions" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        persionTypes: [{ label: '民兵', key: '1' }, { label: '警察', key: '2' }, { label: '武警', key: '3' }],
        persionType: '1',
        persions: [{
          label: '当前民兵在线人数：20',
          children: [{
            label: '张三'
          }, {
            label: '李四'
          }, {
            label: '王五'
          }, {
            label: '赵六'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      const map = new AMap.Map('mapWrapper', {
        enableHighAccuracy: true,
        zoom: 20
      })
      AMap.plugin('AMap.ToolBar', function() { // 异步加载插件
        var toolbar = new AMap.ToolBar()
        map.addControl(toolbar)
      })
    },
    created() {

    },
    methods: {
      handleNodeClick(data) {
        console.log(data)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .map-container{
    position: relative;
    width: 100%;
    height:calc(100vh - 84px);
    min-height: 700px;
    .map-content{
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      .map-layout{
        height:100%;
        width: 100%;
        position: relative;
        .left-layout{
          height:100%;
          .map-wrapper{
            height: 70%;
            width: 99%;
            margin: 0 auto;
          }
          .map-message{
            height: 30%;
            width: 99%;
            margin: 0 auto;
            .message-frame{
              width: 100%;
              height: 100%;
              position: relative;
              .message-dialog{
                min-height: 150px;
                width: 100%;
                background: #ebe9e9;
                border: 1px solid #AAAAAA;
                border-radius: 8px;
              }
              .message-input{
                width: 100%;
                >input{
                  width: 100%;
                  border: 1px solid #CCC;
                  height: 40px;
                  margin-top: 5px;
                  border-radius: 4px;
                  text-indent: 10px;
                }
              }
            }
          }
        }

        .persion-list{
          height: 100%;
          .user-info{
            height: 100px;
            width: 100%;
          }
          .persion-items{
            height:calc(100% - 100px);
          }
        }
      }
    }

  }
</style>
