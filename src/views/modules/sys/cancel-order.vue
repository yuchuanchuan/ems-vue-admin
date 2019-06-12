<template>
  <div class="cancel-order">
    <el-form :inline="true" :model="dataCancelForm">
      <el-form-item>
        <el-input v-model="dataCancelForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataCancelForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="createOrderTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="订单开始日期"
          end-placeholder="订单结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getCancelDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataCancelListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportExcel">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataCancelList"
      border
      v-loading="dataCancelListLoading"
      @selection-change="selectionCancelChangeHandle"
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
        prop="areaName"
        header-align="center"
        align="center"
        label="办理地区">
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
          <el-button v-if="isAuth('sys:order:update')" type="text" size="small" @click="addOrUpdateHandle('',scope.row.orderId)">修改</el-button>
          <el-button v-if="isAuth('sys:order:delete')" type="text" size="small" @click="deleteHandle(scope.row.orderId)" :disabled="scope.row.status !== 1 && scope.row.status !== 2">取消订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageCancelIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageCancelSize"
      :total="totalCancelPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        createOrderTime: [],
        dataCancelForm:{
          orderNumber: '',
          phone: '',
          status: 5,
          startOrderTime: '',
          endOrderTime: ''
        },
        dataCancelList: [],
        pageCancelIndex: 1,
        pageCancelSize: 10,
        totalCancelPage: 0,
        dataCancelListLoading: false,
        dataCancelListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getCancelDataList()
    },
    methods: {
      // 获取数据列表
      getCancelDataList () {
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataCancelForm.startOrderTime = this.createOrderTime[0]
          this.dataCancelForm.endOrderTime = this.createOrderTime[1]
        }else{
          this.dataCancelForm.startOrderTime = ""
          this.dataCancelForm.endOrderTime = ""
        }

        this.dataCancelListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageCancelIndex,
            'limit': this.pageCancelSize,
            'orderNumber': this.dataCancelForm.userName,
            'phone': this.dataCancelForm.phone,
            'status': this.dataCancelForm.status,
            'startOrderTime': this.dataCancelForm.startOrderTime,
            'endOrderTime': this.dataCancelForm.endOrderTime
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataCancelList = data.page.list
            this.totalCancelPage = data.page.totalCount
          } else {
            this.dataCancelList = []
            this.totalCancelPage = 0
          }
          this.dataCancelListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageCancelSize = val
        this.pageCancelIndex = 1
        this.getCancelDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageCancelIndex = val
        this.getCancelDataList()
      },
      // 多选
      selectionCancelChangeHandle (val) {
        this.dataCancelListSelections = val
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
        var userIds = id ? [id] : this.dataCancelListSelections.map(item => {
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
                  this.getCancelDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      exportExcel(){
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataCancelForm.startOrderTime = this.createOrderTime[0]
          this.dataCancelForm.endOrderTime = this.createOrderTime[1]
        }else {
          this.dataCancelForm.startOrderTime = ""
          this.dataCancelForm.endOrderTime = ""
        }
        this.$http({
          url: this.$http.adornUrl('/sys/order/exportInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.dataCancelForm.startOrderTime,
            'endOrderTime': this.dataCancelForm.endOrderTime,
            'status': this.dataCancelForm.status
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            window.location.href = this.$http.adornUrl('/sys/order/exportOrder') + "?startOrderTime="
              + this.dataCancelForm.startOrderTime + "&endOrderTime=" + this.dataCancelForm.endOrderTime
              + "&status=" + this.dataCancelForm.status
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
