<template>
  <div class="receipt-order">
    <el-form :inline="true" :model="dataReceiptForm">
      <el-form-item>
        <el-input v-model="dataReceiptForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataReceiptForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getReceiptDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataReceiptListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataReceiptList"
      border
      v-loading="dataReceiptListLoading"
      @selection-change="selectionReceiptChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        width="120"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        label="快递单号">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="收货人">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="postAddress"
        header-align="center"
        align="center"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="handleAreaId"
        header-align="center"
        align="center"
        label="办理地点">
      </el-table-column>
      <el-table-column
        prop="createOrderTime"
        header-align="center"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="housingAuthority"
        header-align="center"
        align="center"
        width="180"
        label="凭证截图">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:order:update')" type="text" size="small" @click="addOrUpdateHandle('',scope.row.userId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">取消订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageReceiptIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageReceiptSize"
      :total="totalReceiptPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        activeName: 'first',
        dataReceiptForm:{
          orderNumber: '',
          phone: '',
          status: 2
        },
        dataReceiptList: [],
        pageReceiptIndex: 1,
        pageReceiptSize: 10,
        totalReceiptPage: 0,
        dataReceiptListLoading: false,
        dataReceiptListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getReceiptDataList()
    },
    methods: {
      // 获取数据列表
      getReceiptDataList () {
        this.dataReceiptListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageReceiptIndex,
            'limit': this.pageReceiptSize,
            'orderNumber': this.dataReceiptForm.userName,
            'phone': this.dataReceiptForm.phone
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataReceiptList = data.page.list
            this.totalReceiptPage = data.page.totalCount
          } else {
            this.dataReceiptList = []
            this.totalReceiptPage = 0
          }
          this.dataReceiptListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageReceiptSize = val
        this.pageReceiptIndex = 1
        this.getReceiptDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageReceiptIndex = val
        this.getReceiptDataList()
      },
      // 多选
      selectionReceiptChangeHandle (val) {
        this.dataReceiptListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataReceiptListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/order/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getReceiptDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    },
  }
</script>

<style scoped>

</style>
