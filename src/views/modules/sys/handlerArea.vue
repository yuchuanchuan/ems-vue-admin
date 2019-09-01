<template>
  <div class="mod-handlerArea">
    <el-form :inline="true" :model="dataForm">
      <el-form-item v-if="type == 1">
        <el-select v-model="dataForm.areaId" placeholder="请选择受理大区" width="100%" clearable>
          <el-option
            v-for="item in areaType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.handleArea" placeholder="受理地区名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:handlerArea:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="handleArea"
        header-align="center"
        align="center"
        label="受理地区">
      </el-table-column>
      <el-table-column
        prop="handleAddress"
        header-align="center"
        align="center"
        label="受理地点">
      </el-table-column>
      <el-table-column
        prop="areaId"
        header-align="center"
        align="center"
        label="所在大区">
        <template slot-scope="scope">
          <span v-if="scope.row.areaId === 1">市登记中心</span>
          <span v-if="scope.row.areaId === 2">市内六区</span>
          <span v-if="scope.row.areaId === 3">环城四区</span>
          <span v-if="scope.row.areaId === 4">新五区</span>
          <span v-if="scope.row.areaId === 5">滨海新区</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="systemNo"
        header-align="center"
        align="center"
        label="不动产预约系统地区代号">
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
        v-if="type == 1"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:handlerArea:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('sys:handlerArea:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './handlerArea-add-or-update'
  export default {
    data(){
      return{
        areaType:[
          {
            'id': 1,
            'name': '市登记中心'
          },{
            'id': 2,
            'name': '市内六区'
          },{
            'id': 3,
            'name': '环城四区'
          },{
            'id': 4,
            'name': '新五区'
          },{
            'id': 5,
            'name': '滨海新区'
          }
        ],
        addOrUpdateVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        areaList: [],
        dataForm:{
          areaId: '',
          // handleAddress: ''
          handleArea: ''
        }
      }
    },
    methods:{
      getAreaList(){
        this.$http({
          url: this.$http.adornUrl('/sys/area/region'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.areaList = []
          if(data && data.code === 0 && data.regionList && data.regionList.length > 0){
            data.regionList[0].childList.forEach((item) => {
              this.areaList.push({
                id: item.id,
                name: item.name
              })
            })
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/handlerArea/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'areaId': this.dataForm.areaId,
            'handleArea': this.dataForm.handleArea
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/handlerArea/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
      }
    },
    activated () {
      this.getDataList()
      this.getAreaList()
    },
    components: {
      AddOrUpdate
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    }
  }
</script>

<style scoped>

</style>
