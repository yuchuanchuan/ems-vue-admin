<template>
  <div class="mod-mail">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-select v-model="dataForm.status" placeholder="请选择" width="100%" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:mail:save')" type="primary" @click="importExcel">导入</el-button>
        <!--<el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
      <!--<el-table-column-->
        <!--prop="roleName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="角色名称">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="remark"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="备注">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="createTime"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="180"-->
        <!--label="创建时间">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--fixed="right"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="150"-->
        <!--label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>-->
          <!--<el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
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

  </div>
</template>

<script>
  export default {
    data(){
      return{
        statusList:[{
          id:1,
          name: '已使用'
        },{
          id: 2,
          name: '未使用'
        }],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataForm:{
          status: ''
        }
      }
    },
    methods:{
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'roleName': this.dataForm.roleName
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
    },
    activated () {
      this.getDataList()
    }
  }
</script>

<style scoped>

</style>
