<template>
  <div class="cancel-order">
    <el-form :inline="true" :model="dataPayForm">
      <el-form-item>
        <el-input v-model="dataPayForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataPayForm.idCard" placeholder="受理凭证号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataPayForm.applyName" placeholder="申请人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataPayForm.applyPhone" placeholder="申请人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataPayForm.name" placeholder="收货人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataPayForm.phone" placeholder="收货人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type == 1">
        <el-select v-model="dataPayForm.bigAreaId" multiple placeholder="办理大区" width="100%" clearable @change="getAreaInfo">
          <el-option
            v-for="item in bigAreaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(type == 1  && dataPayForm.bigAreaId != '') || type == 2">
        <el-select v-model="dataPayForm.areaId" multiple placeholder="办理网点" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataPayForm.postType" placeholder="邮寄类型" width="100%" clearable>
          <el-option
            v-for="item in postTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataPayForm.postRisk" placeholder="是否保价客户" width="100%" clearable>
          <el-option
            v-for="item in postRiskList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
        <el-button @click="getCancelDataList(1)">查询</el-button>
        <!--<el-button v-if="isAuth('sys:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataCancelListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="exportExcel">导出</el-button>-->
      <!--</el-form-item>-->
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
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="applyName"
        header-align="center"
        align="center"
        label="产权人">
      </el-table-column>
      <el-table-column
        prop="applyPhone"
        header-align="center"
        align="center"
        label="申请人电话">
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
        label="收货人电话">
      </el-table-column>
      <el-table-column
        prop="postAddress"
        header-align="center"
        align="center"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="bigAreaName"
        header-align="center"
        align="center"
        label="办理大区">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="办理网点">
      </el-table-column>
      <el-table-column
        prop="createOrderTime"
        header-align="center"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="idCard"
        header-align="center"
        align="center"
        width="180"
        label="凭证编号">
      </el-table-column>
      <el-table-column
        prop="postType"
        header-align="center"
        align="center"
        label="邮寄类型">
        <template slot-scope="scope">
          <span v-for="(item,index) in postTypeList" :key="index" v-if="item.id == scope.row.postType">{{item.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="postRisk"
        header-align="center"
        align="center"
        label="保价客户">
        <template slot-scope="scope">
          <span v-if="scope.row.postRisk === 1">是</span>
          <span v-if="scope.row.postRisk === 2">否</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:order:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.orderId)">支付</el-button>
          <el-button v-if="isAuth('sys:order:info')" type="text" size="small" @click="viewOrder(scope.row.orderId)">查看</el-button>
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

    <!-- 查看 -->
    <view-order v-if="viewOrderVisible" ref="viewOrder"></view-order>
  </div>
</template>

<script>
  import ViewOrder from './view-order.vue'
  export default {
    data(){
      return{
        activeName: 'second',
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
        areaList: [],
        bigAreaList: [],
        postTypeList: [],
        postRiskList: [{
          id: 1,
          name: '是'
        },{
          id: 2,
          name: '否'
        }],
        dataPayForm:{
          orderNumber: '',
          idCard: '',
          applyName: '',
          applyPhone: '',
          name: '',
          phone: '',
          status: 1,
          startOrderTime: '',
          endOrderTime: '',
          areaId: [],
          bigAreaId: [],
          postType: '',
          postRisk: ''
        },
        dataCancelList: [],
        pageCancelIndex: 1,
        pageCancelSize: 10,
        totalCancelPage: 0,
        dataCancelListLoading: false,
        dataCancelListSelections: [],
        addOrUpdateVisible: false,
        viewOrderVisible: false
      }
    },
    activated () {
      this.getPostTypeList()
      this.getBigAreaInfo()
      this.getAreaInfo()
      this.getCancelDataList(1)
    },
    methods: {
      // 邮寄类型
      getPostTypeList(){
        this.$http({
          url: this.$http.adornUrl('/sys/bussiness/allList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.postTypeList = []
          if(data && data.code === 0){
            data.list.forEach((item) => {
              this.postTypeList.push({
                id: item.id,
                name: item.bussinessName
              })
            })
          }
        })
      },
      // 获取数据列表
      getCancelDataList (page) {
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataPayForm.startOrderTime = this.createOrderTime[0]
          this.dataPayForm.endOrderTime = this.createOrderTime[1]
        }else{
          this.dataPayForm.startOrderTime = ""
          this.dataPayForm.endOrderTime = ""
        }

        if(this.dataPayForm.bigAreaId.length === 0){
          this.dataPayForm.areaId = []
        }
        // 数据转换 areaId
        let multiAreaId = ''
        if(this.dataPayForm.areaId && this.dataPayForm.areaId.length > 0){
          multiAreaId = this.dataPayForm.areaId.join(',')
        }
        // 数据转换，大区bigAreaId
        let multiBigAreaId = ''
        if(this.dataPayForm.bigAreaId && this.dataPayForm.bigAreaId.length > 0){
          multiBigAreaId = this.dataPayForm.bigAreaId.join(',')
        }

        this.dataCancelListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'limit': this.pageCancelSize,
            'orderNumber': this.dataPayForm.orderNumber,
            'idCard': this.dataPayForm.idCard,
            'applyName': this.dataPayForm.applyName,
            'applyPhone': this.dataPayForm.applyPhone,
            'name': this.dataPayForm.name,
            'phone': this.dataPayForm.phone,
            'status': this.dataPayForm.status,
            'startOrderTime': this.dataPayForm.startOrderTime,
            'endOrderTime': this.dataPayForm.endOrderTime,
            // 'status': this.dataPayForm.status,
            'areaId': multiBigAreaId,  // 大区
            'handleAreaId': multiAreaId, // 网点
            'postType': this.dataPayForm.postType,
            'postRisk': this.dataPayForm.postRisk
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
        this.getCancelDataList(this.pageCancelIndex)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageCancelIndex = val
        this.getCancelDataList(this.pageCancelIndex)
      },
      // 多选
      selectionCancelChangeHandle (val) {
        this.dataCancelListSelections = val
      },
      // 支付
      addOrUpdateHandle (id) {
        this.$http({
          url: this.$http.adornUrl('/sys/order/findOrderMoney'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': id
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let title = ''
            if(data.totalRate == ''){
              title = "订单号" + data.orderNum  +"，姓名为" + data.name+ "的客户,请在柜台前支付运费共计" + data.totalAmount + "元"
            }else{
              title = "订单号" + data.orderNum  +"，姓名为" + data.name+ "的客户,请在柜台前支付费用共计" + (data.totalAmount + data.totalRate) + "元," +
                "其中包含运费" + data.totalAmount +"元和保险费用" + data.totalRate +"元"
            }
            this.$confirm(title, '提示', {
              confirmButtonText: '支付完成',
              // cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl('/sys/order/updateOrderState'),
                method: 'get',
                params: this.$http.adornParams({
                  'orderId': data.orderId
                })
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.getCancelDataList(this.pageCancelIndex)
                    }
                  })
                }
              })
            }).catch(()=>{

            })
          }
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
                  this.getCancelDataList(1)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 查看订单
      viewOrder(id){
        this.viewOrderVisible = true
        this.$nextTick(() => {
          this.$refs.viewOrder.init(id)
        })
      },
      exportExcel(){
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataPayForm.startOrderTime = this.createOrderTime[0]
          this.dataPayForm.endOrderTime = this.createOrderTime[1]
        }else {
          this.dataPayForm.startOrderTime = ""
          this.dataPayForm.endOrderTime = ""
        }
        this.$http({
          url: this.$http.adornUrl('/sys/order/exportInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.dataPayForm.startOrderTime,
            'endOrderTime': this.dataPayForm.endOrderTime,
            'status': this.dataPayForm.status
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            window.location.href = this.$http.adornUrl('/sys/order/exportOrder') + "?startOrderTime="
              + this.dataPayForm.startOrderTime + "&endOrderTime=" + this.dataPayForm.endOrderTime
              + "&status=" + this.dataPayForm.status
          } else {
            this.$message.error(data.msg)
          }
        })
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
            'areaId': this.type === 1 ? this.dataPayForm.bigAreaId.join(',') : ''
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
    components: {
      ViewOrder
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
