<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.username')" v-model="listQuery.UserName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.Id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" :label="$t('table.userMail')">
        <template slot-scope="scope">
          <span>{{scope.row.UserMail}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" :label="$t('table.userPhone')">
        <template slot-scope="scope">
          <span>{{scope.row.UserPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" :label="$t('table.Job')">
        <template slot-scope="scope">
          <span>{{scope.row.Job}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'bind')">{{$t('table.bind')}}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='create'"  :label="$t('table.loginname')" prop="LoginName">
          <el-input v-model="temp.LoginName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"  :label="$t('table.loginpassword')" prop="Password">
          <el-input type="password" v-model="temp.Password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"  :label="$t('table.surePassword')" prop="surePassword">
          <el-input type="password" v-model="temp.surePassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="UserName">
          <el-input v-model="temp.UserName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.userPhone')" >
          <el-input v-model="temp.UserPhone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.userMail')">
          <el-input v-model="temp.UserMail"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.birthday')">
          <el-date-picker v-model="temp.Birthday" type="date" placeholder="请选择出生日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.Wechat')">
          <el-input v-model="temp.Wechat"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.QQNumber')">
          <el-input v-model="temp.QQNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.userGender')">
          <el-select class="filter-item" v-model="temp.UserGender" placeholder="请选择性别">
            <el-option v-for="item in  sexOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.Job')" prop="Job">
          <el-input v-model="temp.Job"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'用户绑定:'+temp.UserName" :visible.sync="dialogBindVisible">
      <el-tabs style='width: 100%' v-model="activeName" type="border-card">
        <el-tab-pane v-for="item in bindOptions" :label="item.label" :key='item.key' :name="item.key">
          <el-table ref="multipleTable1" :key='item.key' v-if="item.key == '1'" :data="roleList"
                    v-loading="listBindLoading" border fit highlight-current-row
                    @selection-change="handleSelectionChange"
                    style="width: 100%;min-height:300px;">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column align="center" :label="$t('table.id')" width="65">
              <template slot-scope="scope">
                <span>{{scope.row.Id}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110px" align="center" :label="$t('table.rolename')">
              <template slot-scope="scope">
                <span>{{scope.row.RoleName}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110px" align="center" :label="$t('table.role_des')">
              <template slot-scope="scope">
                <span>{{scope.row.role_des || "职位说明"}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindConfirm">{{$t('table.bind')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getAllRoles, getExistRoleIds, setRole } from '@/api/management'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'users',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      roleList: null,
      actionList: null,
      actionGroupList: null,
      total: null,
      listLoading: true,
      listBindLoading: true,
      multipleSelection: [],
      listQuery: {
        page: 1,
        rows: 10,
        UserName: ''
      },
      sexOptions: [{ label: '男', key: 1 }, { label: '女', key: 0 }],
      bindOptions: [{ label: '绑定角色', key: '1' },
        { label: '绑定菜单', key: '2' },
        { label: '绑定权限', key: '3' }],
      activeName: '1',
      showReviewer: false,
      temp: {
        Id: '',
        LoginName: '',
        Password: '',
        surePassword: '',
        UserName: '',
        UserPhone: '',
        UserMail: '',
        UserGender: 1,
        Job: '',
        Birthday: '',
        Wechat: '',
        QQNumber: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      dialogBindVisible: false,
      pvData: [],
      rules: {
        LoginName: [{ required: true, message: '必填项', trigger: 'blur' }],
        Password: [
          { validator: this.validPassword, trigger: 'blur' }
        ],
        surePassword: [
          { validator: this.validSurePassword, trigger: 'blur' }
        ],
        UserName: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.result.rows
        this.total = response.data.result.total
        this.listLoading = false
      })
    },
    getBindList(row) {
      this.listBindLoading = true
      switch (this.activeName) {
        case '1' :
          getAllRoles().then(response => {
            this.roleList = response.data.result
            getExistRoleIds({ id: row.Id}).then(res => {
              const rows = res.data.result.rows
              rows.forEach((item) => {
                let selectRow = null
                this.roleList.forEach((r) => {
                  if (r.Id === item) {
                    selectRow = r
                  }
                })
                selectRow && this.$refs.multipleTable1[0].toggleRowSelection(selectRow);
              })
              this.listBindLoading = false
            })
          })
          break
        case '2' :
          break
        case '3' :
          break
      }
    },
    validPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.temp.surePassword && this.temp.surePassword) {
        this.$refs.dataForm.validateField('surePassword')
        callback()
      } else {
        if (this.temp.surePassword) {
          this.$refs.dataForm.validateField('surePassword')
          callback()
        } else {
          callback()
        }
      }
    },
    validSurePassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.Password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.rows = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      switch (status) {
        case 'deleted':
          this.handleDelete(row)
          break
        case 'bind':
          this.temp = Object.assign({}, row)
          this.dialogBindVisible = true
          this.getBindList(row)
          break
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    bindConfirm() {
      const roleIdsArr = this.multipleSelection.map((item) => {
        return item.Id
      })
      setRole({ hidId: this.temp.Id, roleIds: roleIdsArr.toString() }).then(response => {
        this.dialogBindVisible = false
        this.$notify({
          title: '成功',
          message: '绑定成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetTemp() {
      this.temp = {
        Id: '',
        LoginName: '',
        Password: '',
        surePassword: '',
        UserName: '',
        UserPhone: '',
        UserMail: '',
        UserGender: 1,
        Job: '',
        Birthday: new Date(),
        Wechat: '',
        QQNumber: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUsers(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUsers(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers({ ids: row.Id }).then((data) => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', 'UserName', 'UserPhone', 'UserMail', 'Job']
        const filterVal = ['Id', 'UserName', 'UserPhone', 'UserMail', 'Job']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
