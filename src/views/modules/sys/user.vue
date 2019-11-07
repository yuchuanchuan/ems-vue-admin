<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type == 1">
        <el-select v-model="dataForm.bigAreaId" multiple placeholder="办理大区" width="100%" clearable @change="getAreaInfo">
          <el-option
            v-for="item in bigAreaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(type == 1  && dataForm.bigAreaId != '') || type == 2">
        <el-select v-model="dataForm.areaId" multiple placeholder="办理网点" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save') && type == 1" type="primary" @click="addOrUpdateHandle(1)">新增区管理员</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="success" @click="addOrUpdateHandle(2)">新增网点管理员</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
        <!--type="selection"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="用户类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? '总部管理员': (scope.row.type === 2 ? '区管理员' : (scope.row.type === 3 ? '网点管理员' : '--'))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bigAreaName"
        header-align="center"
        align="center"
        label="所属大区">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="所属网点">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
        v-if="type != 3"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="text" size="small"
                     :disabled="scope.row.type === 2 && type === 2"
                     @click="addOrUpdateHandle('',scope.row.userId)">
            修改
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)"
                     :disabled="scope.row.type === 2 && type === 2">
            删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          phone: '',
          areaId: [],
          bigAreaId: []
        },
        dataList: [],
        areaList: [],
        bigAreaList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      this.getBigAreaInfo()
      this.getAreaInfo()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if(this.dataForm.bigAreaId.length === 0){
          this.dataForm.areaId = []
        }
        // 数据转换 areaId
        let multiAreaId = ''
        if(this.dataForm.areaId && this.dataForm.areaId.length > 0){
          multiAreaId = this.dataForm.areaId.join(',')
        }
        // 数据转换，大区bigAreaId
        let multiBigAreaId = ''
        if(this.dataForm.bigAreaId && this.dataForm.bigAreaId.length > 0){
          multiBigAreaId = this.dataForm.bigAreaId.join(',')
        }

        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.dataForm.userName,
            'phone': this.dataForm.phone,
            'areaId': multiAreaId,
            'bigAreaId': multiBigAreaId
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (type,id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(type,id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      getBigAreaInfo(){
        this.$http({
          url: this.$http.adornUrl('/sys/bigarea/allList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.bigAreaList = []
          if(data && data.code === 0 && data.list && data.list.length > 0){
            data.list.forEach((item) => {
              this.bigAreaList.push({
                id: item.id,
                name: item.name
              })
            })
          }
        })
      },
      getAreaInfo(){
        // this.$http({
        //   url: this.$http.adornUrl('/sys/handlerArea/areaNameList'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({ data }) => {
        //   this.areaList = []
        //   if(data && data.code === 0){
        //     data.regionList.forEach((item) => {
        //       this.areaList.push({
        //         id: item.id,
        //         name: item.handleArea
        //       })
        //     })
        //   }
        // })
        let url = ""
        if(this.type === 1){
          url = this.$http.adornUrl('/sys/handlerArea/areaNames')
        }else{
          url = this.$http.adornUrl('/sys/handlerArea/areaNameList')
        }
        this.$http({
          url: url,
          method: 'get',
          params: this.$http.adornParams({
            'areaId': this.type === 1 ? this.dataForm.bigAreaId.join(',') : ''
          })
        }).then(({ data }) => {
          this.areaList = []
          if(data && data.code === 0){
            data.regionList.forEach((item) => {
              this.areaList.push({
                id: item.id,
                name: item.handleArea
              })
            })
          }
        })
      }
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    }
  }
</script>
