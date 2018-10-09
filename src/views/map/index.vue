<template>
  <div class="map-container">
    <div class="map-content">
      <el-row class="map-layout" :gutter="4">
        <el-col :span="20" class="left-layout">
            <div class="left-layout">
              <div class="map-wrapper" id="mapWrapper"></div>
              <div class="map-message">
                <div class="message-frame">
                  <p>消息上报列表:</p>
                  <div class="message-dialog">
                    <p class="message-item" v-for="item in msgs">{{item.sendUser}} [{{item.Time}}]: {{item.Content}}
                      <el-button size="mini" type="danger" style="margin-left: 20px;" @click="startSend(item)">消息上报
                      </el-button>
                    </p>
                  </div>
                  <!--<div class="message-input">-->
                    <!--<input type="text" placeholder="请输入消息"/>-->
                  <!--</div>-->
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
              <el-tree :data="item.users" :props="defaultProps" @node-click="drawLineByUser"></el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="消息上报" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="消息提供者" prop="sendUser">
          <el-input v-model="temp.sendUser" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="消息" prop="Content">
          <el-input
            type="textarea"
            readonly="true"
            :rows="2"
            v-model="temp.Content">
          </el-input>
        </el-form-item>
        <el-form-item v-if="temp.img" label="图片" prop="img">
          <img :src="temp.img" width="200px" height="200px"/>
        </el-form-item>
        <el-form-item label="上报对象" prop="userId">
          <el-select class="filter-item" v-model="temp.userId" placeholder="请选择上报对象">
            <el-option v-for="item in sendUsers" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="sendMessageToLeader()">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getPositionByUserId, getAllUserTypes, freshMessage, sendMessage } from '@/api/map'
  export default {
    name: 'index',
    data() {
      return {
        persionTypes: [],
        persionType: null,
        map: null,
        timer: null,
        msgTimer: null,
        msgs: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        sendUsers: [{ label: '九如科技', key: 1 }, { label: '陈子斌', key: 2 }],
        temp: {
          Id: '',
          img: '',
          Content: '',
          sendUser: '',
          userId: ''
        },
        rules: {
          userId: [{ required: true, message: '必填项', trigger: 'change' }]
        }
      }
    },
    mounted() {
      this.initMap()
      this.getAllUserTypes()
      this.freshMessage()
  },
    created() {

    },
    methods: {
      getPositionByUserId(id, cb) {
        getPositionByUserId({ id: id }).then(response => {
          const paths = response.data.points
          cb(paths)
        })
      },
      getAllUserTypes() {
        getAllUserTypes().then(response => {
          const types = response.data.points
          const persionTypes = []
          types.forEach((type) => {
            const persions = { label: '当前' + type.TypeName + '在线人数：' + type.users.length }
            persions.children = []
            type.users.forEach((user) => {
              persions.children.push({
                label: user.userName,
                id: user.UserId,
                x: user.x,
                y: user.y,
                pic: user.Headportrait
              })
            })
            persionTypes.push({ label: type.TypeName, key: type.TypeId + '', users: [persions] })
          })
          this.persionTypes = persionTypes
          this.persionType = this.persionTypes.length ? this.persionTypes[0].key : null
        })
      },
      initMap() {
        this.map = new AMap.Map('mapWrapper', {
          enableHighAccuracy: true,
          resizeEnable: true,
          zoom: 14
        })
        this.map.setMapStyle('amap://styles/blue')

        var clickHandler = function(e) {
          console.log('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！')
        }
        this.map.on('click', clickHandler)
        AMap.plugin(['AMap.ToolBar', 'AMap.MapType', 'AMap.GraspRoad'], () => { // 异步加载插件
          var toolbar = new AMap.ToolBar()
          var mapType = new AMap.MapType()
          this.map.addControl(toolbar)
          this.map.addControl(mapType)
        })
      },
      drawLineByUser(user) {
        if (user.id) {
          this.map.setZoom(14)
          this.map.setCenter([user.x, user.y])
          setTimeout(() => {
            this.map.setZoom(18)
          }, 500)
          this.drawLineByUserMethod(user)
          this.freshPosition(user)
        }
      },
      drawLineByUserMethod(user, cb) {
        this.map.clearMap()
        this.drawPosition(user)
        this.getPositionByUserId(user.id, (pathParam) => {
          var path1 = []
          for (var i = 0; i < pathParam.length; i += 1) {
            path1.push([pathParam[i].x, pathParam[i].y])
          }
          var oldLine = new AMap.Polyline({
            path: path1,
            strokeWeight: 3,
            strokeOpacity: 1,
            strokeColor: 'red'
          })
          this.map.add(oldLine)
          if (cb)cb()
        })
      },
      drawPosition(user) {
        var marker = new AMap.Marker({
          position: [user.x, user.y], // 基点位置
          draggable: false, // 是否可拖动
          offset: new AMap.Pixel(-17, -42), // 相对于基点的偏移位置
          content: '<div class="marker-route" style="background: url(' + user.pic + ');background-size: contain;"></div>'
        })
        this.map.add(marker)
      },
      freshPosition(user) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.drawLineByUserMethod(user, () => {
            this.freshPosition(user)
          })
        }, 10000)
      },
      freshMessage() {
        clearTimeout(this.msgTimer)
        this.msgTimer = setTimeout(() => {
          this.freshMessageMethod(() => {
            this.freshMessage()
          })
        }, 5000)
      },
      freshMessageMethod(cb) {
        freshMessage().then(response => {
          this.msgs = response.data.result.rows
          if (cb) cb()
        }).catch(() => {
          if (cb) cb()
        })
      },
      startSend(item) {
        this.dialogFormVisible = true
        this.temp = Object.assign({}, item)
      },
      sendMessageToLeader() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            sendMessage({ messageId: this.temp.Id, userId: this.temp.userId }).then((data) => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '上报成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
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
                max-height: 150px;
                overflow: auto;
                width: 100%;
                background: #ebe9e9;
                border: 1px solid #AAAAAA;
                border-radius: 8px;
                .message-item{
                  padding: 5px 0;
                  margin: 0;
                  text-indent: 10px;
                }
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
