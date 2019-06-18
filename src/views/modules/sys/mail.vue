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
        <!--<el-button v-if="isAuth('sys:mail:save')" type="primary" @click="importExcel">导入</el-button>-->
        <!--<el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-upload
          :show-file-list="false"
          :action="uploadMail.importUrl"
          :on-success="onDataSetUploadSuccess"
          :on-error="onDataSetUploadError"
          :before-upload="beforeAvatarUpload"
          :file-list="uploadMail.fileList">
          <el-button type="primary" :loading="exportLoading">导入</el-button>
        </el-upload>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<el-button @click="downExcel">下载导入模板</el-button>-->
      <!--</el-form-item>-->
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
      <el-table-column
        prop="mailNum"
        header-align="center"
        align="center"
        label="邮件号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? '已使用': (scope.row.status === 2 ? '未使用' : '--')}}</span>
        </template>
      </el-table-column>
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
        exportLoading: false,
        statusList:[{
          id:1,
          name: '已使用'
        },{
          id: 2,
          name: '未使用'
        }],
        uploadMail: {
          importUrl: process.env.BASE_API + '/sys/file/importExcel',
          fileList: []
        },
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
          url: this.$http.adornUrl('/sys/file/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'status': this.dataForm.status
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

      onDataSetUploadSuccess(res, file){

        if(res.code === 0){
          this.$message.success("导入成功");
        }else{
          this.$message.error(res.msg);
        }
        this.exportLoading = false
      },

      onDataSetUploadError(res, file){
        console.log("上传失败------")
        console.log(res)
        console.log(file)
      },

      beforeAvatarUpload(file){
        this.exportLoading = true
        let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'

        const isJPG = extension || extension2
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.exportLoading = false
          this.$message.error('上传格式只能是 xls, xlsx 格式!');
        }
        if (!isLt2M) {
          this.exportLoading = false
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt2M;
      },

      // downExcel(){
      //   // window.open("../../../assets/template/template.xlsx","_parent")
      //   window.location.href = '../../../assets/template/template.xlsx'
      // }
    },
    activated () {
      this.getDataList()
    }
  }
</script>

<style scoped>

</style>
